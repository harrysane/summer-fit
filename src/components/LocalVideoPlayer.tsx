import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  src?: string;
  title?: string;
};

export function LocalVideoPlayer({
  src = "/videos/plank-ink.mp4",
  title = "平板支撑水墨线稿视频"
}: Props) {
  if (Platform.OS !== "web") {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>该本地视频播放器用于 Expo Web。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {React.createElement("video" as any, {
        src,
        title,
        controls: true,
        playsInline: true,
        preload: "metadata",
        style: styles.video
      })}
      <Pressable style={styles.openButton} onPress={() => window.open(src, "_blank", "noreferrer")}>
        <Text style={styles.openButtonText}>打开本地视频</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: "100%"
  },
  video: {
    aspectRatio: 9 / 16,
    backgroundColor: "#f7f3ee",
    borderRadius: 8,
    maxHeight: 640,
    width: "100%"
  },
  fallback: {
    alignItems: "center",
    backgroundColor: "#f7f3ee",
    borderColor: "#ded4c6",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 160,
    justifyContent: "center",
    padding: 16
  },
  fallbackText: {
    color: "#625b52",
    textAlign: "center"
  },
  openButton: {
    alignItems: "center",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  openButtonText: {
    color: "#243b35",
    fontWeight: "800"
  }
});
