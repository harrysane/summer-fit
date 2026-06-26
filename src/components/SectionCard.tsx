import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

export function SectionCard({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderColor: "#e7ded2",
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#2d2923",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4
  }
});
