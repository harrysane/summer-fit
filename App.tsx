import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, View } from "react-native";
import { TabBar } from "./src/components/TabBar";
import { FoodLogScreen } from "./src/screens/FoodLogScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { TodayScreen } from "./src/screens/TodayScreen";
import { TrainingLogScreen } from "./src/screens/TrainingLogScreen";
import { foodRecordsSeed, trainingLogsSeed } from "./src/data/sampleLogs";
import { todayPlan } from "./src/data/trainingPlans";
import { FoodRecord, TrainingCheckIn, TrainingSetLog } from "./src/models/types";
import { registerSedentaryReminderNotifications } from "./src/services/notificationService";

type TabKey = "today" | "training" | "food" | "nutrition";

const TRAINING_CHECK_INS_STORAGE_KEY = "summer-fit.trainingCheckIns";
const WEEKLY_TRAINING_GOAL = 4;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [trainingLogs, setTrainingLogs] = useState<TrainingSetLog[]>(trainingLogsSeed);
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>(foodRecordsSeed);
  const [trainingCheckIns, setTrainingCheckIns] = useState<TrainingCheckIn[]>([]);

  useEffect(() => {
    registerSedentaryReminderNotifications().catch((error) => {
      console.warn("Notification setup failed", error);
    });
  }, []);

  useEffect(() => {
    setTrainingCheckIns(readTrainingCheckInsFromStorage());
  }, []);

  const todayTrainingLogs = useMemo(
    () => trainingLogs.filter((log) => log.planId === todayPlan.id),
    [trainingLogs]
  );
  const todayDate = useMemo(() => formatLocalDate(new Date()), []);
  const isTodayCheckedIn = useMemo(
    () => trainingCheckIns.some((checkIn) => checkIn.date === todayDate),
    [todayDate, trainingCheckIns]
  );
  const weeklyCheckInCount = useMemo(
    () => countWeeklyCheckIns(trainingCheckIns, new Date()),
    [trainingCheckIns]
  );
  const weeklyGoal = WEEKLY_TRAINING_GOAL;
  const weeklyCompletionRate = Math.min(Math.round((weeklyCheckInCount / weeklyGoal) * 100), 100);

  const handleTodayCheckIn = () => {
    if (isTodayCheckedIn) {
      return;
    }

    const nextCheckIns = [
      { date: todayDate, completedAt: new Date().toISOString() },
      ...trainingCheckIns
    ];
    setTrainingCheckIns(nextCheckIns);
    saveTrainingCheckInsToStorage(nextCheckIns);
    Alert.alert("今日已完成", "训练打卡已经保存。");
  };

  const handleDeleteTrainingLog = (id: string) => {
    setTrainingLogs((current) => current.filter((log) => log.id !== id));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          {activeTab === "today" ? (
            <TodayScreen
              plan={todayPlan}
              isTodayCheckedIn={isTodayCheckedIn}
              weeklyCheckInCount={weeklyCheckInCount}
              weeklyGoal={weeklyGoal}
              weeklyCompletionRate={weeklyCompletionRate}
              onLogSet={(log) => {
                setTrainingLogs((current) => [log, ...current]);
                Alert.alert("已记录", "这一组训练已经保存到本地记录。");
              }}
              onCheckIn={handleTodayCheckIn}
              completedSetCount={todayTrainingLogs.length}
            />
          ) : null}
          {activeTab === "training" ? (
            <TrainingLogScreen logs={trainingLogs} onDeleteLog={handleDeleteTrainingLog} />
          ) : null}
          {activeTab === "food" ? (
            <FoodLogScreen records={foodRecords} onChangeRecords={setFoodRecords} />
          ) : null}
          {activeTab === "nutrition" ? (
            <NutritionScreen foodRecords={foodRecords} />
          ) : null}
        </View>
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f5f0"
  },
  content: {
    flex: 1
  }
});

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function countWeeklyCheckIns(checkIns: TrainingCheckIn[], currentDate: Date) {
  const weekStart = getWeekStartDate(currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const uniqueDates = new Set<string>();
  for (const checkIn of checkIns) {
    const checkInDate = parseLocalDate(checkIn.date);
    if (!checkInDate) {
      continue;
    }

    if (checkInDate >= weekStart && checkInDate <= weekEnd) {
      uniqueDates.add(checkIn.date);
    }
  }

  return uniqueDates.size;
}

function getWeekStartDate(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);
  return start;
}

function parseLocalDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function readTrainingCheckInsFromStorage(): TrainingCheckIn[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return [];
    }

    const raw = window.localStorage.getItem(TRAINING_CHECK_INS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTrainingCheckIn);
  } catch {
    return [];
  }
}

function saveTrainingCheckInsToStorage(checkIns: TrainingCheckIn[]) {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    window.localStorage.setItem(TRAINING_CHECK_INS_STORAGE_KEY, JSON.stringify(checkIns));
  } catch {
    // localStorage can be unavailable in private mode or non-web runtimes.
  }
}

function isTrainingCheckIn(value: unknown): value is TrainingCheckIn {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TrainingCheckIn>;
  return typeof candidate.date === "string" && typeof candidate.completedAt === "string";
}
