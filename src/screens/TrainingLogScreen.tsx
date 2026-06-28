import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { TrainingSetLog } from "../models/types";

type Props = {
  logs: TrainingSetLog[];
  onDeleteLog: (id: string) => void;
};

type TrainingLogFilter =
  | "all"
  | "today"
  | "this-week"
  | "monday-plan"
  | "tuesday-plan"
  | "wednesday-plan"
  | "thursday-plan"
  | "friday-plan"
  | "saturday-plan"
  | "sunday-plan";

const FILTER_OPTIONS: { key: TrainingLogFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "today", label: "今天" },
  { key: "this-week", label: "本周" },
  { key: "monday-plan", label: "周一" },
  { key: "tuesday-plan", label: "周二" },
  { key: "wednesday-plan", label: "周三" },
  { key: "thursday-plan", label: "周四" },
  { key: "friday-plan", label: "周五" },
  { key: "saturday-plan", label: "周六" },
  { key: "sunday-plan", label: "周日" }
];

const PLAN_FILTERS = new Set<TrainingLogFilter>([
  "monday-plan",
  "tuesday-plan",
  "wednesday-plan",
  "thursday-plan",
  "friday-plan",
  "saturday-plan",
  "sunday-plan"
]);

export function TrainingLogScreen({ logs, onDeleteLog }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<TrainingLogFilter>("all");
  const filteredLogs = useMemo(
    () => filterTrainingLogs(logs, selectedFilter, new Date()),
    [logs, selectedFilter]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>训练记录</Text>

      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selectedFilter === option.key;

          return (
            <Pressable
              key={option.key}
              onPress={() => setSelectedFilter(option.key)}
              style={[styles.filterButton, isSelected ? styles.filterButtonActive : null]}
            >
              <Text style={[styles.filterText, isSelected ? styles.filterTextActive : null]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <SectionCard>
            <Text style={styles.emptyTitle}>
              {logs.length === 0 ? "还没有训练记录" : "当前筛选条件下暂无训练记录"}
            </Text>
            <Text style={styles.emptyText}>
              在今日页保存每一组训练后，这里会显示次数、弹力带、RPE 和肩痛评分。
            </Text>
          </SectionCard>
        }
        renderItem={({ item }) => (
          <SectionCard style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.exercise}>{item.exerciseName}</Text>
              <Text style={styles.date}>{new Date(getLogDateValue(item)).toLocaleString()}</Text>
            </View>
            <Text style={styles.detail}>
              第 {item.setNumber} 组 · {item.reps} 次 ·{" "}
              {item.bandKg === 0 ? "徒手" : `${item.bandKg}kg`} · RPE {item.rpe} · 肩痛{" "}
              {item.shoulderPainScore}/10
            </Text>
            <Pressable style={styles.deleteButton} onPress={() => onDeleteLog(item.id)}>
              <Text style={styles.deleteButtonText}>删除</Text>
            </Pressable>
          </SectionCard>
        )}
      />
    </View>
  );
}

function filterTrainingLogs(
  logs: TrainingSetLog[],
  selectedFilter: TrainingLogFilter,
  currentDate: Date
) {
  if (selectedFilter === "all") {
    return logs;
  }

  if (selectedFilter === "today") {
    return logs.filter((log) => isSameLocalDate(getLogDateValue(log), currentDate));
  }

  if (selectedFilter === "this-week") {
    const weekStart = getWeekStartDate(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return logs.filter((log) => {
      const logDate = new Date(getLogDateValue(log));
      return logDate >= weekStart && logDate <= weekEnd;
    });
  }

  if (PLAN_FILTERS.has(selectedFilter)) {
    return logs.filter((log) => log.planId === selectedFilter);
  }

  return logs;
}

function getLogDateValue(log: TrainingSetLog) {
  return (log as TrainingSetLog & { completedAt?: string }).completedAt ?? log.createdAt;
}

function isSameLocalDate(value: string, date: Date) {
  const itemDate = new Date(value);

  return (
    itemDate.getFullYear() === date.getFullYear() &&
    itemDate.getMonth() === date.getMonth() &&
    itemDate.getDate() === date.getDate()
  );
}

function getWeekStartDate(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);
  return start;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    color: "#24211d",
    fontSize: 27,
    fontWeight: "900"
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: "#eee5da",
    borderColor: "#e1d5c6",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  filterButtonActive: {
    backgroundColor: "#243b35",
    borderColor: "#243b35"
  },
  filterText: {
    color: "#5f584f",
    fontSize: 13,
    fontWeight: "900"
  },
  filterTextActive: {
    color: "#fff"
  },
  list: {
    gap: 12,
    paddingVertical: 16
  },
  item: {
    gap: 8
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  exercise: {
    color: "#24211d",
    flex: 1,
    fontSize: 17,
    fontWeight: "800"
  },
  date: {
    color: "#7b756c",
    fontSize: 13
  },
  detail: {
    color: "#514b43",
    lineHeight: 20
  },
  deleteButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 14
  },
  deleteButtonText: {
    color: "#8a3f2a",
    fontWeight: "800"
  },
  emptyTitle: {
    color: "#24211d",
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: "#625b52",
    lineHeight: 21,
    marginTop: 8
  }
});
