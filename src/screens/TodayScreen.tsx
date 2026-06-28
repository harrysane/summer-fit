import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CountdownTimer } from "../components/CountdownTimer";
import { ExerciseCard } from "../components/ExerciseCard";
import { SectionCard } from "../components/SectionCard";
import { userProfile } from "../data/userProfile";
import { TrainingPlan, TrainingSetLog } from "../models/types";
import {
  analyzeTrainingAdaptation,
  TrainingAdaptationResult
} from "../utils/trainingAdaptation";

type Props = {
  plan: TrainingPlan;
  selectedWeekday: number;
  todayWeekday: number;
  availablePlans: Record<number, TrainingPlan>;
  onSelectWeekday: (weekday: number) => void;
  completedSetCount: number;
  isTodayCheckedIn: boolean;
  weeklyCheckInCount: number;
  weeklyGoal: number;
  weeklyCompletionRate: number;
  trainingLogs: TrainingSetLog[];
  onLogSet: (log: TrainingSetLog) => void;
  onCheckIn: () => void;
  onEnableSedentaryReminders: () => void;
  isEnablingSedentaryReminders: boolean;
  sedentaryReminderMessage: string;
};

const WEEKDAY_OPTIONS = [
  { value: 1, label: "周一" },
  { value: 2, label: "周二" },
  { value: 3, label: "周三" },
  { value: 4, label: "周四" },
  { value: 5, label: "周五" },
  { value: 6, label: "周六" },
  { value: 0, label: "周日" }
];

export function TodayScreen({
  plan,
  selectedWeekday,
  todayWeekday,
  availablePlans,
  onSelectWeekday,
  completedSetCount,
  isTodayCheckedIn,
  weeklyCheckInCount,
  weeklyGoal,
  weeklyCompletionRate,
  trainingLogs,
  onLogSet,
  onCheckIn,
  onEnableSedentaryReminders,
  isEnablingSedentaryReminders,
  sedentaryReminderMessage
}: Props) {
  const isViewingToday = selectedWeekday === todayWeekday;
  const [adaptationInsight, setAdaptationInsight] = useState<TrainingAdaptationResult | null>(null);

  const handleCheckInPress = () => {
    onCheckIn();

    const insight = analyzeTrainingAdaptation({ logs: trainingLogs, planId: plan.id });
    setAdaptationInsight(insight.shouldPrompt ? insight : null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.eyebrow}>今日训练</Text>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.subtitle}>
          {userProfile.heightCm}cm / {userProfile.weightKg}kg / {plan.estimatedMinutes} 分钟
        </Text>
      </View>

      <View style={styles.weekdaySelector}>
        {WEEKDAY_OPTIONS.map((option) => {
          const isSelected = selectedWeekday === option.value;
          const isToday = todayWeekday === option.value;
          const isAvailable = Boolean(availablePlans[option.value]);

          return (
            <Pressable
              key={option.value}
              disabled={!isAvailable}
              onPress={() => onSelectWeekday(option.value)}
              style={[
                styles.weekdayButton,
                isSelected ? styles.weekdayButtonSelected : null,
                !isAvailable ? styles.weekdayButtonDisabled : null
              ]}
            >
              <Text
                style={[
                  styles.weekdayButtonText,
                  isSelected ? styles.weekdayButtonTextSelected : null
                ]}
              >
                {option.label}
              </Text>
              {isToday ? <Text style={styles.weekdayTodayText}>今天</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {!isViewingToday ? (
        <SectionCard style={styles.viewingNotice}>
          <Text style={styles.viewingNoticeText}>
            当前正在查看{weekdayName(selectedWeekday)}计划，打卡仍记录为今天。
          </Text>
        </SectionCard>
      ) : null}

      <SectionCard>
        <CountdownTimer key={plan.id} blocks={plan.blocks} />
      </SectionCard>

      <SectionCard style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>执行重点</Text>
        <View style={styles.tagRow}>
          {plan.focus.map((item) => (
            <Text key={item} style={styles.tag}>{item}</Text>
          ))}
        </View>
        <Text style={styles.note}>
          已记录 {completedSetCount} 组。肩前侧如果从“有点不舒服”变成会影响动作发力或姿势的明显疼痛，请降低动作幅度或强度。
        </Text>
        <View style={styles.painGuide}>
          <Text style={styles.painGuideText}>疼痛评分：0 完全不痛；1-3 轻微不适，可继续观察。</Text>
          <Text style={styles.painGuideText}>4-6 明显疼痛，应降低幅度或强度；7-10 强烈疼痛，应停止相关动作。</Text>
        </View>
        <View style={styles.weeklyStats}>
          <View>
            <Text style={styles.weeklyStatsLabel}>本周已训练</Text>
            <Text style={styles.weeklyStatsValue}>{weeklyCheckInCount} 天</Text>
          </View>
          <View>
            <Text style={styles.weeklyStatsLabel}>本周目标</Text>
            <Text style={styles.weeklyStatsValue}>{weeklyGoal} 天</Text>
          </View>
          <View>
            <Text style={styles.weeklyStatsLabel}>完成率</Text>
            <Text style={styles.weeklyStatsValue}>{weeklyCompletionRate}%</Text>
          </View>
        </View>
        <Text style={styles.checkInStatus}>
          {isTodayCheckedIn ? "打卡状态：今日已完成" : "打卡状态：今日未完成"}
        </Text>
        <View style={styles.reminderBox}>
          <View style={styles.reminderTextGroup}>
            <Text style={styles.reminderTitle}>久坐提醒</Text>
            <Text style={styles.reminderText}>{sedentaryReminderMessage}</Text>
          </View>
          <Pressable
            disabled={isEnablingSedentaryReminders}
            onPress={onEnableSedentaryReminders}
            style={[
              styles.reminderButton,
              isEnablingSedentaryReminders ? styles.reminderButtonDisabled : null
            ]}
          >
            <Text style={styles.reminderButtonText}>
              {isEnablingSedentaryReminders ? "开启中..." : "开启久坐提醒"}
            </Text>
          </Pressable>
        </View>
        <Pressable
          disabled={isTodayCheckedIn}
          onPress={handleCheckInPress}
          style={[styles.checkInButton, isTodayCheckedIn ? styles.checkInButtonDisabled : null]}
        >
          <Text style={[styles.checkInButtonText, isTodayCheckedIn ? styles.checkInButtonTextDisabled : null]}>
            {isTodayCheckedIn ? "今日已完成" : "完成今日训练"}
          </Text>
        </Pressable>
      </SectionCard>

      {adaptationInsight ? (
        <SectionCard style={styles.adaptationCard}>
          <Text style={styles.adaptationLabel}>{reasonLabel(adaptationInsight.reason)}</Text>
          <Text style={styles.adaptationMessage}>{adaptationInsight.message}</Text>
          {adaptationInsight.suggestedAction ? (
            <Text style={styles.adaptationAction}>{adaptationInsight.suggestedAction}</Text>
          ) : null}
          <Pressable style={styles.adaptationButton} onPress={() => setAdaptationInsight(null)}>
            <Text style={styles.adaptationButtonText}>知道了</Text>
          </Pressable>
        </SectionCard>
      ) : null}

      {plan.blocks.map((block) => (
        <View key={block.id} style={styles.block}>
          <Text style={styles.blockTitle}>
            {block.startMinute}' - {block.startMinute + block.durationMinutes}' {block.title}
          </Text>
          {block.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              planId={plan.id}
              exercise={exercise}
              onLogSet={onLogSet}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function weekdayName(weekday: number) {
  return WEEKDAY_OPTIONS.find((option) => option.value === weekday)?.label ?? "所选日期";
}

function reasonLabel(reason: TrainingAdaptationResult["reason"]) {
  const labels: Record<TrainingAdaptationResult["reason"], string> = {
    "early-calibration": "训练适应校准",
    "too-easy": "当前计划可能偏轻",
    "too-hard": "当前计划可能偏难",
    "discomfort-risk": "存在不适风险",
    "missing-feedback": "缺少主观反馈",
    "no-prompt": "无需额外提示"
  };

  return labels[reason];
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    paddingBottom: 28
  },
  eyebrow: {
    color: "#d4663f",
    fontSize: 13,
    fontWeight: "900"
  },
  title: {
    color: "#24211d",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 4
  },
  subtitle: {
    color: "#6d665d",
    fontSize: 14,
    marginTop: 6
  },
  weekdaySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  weekdayButton: {
    alignItems: "center",
    backgroundColor: "#eee5da",
    borderColor: "#e1d5c6",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    minWidth: 58,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  weekdayButtonSelected: {
    backgroundColor: "#243b35",
    borderColor: "#243b35"
  },
  weekdayButtonDisabled: {
    opacity: 0.45
  },
  weekdayButtonText: {
    color: "#5f584f",
    fontSize: 13,
    fontWeight: "900"
  },
  weekdayButtonTextSelected: {
    color: "#fff"
  },
  weekdayTodayText: {
    color: "#d4663f",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2
  },
  viewingNotice: {
    backgroundColor: "#fff7e8",
    borderColor: "#eed8ae",
    borderWidth: 1
  },
  viewingNoticeText: {
    color: "#6a4b1d",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  summaryCard: {
    gap: 10
  },
  summaryTitle: {
    color: "#24211d",
    fontSize: 16,
    fontWeight: "900"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  tag: {
    backgroundColor: "#eef4ef",
    borderRadius: 8,
    color: "#243b35",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  note: {
    color: "#5f584f",
    fontSize: 14,
    lineHeight: 20
  },
  painGuide: {
    backgroundColor: "#fff7e8",
    borderColor: "#eed8ae",
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  painGuideText: {
    color: "#6a4b1d",
    fontSize: 12,
    lineHeight: 17
  },
  weeklyStats: {
    backgroundColor: "#eef4ef",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    padding: 12
  },
  weeklyStatsLabel: {
    color: "#5f6f66",
    fontSize: 12,
    fontWeight: "700"
  },
  weeklyStatsValue: {
    color: "#243b35",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4
  },
  checkInStatus: {
    color: "#243b35",
    fontSize: 14,
    fontWeight: "800"
  },
  reminderBox: {
    alignItems: "center",
    backgroundColor: "#f4efe7",
    borderColor: "#e3d7c8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 10
  },
  reminderTextGroup: {
    flex: 1,
    gap: 3
  },
  reminderTitle: {
    color: "#243b35",
    fontSize: 13,
    fontWeight: "900"
  },
  reminderText: {
    color: "#6d665d",
    fontSize: 12,
    lineHeight: 17
  },
  reminderButton: {
    alignItems: "center",
    backgroundColor: "#d4663f",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: 12
  },
  reminderButtonDisabled: {
    backgroundColor: "#c9b9a7"
  },
  reminderButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900"
  },
  checkInButton: {
    alignItems: "center",
    backgroundColor: "#243b35",
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center"
  },
  checkInButtonDisabled: {
    backgroundColor: "#e7ded2"
  },
  checkInButtonText: {
    color: "#fff",
    fontWeight: "900"
  },
  checkInButtonTextDisabled: {
    color: "#6d665d"
  },
  adaptationCard: {
    backgroundColor: "#eef4ef",
    borderColor: "#c9d8cf",
    borderWidth: 1,
    gap: 10
  },
  adaptationLabel: {
    color: "#243b35",
    fontSize: 14,
    fontWeight: "900"
  },
  adaptationMessage: {
    color: "#34443e",
    fontSize: 14,
    lineHeight: 20
  },
  adaptationAction: {
    color: "#5a4c32",
    fontSize: 13,
    lineHeight: 19
  },
  adaptationButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#243b35",
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: 14
  },
  adaptationButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900"
  },
  block: {
    gap: 12
  },
  blockTitle: {
    color: "#2d2923",
    fontSize: 18,
    fontWeight: "900"
  }
});
