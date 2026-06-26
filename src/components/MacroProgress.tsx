import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { macroPercent } from "../services/nutritionService";

type Props = {
  label: string;
  consumed: number;
  target: number;
  unit: string;
};

export function MacroProgress({ label, consumed, target, unit }: Props) {
  const progress = macroPercent(consumed, target);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {Math.round(consumed)} / {target} {unit}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  label: {
    color: "#3a352f",
    fontWeight: "800"
  },
  value: {
    color: "#6d665d",
    fontVariant: ["tabular-nums"]
  },
  track: {
    backgroundColor: "#eee5da",
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  fill: {
    backgroundColor: "#4f7d6c",
    borderRadius: 999,
    height: 8
  }
});
