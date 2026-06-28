import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Exercise, TrainingSetLog } from "../models/types";
import { LocalVideoPlayer } from "./LocalVideoPlayer";
import { SectionCard } from "./SectionCard";
import { YouTubeEmbed } from "./YouTubeEmbed";

type Props = {
  planId: string;
  exercise: Exercise;
  onLogSet: (log: TrainingSetLog) => void;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function ExerciseCard({ planId, exercise, onLogSet }: Props) {
  const [setNumber, setSetNumber] = useState("1");
  const [reps, setReps] = useState("12");
  const [bandKg, setBandKg] = useState<0 | 15 | 30>(15);
  const [rpe, setRpe] = useState("7");
  const [pain, setPain] = useState("0");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const markDirty = () => {
    if (saveStatus === "saved" || saveStatus === "error") {
      setSaveStatus("idle");
    }
  };

  const updateSetNumber = (value: string) => {
    setSetNumber(value);
    markDirty();
  };

  const updateReps = (value: string) => {
    setReps(value);
    markDirty();
  };

  const updateRpe = (value: string) => {
    setRpe(value);
    markDirty();
  };

  const updatePain = (value: string) => {
    setPain(value);
    markDirty();
  };

  const updateBandKg = (value: 0 | 15 | 30) => {
    setBandKg(value);
    markDirty();
  };

  const handleSaveLog = () => {
    if (saveStatus === "saving") {
      return;
    }

    setSaveStatus("saving");

    try {
      onLogSet({
        id: `set-${Date.now()}`,
        planId,
        exerciseId: exercise.id,
        exerciseName: exercise.chineseName,
        createdAt: new Date().toISOString(),
        setNumber: Number(setNumber) || 1,
        reps: Number(reps) || 0,
        bandKg,
        rpe: Number(rpe) || 0,
        shoulderPainScore: Number(pain) || 0
      });
      setSaveStatus("saved");
    } catch (error) {
      console.warn("Failed to save training log", error);
      setSaveStatus("error");
    }
  };

  const saveButtonLabel =
    saveStatus === "saving"
      ? "保存中..."
      : saveStatus === "saved"
        ? "已保存到训练记录"
        : saveStatus === "error"
          ? "保存失败，请重试"
          : "保存训练记录";

  return (
    <SectionCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.name}>{exercise.chineseName}</Text>
          <Text style={styles.english}>{exercise.englishName}</Text>
        </View>
        <Text style={styles.duration}>{exercise.durationMinutes} 分钟</Text>
      </View>

      <View style={styles.prescriptionRow}>
        <Text style={styles.prescription}>{exercise.sets} 组</Text>
        <Text style={styles.prescription}>{exercise.reps}</Text>
        <Text style={styles.prescription}>休 {exercise.restSeconds}s</Text>
      </View>

      <Text style={styles.subheading}>动作要点</Text>
      {exercise.cues.map((cue) => (
        <Text key={cue} style={styles.body}>• {cue}</Text>
      ))}

      <Text style={styles.subheading}>常见错误</Text>
      {exercise.commonMistakes.map((mistake) => (
        <Text key={mistake} style={styles.body}>• {mistake}</Text>
      ))}

      <YouTubeEmbed url={exercise.videoUrl} title={`${exercise.chineseName} ${exercise.englishName}`} />
      {exercise.id === "plank" ? <LocalVideoPlayer src="/videos/plank-ink.mp4" /> : null}

      <View style={styles.logBox}>
        <Text style={styles.subheading}>记录这一组</Text>
        <View style={styles.inputGrid}>
          <LabeledInput label="组" value={setNumber} onChangeText={updateSetNumber} />
          <LabeledInput label="次数" value={reps} onChangeText={updateReps} />
          <LabeledInput label="RPE" value={rpe} onChangeText={updateRpe} />
          <LabeledInput label="肩痛 0-10" value={pain} onChangeText={updatePain} />
        </View>
        <View style={styles.bandRow}>
          {[0, 15, 30].map((value) => (
            <Pressable
              key={value}
              onPress={() => updateBandKg(value as 0 | 15 | 30)}
              style={[styles.bandButton, bandKg === value ? styles.bandButtonActive : null]}
            >
              <Text style={[styles.bandText, bandKg === value ? styles.bandTextActive : null]}>
                {value === 0 ? "徒手" : `${value}kg`}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          disabled={saveStatus === "saving"}
          style={[
            styles.saveButton,
            saveStatus === "saved" ? styles.saveButtonSuccess : null,
            saveStatus === "error" ? styles.saveButtonError : null,
            saveStatus === "saving" ? styles.saveButtonDisabled : null
          ]}
          onPress={handleSaveLog}
        >
          <Text style={styles.saveText}>{saveButtonLabel}</Text>
        </Pressable>
      </View>
    </SectionCard>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  titleWrap: {
    flex: 1
  },
  name: {
    color: "#24211d",
    fontSize: 19,
    fontWeight: "800"
  },
  english: {
    color: "#6d665d",
    fontSize: 13,
    marginTop: 2
  },
  duration: {
    color: "#4f6c5f",
    fontSize: 13,
    fontWeight: "700"
  },
  prescriptionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  prescription: {
    backgroundColor: "#eef4ef",
    borderRadius: 8,
    color: "#243b35",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  subheading: {
    color: "#2d2923",
    fontSize: 14,
    fontWeight: "800"
  },
  body: {
    color: "#514b43",
    fontSize: 14,
    lineHeight: 21
  },
  linkButton: {
    alignItems: "center",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  linkText: {
    color: "#243b35",
    fontWeight: "800"
  },
  logBox: {
    backgroundColor: "#faf8f4",
    borderRadius: 8,
    gap: 10,
    padding: 12
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  inputWrap: {
    flexBasis: "48%",
    flexGrow: 1,
    gap: 4
  },
  inputLabel: {
    color: "#6d665d",
    fontSize: 12,
    fontWeight: "700"
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ded4c6",
    borderRadius: 8,
    borderWidth: 1,
    color: "#26231f",
    fontSize: 16,
    minHeight: 42,
    paddingHorizontal: 10
  },
  bandRow: {
    flexDirection: "row",
    gap: 8
  },
  bandButton: {
    alignItems: "center",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  bandButtonActive: {
    backgroundColor: "#243b35",
    borderColor: "#243b35"
  },
  bandText: {
    color: "#514b43",
    fontWeight: "700"
  },
  bandTextActive: {
    color: "#fff"
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#d4663f",
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center"
  },
  saveButtonSuccess: {
    backgroundColor: "#2f6f4f"
  },
  saveButtonError: {
    backgroundColor: "#9b3a30"
  },
  saveButtonDisabled: {
    opacity: 0.72
  },
  saveText: {
    color: "#fff",
    fontWeight: "800"
  }
});
