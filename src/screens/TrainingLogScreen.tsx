import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { TrainingSetLog } from "../models/types";

type Props = {
  logs: TrainingSetLog[];
  onDeleteLog: (id: string) => void;
};

export function TrainingLogScreen({ logs, onDeleteLog }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>训练记录</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <SectionCard>
            <Text style={styles.emptyTitle}>还没有训练记录</Text>
            <Text style={styles.emptyText}>在今日页面保存每一组后，这里会显示次数、弹力带、RPE 和肩痛评分。</Text>
          </SectionCard>
        }
        renderItem={({ item }) => (
          <SectionCard style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.exercise}>{item.exerciseName}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
            </View>
            <Text style={styles.detail}>
              第 {item.setNumber} 组 · {item.reps} 次 · {item.bandKg === 0 ? "徒手" : `${item.bandKg}kg`} · RPE {item.rpe} · 肩痛 {item.shoulderPainScore}/10
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
