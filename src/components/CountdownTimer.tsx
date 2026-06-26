import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TrainingBlock } from "../models/types";

type Props = {
  blocks: TrainingBlock[];
};

export function CountdownTimer({ blocks }: Props) {
  const totalSeconds = useMemo(
    () => blocks.reduce((sum, block) => sum + block.durationMinutes * 60, 0),
    [blocks]
  );
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remainingSeconds <= 0) {
      return;
    }

    const id = setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(id);
  }, [remainingSeconds, running]);

  const elapsedSeconds = totalSeconds - remainingSeconds;
  const currentBlock =
    blocks.find((block) => {
      const start = block.startMinute * 60;
      const end = start + block.durationMinutes * 60;
      return elapsedSeconds >= start && elapsedSeconds < end;
    }) ?? blocks[blocks.length - 1];

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>当前阶段</Text>
        <Text style={styles.blockTitle}>{currentBlock?.title ?? "训练完成"}</Text>
      </View>
      <Text style={styles.time}>{formatSeconds(remainingSeconds)}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => setRunning((value) => !value)}>
          <Text style={styles.primaryText}>{running ? "暂停" : "开始"}</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            setRunning(false);
            setRemainingSeconds(totalSeconds);
          }}
        >
          <Text style={styles.secondaryText}>重置</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatSeconds(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  label: {
    color: "#7b756c",
    fontSize: 13
  },
  blockTitle: {
    color: "#24211d",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2
  },
  time: {
    color: "#243b35",
    fontSize: 48,
    fontVariant: ["tabular-nums"],
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#243b35",
    borderRadius: 8,
    flex: 1,
    minHeight: 44,
    justifyContent: "center"
  },
  primaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700"
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#cfc5b8",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: "center"
  },
  secondaryText: {
    color: "#4e4942",
    fontSize: 15,
    fontWeight: "700"
  }
});
