import React, { useMemo } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  url: string;
  title: string;
};

type ParsedYouTubeUrl = {
  embedUrl: string;
  watchUrl: string;
  isShorts: boolean;
};

export function YouTubeEmbed({ url, title }: Props) {
  const parsed = useMemo(() => parseYouTubeUrl(url), [url]);

  if (!parsed) {
    return null;
  }

  if (Platform.OS !== "web") {
    return (
      <Pressable style={styles.openButton} onPress={() => Linking.openURL(parsed.watchUrl)}>
        <Text style={styles.openButtonText}>打开参考视频</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.frameWrap, parsed.isShorts ? styles.shortsFrame : styles.wideFrame]}>
        {React.createElement("iframe" as any, {
          src: parsed.embedUrl,
          title,
          style: styles.iframe,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          loading: "lazy"
        })}
      </View>
      <Pressable style={styles.openButton} onPress={() => Linking.openURL(parsed.watchUrl)}>
        <Text style={styles.openButtonText}>在 YouTube 打开</Text>
      </Pressable>
    </View>
  );
}

export function parseYouTubeUrl(url: string): ParsedYouTubeUrl | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    let videoId = "";
    let isShorts = false;

    if (hostname === "youtu.be") {
      videoId = firstPathSegment(parsed.pathname);
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") ?? "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = firstPathSegment(parsed.pathname.replace("/shorts/", ""));
        isShorts = true;
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = firstPathSegment(parsed.pathname.replace("/embed/", ""));
      }
    }

    if (!videoId) {
      return null;
    }

    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      isShorts
    };
  } catch {
    return null;
  }
}

function firstPathSegment(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] ?? "";
}

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  frameWrap: {
    alignSelf: "center",
    backgroundColor: "#111",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%"
  },
  wideFrame: {
    aspectRatio: 16 / 9
  },
  shortsFrame: {
    aspectRatio: 9 / 16,
    maxWidth: 360
  },
  iframe: {
    borderWidth: 0,
    height: "100%",
    width: "100%"
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
