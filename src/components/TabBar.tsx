import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabKey = "today" | "training" | "food" | "nutrition";

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "today", label: "今日" },
  { key: "training", label: "训练" },
  { key: "food", label: "饮食" },
  { key: "nutrition", label: "建议" }
];

export function TabBar({ activeTab, onChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active ? styles.activeTab : null]}
          >
            <Text style={[styles.label, active ? styles.activeLabel : null]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopColor: "#e6ded5",
    borderTopWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  tab: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
    justifyContent: "center"
  },
  activeTab: {
    backgroundColor: "#243b35"
  },
  label: {
    color: "#655f56",
    fontSize: 14,
    fontWeight: "600"
  },
  activeLabel: {
    color: "#fff"
  }
});
