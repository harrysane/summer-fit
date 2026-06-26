import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CountdownTimer } from "../components/CountdownTimer";
import { ExerciseCard } from "../components/ExerciseCard";
import { SectionCard } from "../components/SectionCard";
import { userProfile } from "../data/userProfile";
import { TrainingPlan, TrainingSetLog } from "../models/types";

type Props = {
  plan: TrainingPlan;
  completedSetCount: number;
  isTodayCheckedIn: boolean;
  onLogSet: (log: TrainingSetLog) => void;
  onCheckIn: () => void;
};

export function TodayScreen({
  plan,
  completedSetCount,
  isTodayCheckedIn,
  onLogSet,
  onCheckIn
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.eyebrow}>今日训练</Text>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.subtitle}>
          {userProfile.heightCm}cm / {userProfile.weightKg}kg / {plan.estimatedMinutes} 分钟
        </Text>
      </View>

      <SectionCard>
        <CountdownTimer blocks={plan.blocks} />
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
        <Text style={styles.checkInStatus}>
          {isTodayCheckedIn ? "打卡状态：今日已完成" : "打卡状态：今日未完成"}
        </Text>
        <Pressable
          disabled={isTodayCheckedIn}
          onPress={onCheckIn}
          style={[styles.checkInButton, isTodayCheckedIn ? styles.checkInButtonDisabled : null]}
        >
          <Text style={[styles.checkInButtonText, isTodayCheckedIn ? styles.checkInButtonTextDisabled : null]}>
            {isTodayCheckedIn ? "今日已完成" : "完成今日训练"}
          </Text>
        </Pressable>
      </SectionCard>

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
  checkInStatus: {
    color: "#243b35",
    fontSize: 14,
    fontWeight: "800"
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
  block: {
    gap: 12
  },
  blockTitle: {
    color: "#2d2923",
    fontSize: 18,
    fontWeight: "900"
  }
});
