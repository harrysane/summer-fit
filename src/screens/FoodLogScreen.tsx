import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { FoodItem, FoodRecord } from "../models/types";
import { recognizeFoodFromImage, scaleFoodItemByGrams } from "../services/foodAiService";

type Props = {
  records: FoodRecord[];
  onChangeRecords: (records: FoodRecord[]) => void;
};

export function FoodLogScreen({ records, onChangeRecords }: Props) {
  const [loading, setLoading] = useState(false);

  async function pickFoodPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("需要相册权限", "请选择允许访问相册后再上传食物照片。");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.85,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    setLoading(true);
    try {
      const aiResult = await recognizeFoodFromImage(result.assets[0].uri);
      const record: FoodRecord = {
        id: `food-${Date.now()}`,
        imageUri: result.assets[0].uri,
        createdAt: new Date().toISOString(),
        mealType: "lunch",
        items: aiResult.items,
        aiConfidence: aiResult.confidence,
        userEdited: false
      };
      onChangeRecords([record, ...records]);
    } finally {
      setLoading(false);
    }
  }

  function updateItem(recordId: string, item: FoodItem, gramsText: string) {
    const grams = Number(gramsText) || 0;
    onChangeRecords(
      records.map((record) =>
        record.id === recordId
          ? {
              ...record,
              userEdited: true,
              items: record.items.map((current) =>
                current.id === item.id ? scaleFoodItemByGrams(item, grams) : current
              )
            }
          : record
      )
    );
  }

  function deleteRecord(recordId: string) {
    onChangeRecords(records.filter((record) => record.id !== recordId));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>饮食记录</Text>
        <Text style={styles.subtitle}>上传食物照片后，先用本地 mock 识别结果占位，后续可替换为多模态 AI。</Text>
      </View>

      <Pressable style={styles.uploadButton} onPress={pickFoodPhoto} disabled={loading}>
        <Text style={styles.uploadText}>{loading ? "识别中..." : "上传食物照片"}</Text>
      </Pressable>

      {records.map((record) => (
        <SectionCard key={record.id} style={styles.record}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>{mealTypeLabel(record.mealType)}</Text>
            <Text style={styles.confidence}>AI 置信度 {Math.round(record.aiConfidence * 100)}%</Text>
          </View>
          {record.imageUri ? <Image source={{ uri: record.imageUri }} style={styles.image} /> : null}
          {record.items.map((item) => (
            <View key={item.id} style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.macro}>
                  {item.estimate.kcal} kcal · P {item.estimate.proteinG}g · C {item.estimate.carbsG}g · F {item.estimate.fatG}g
                </Text>
              </View>
              <TextInput
                keyboardType="numeric"
                value={String(item.grams)}
                onChangeText={(value) => updateItem(record.id, item, value)}
                style={styles.gramsInput}
              />
              <Text style={styles.gramUnit}>g</Text>
            </View>
          ))}
          <Pressable style={styles.deleteButton} onPress={() => deleteRecord(record.id)}>
            <Text style={styles.deleteButtonText}>删除</Text>
          </Pressable>
        </SectionCard>
      ))}
    </ScrollView>
  );
}

function mealTypeLabel(mealType: FoodRecord["mealType"]) {
  const labels = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "加餐"
  };
  return labels[mealType];
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
    lineHeight: 20,
    marginTop: 6
  },
  uploadButton: {
    alignItems: "center",
    backgroundColor: "#243b35",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center"
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900"
  },
  record: {
    gap: 12
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  recordTitle: {
    color: "#24211d",
    fontSize: 18,
    fontWeight: "900"
  },
  confidence: {
    color: "#7b756c",
    fontSize: 13
  },
  image: {
    backgroundColor: "#eee5da",
    borderRadius: 8,
    height: 180,
    width: "100%"
  },
  foodRow: {
    alignItems: "center",
    borderTopColor: "#eee5da",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingTop: 10
  },
  foodInfo: {
    flex: 1
  },
  foodName: {
    color: "#2d2923",
    fontWeight: "900"
  },
  macro: {
    color: "#625b52",
    fontSize: 12,
    marginTop: 2
  },
  gramsInput: {
    borderColor: "#ded4c6",
    borderRadius: 8,
    borderWidth: 1,
    color: "#26231f",
    fontSize: 15,
    height: 40,
    paddingHorizontal: 8,
    textAlign: "center",
    width: 64
  },
  gramUnit: {
    color: "#6d665d",
    fontWeight: "700"
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
  }
});
