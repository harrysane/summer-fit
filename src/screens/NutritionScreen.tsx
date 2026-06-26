import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MacroProgress } from "../components/MacroProgress";
import { SectionCard } from "../components/SectionCard";
import { nutritionTargets } from "../data/nutritionTargets";
import { FoodRecord, TrainingDayType } from "../models/types";
import { buildDailyAdvice, sumFoodRecords } from "../services/nutritionService";

type Props = {
  foodRecords: FoodRecord[];
};

export function NutritionScreen({ foodRecords }: Props) {
  const [dayType, setDayType] = useState<TrainingDayType>("training");
  const target = nutritionTargets[dayType];
  const consumed = useMemo(() => sumFoodRecords(foodRecords), [foodRecords]);
  const advice = useMemo(() => buildDailyAdvice(consumed, target), [consumed, target]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>每日建议</Text>
        <Text style={styles.subtitle}>根据当前摄入和目标差距，估算下一餐该补什么。</Text>
      </View>

      <View style={styles.segment}>
        {(["training", "rest"] as TrainingDayType[]).map((type) => (
          <Pressable
            key={type}
            onPress={() => setDayType(type)}
            style={[styles.segmentButton, dayType === type ? styles.segmentActive : null]}
          >
            <Text style={[styles.segmentText, dayType === type ? styles.segmentTextActive : null]}>
              {type === "training" ? "训练日" : "休息日"}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionCard style={styles.card}>
        <MacroProgress label="热量" consumed={consumed.kcal} target={target.kcal} unit="kcal" />
        <MacroProgress label="蛋白质" consumed={consumed.proteinG} target={target.proteinG} unit="g" />
        <MacroProgress label="碳水" consumed={consumed.carbsG} target={target.carbsG} unit="g" />
        <MacroProgress label="脂肪" consumed={consumed.fatG} target={target.fatG} unit="g" />
      </SectionCard>

      <SectionCard style={styles.card}>
        <Text style={styles.sectionTitle}>下一餐建议</Text>
        {advice.map((item) => (
          <Text key={item} style={styles.advice}>• {item}</Text>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
    paddingBottom: 28
  },
  title: {
    color: "#24211d",
    fontSize: 27,
    fontWeight: "900"
  },
  subtitle: {
    color: "#6d665d",
    fontSize: 14,
    marginTop: 6
  },
  segment: {
    backgroundColor: "#eee5da",
    borderRadius: 8,
    flexDirection: "row",
    padding: 4
  },
  segmentButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  segmentActive: {
    backgroundColor: "#fff"
  },
  segmentText: {
    color: "#6d665d",
    fontWeight: "900"
  },
  segmentTextActive: {
    color: "#243b35"
  },
  card: {
    gap: 16
  },
  sectionTitle: {
    color: "#24211d",
    fontSize: 18,
    fontWeight: "900"
  },
  advice: {
    color: "#514b43",
    fontSize: 15,
    lineHeight: 22
  }
});
