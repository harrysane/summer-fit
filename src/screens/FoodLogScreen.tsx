import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { calculateEstimateByGrams, findNutritionByName } from "../data/foodNutrition";
import { FoodItem, FoodRecord } from "../models/types";
import { recognizeFoodFromImage, scaleFoodItemByGrams } from "../services/foodAiService";

type Props = {
  records: FoodRecord[];
  onChangeRecords: (records: FoodRecord[]) => void;
};

type EditingFoodItem = {
  recordId: string;
  itemId: string;
  name: string;
  grams: string;
  kcal: string;
  proteinG: string;
  carbsG: string;
  fatG: string;
  sourceText?: string;
};

type AddingFoodItem = Omit<EditingFoodItem, "itemId">;

export function FoodLogScreen({ records, onChangeRecords }: Props) {
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingFoodItem | null>(null);
  const [addingItem, setAddingItem] = useState<AddingFoodItem | null>(null);

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

  function deleteFoodItem(recordId: string, itemId: string) {
    if (editingItem?.recordId === recordId && editingItem.itemId === itemId) {
      setEditingItem(null);
    }

    onChangeRecords(
      records.map((record) =>
        record.id === recordId
          ? {
              ...record,
              userEdited: true,
              items: record.items.filter((item) => item.id !== itemId)
            }
          : record
      )
    );
  }

  function startEditingItem(recordId: string, item: FoodItem) {
    const nutrition = findNutritionByName(item.name);
    setEditingItem({
      recordId,
      itemId: item.id,
      name: item.name,
      grams: String(item.grams),
      kcal: String(item.estimate.kcal),
      proteinG: String(item.estimate.proteinG),
      carbsG: String(item.estimate.carbsG),
      fatG: String(item.estimate.fatG),
      sourceText: nutrition ? formatNutritionSource(nutrition) : undefined
    });
  }

  function updateEditingItem(field: keyof Omit<EditingFoodItem, "recordId" | "itemId">, value: string) {
    setEditingItem((current) => {
      if (!current) {
        return current;
      }

      const next = { ...current, [field]: value };
      if (field === "name" || field === "grams") {
        return applyNutritionMatch(next);
      }

      return next;
    });
  }

  function saveEditingItem() {
    if (!editingItem) {
      return;
    }

    onChangeRecords(
      records.map((record) =>
        record.id === editingItem.recordId
          ? {
              ...record,
              userEdited: true,
              items: record.items.map((item) =>
                item.id === editingItem.itemId
                  ? {
                      ...item,
                      name: editingItem.name.trim() || item.name,
                      grams: toNumber(editingItem.grams),
                      estimate: {
                        kcal: Math.round(toNumber(editingItem.kcal)),
                        proteinG: toNumber(editingItem.proteinG),
                        carbsG: toNumber(editingItem.carbsG),
                        fatG: toNumber(editingItem.fatG)
                      }
                    }
                  : item
              )
            }
          : record
      )
    );
    setEditingItem(null);
  }

  function startAddingItem(recordId: string) {
    setAddingItem({
      recordId,
      name: "",
      grams: "100",
      kcal: "0",
      proteinG: "0",
      carbsG: "0",
      fatG: "0"
    });
  }

  function updateAddingItem(field: keyof Omit<AddingFoodItem, "recordId">, value: string) {
    setAddingItem((current) => {
      if (!current) {
        return current;
      }

      const next = { ...current, [field]: value };
      if (field === "name" || field === "grams") {
        return applyNutritionMatch(next);
      }

      return next;
    });
  }

  function saveAddingItem() {
    if (!addingItem) {
      return;
    }

    const name = addingItem.name.trim();
    if (!name) {
      Alert.alert("请输入食物名称", "添加漏识别食物前，需要先填写食物名称。");
      return;
    }

    const newItem: FoodItem = {
      id: `manual-food-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      grams: toNumber(addingItem.grams),
      estimate: {
        kcal: Math.round(toNumber(addingItem.kcal)),
        proteinG: toNumber(addingItem.proteinG),
        carbsG: toNumber(addingItem.carbsG),
        fatG: toNumber(addingItem.fatG)
      }
    };

    onChangeRecords(
      records.map((record) =>
        record.id === addingItem.recordId
          ? {
              ...record,
              userEdited: true,
              items: [...record.items, newItem]
            }
          : record
      )
    );
    setAddingItem(null);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>饮食记录</Text>
        <Text style={styles.subtitle}>上传食物照片后，先用本地 mock 识别结果占位，后续可替换为多模态 AI。</Text>
        <Text style={styles.sourceNote}>
          营养值为每 100g 估算，实际会因品牌、部位、烹饪方式不同而变化。
        </Text>
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
          {record.items.length === 0 ? (
            <Text style={styles.emptyItemsText}>这条记录暂无食物，可点击添加食物补充。</Text>
          ) : null}
          {record.items.map((item) => (
            <View key={item.id} style={styles.foodItemBlock}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.macro}>
                  {item.estimate.kcal} 千卡 · P {item.estimate.proteinG} 克 · C {item.estimate.carbsG} 克 · F {item.estimate.fatG} 克
                </Text>
              </View>
              <View style={styles.foodControls}>
                <TextInput
                  keyboardType="numeric"
                  value={String(item.grams)}
                  onChangeText={(value) => updateItem(record.id, item, value)}
                  style={styles.gramsInput}
                />
                <Text style={styles.gramUnit}>g</Text>
                <Pressable style={styles.editButton} onPress={() => startEditingItem(record.id, item)}>
                  <Text style={styles.editButtonText}>编辑</Text>
                </Pressable>
                <Pressable style={styles.itemDeleteButton} onPress={() => deleteFoodItem(record.id, item.id)}>
                  <Text style={styles.itemDeleteButtonText}>删除</Text>
                </Pressable>
              </View>
              {editingItem?.recordId === record.id && editingItem.itemId === item.id ? (
                <View style={styles.editBox}>
                  <View style={styles.editGrid}>
                    <LabeledInput
                      label="食物名称"
                      value={editingItem.name}
                      onChangeText={(value) => updateEditingItem("name", value)}
                    />
                    <LabeledInput
                      label="克数"
                      value={editingItem.grams}
                      keyboardType="numeric"
                      onChangeText={(value) => updateEditingItem("grams", value)}
                    />
                    <LabeledInput
                      label="热量 kcal"
                      value={editingItem.kcal}
                      keyboardType="numeric"
                      onChangeText={(value) => updateEditingItem("kcal", value)}
                    />
                    <LabeledInput
                      label="蛋白质 g"
                      value={editingItem.proteinG}
                      keyboardType="numeric"
                      onChangeText={(value) => updateEditingItem("proteinG", value)}
                    />
                    <LabeledInput
                      label="碳水 g"
                      value={editingItem.carbsG}
                      keyboardType="numeric"
                      onChangeText={(value) => updateEditingItem("carbsG", value)}
                    />
                    <LabeledInput
                      label="脂肪 g"
                      value={editingItem.fatG}
                      keyboardType="numeric"
                      onChangeText={(value) => updateEditingItem("fatG", value)}
                    />
                  </View>
                  {editingItem.sourceText ? (
                    <Text style={styles.sourceText}>{editingItem.sourceText}</Text>
                  ) : (
                    <Text style={styles.sourceText}>本地营养库未匹配，可手动填写营养数据。</Text>
                  )}
                  <View style={styles.editActions}>
                    <Pressable style={styles.saveEditButton} onPress={saveEditingItem}>
                      <Text style={styles.saveEditButtonText}>保存</Text>
                    </Pressable>
                    <Pressable style={styles.cancelEditButton} onPress={() => setEditingItem(null)}>
                      <Text style={styles.cancelEditButtonText}>取消</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>
          ))}
          {addingItem?.recordId === record.id ? (
            <View style={styles.editBox}>
              <View style={styles.editGrid}>
                <LabeledInput
                  label="食物名称"
                  value={addingItem.name}
                  onChangeText={(value) => updateAddingItem("name", value)}
                />
                <LabeledInput
                  label="克数"
                  value={addingItem.grams}
                  keyboardType="numeric"
                  onChangeText={(value) => updateAddingItem("grams", value)}
                />
                <LabeledInput
                  label="热量 kcal"
                  value={addingItem.kcal}
                  keyboardType="numeric"
                  onChangeText={(value) => updateAddingItem("kcal", value)}
                />
                <LabeledInput
                  label="蛋白质 g"
                  value={addingItem.proteinG}
                  keyboardType="numeric"
                  onChangeText={(value) => updateAddingItem("proteinG", value)}
                />
                <LabeledInput
                  label="碳水 g"
                  value={addingItem.carbsG}
                  keyboardType="numeric"
                  onChangeText={(value) => updateAddingItem("carbsG", value)}
                />
                <LabeledInput
                  label="脂肪 g"
                  value={addingItem.fatG}
                  keyboardType="numeric"
                  onChangeText={(value) => updateAddingItem("fatG", value)}
                />
              </View>
              {addingItem.sourceText ? (
                <Text style={styles.sourceText}>{addingItem.sourceText}</Text>
              ) : (
                <Text style={styles.sourceText}>本地营养库未匹配，可手动填写营养数据。</Text>
              )}
              <View style={styles.editActions}>
                <Pressable style={styles.saveEditButton} onPress={saveAddingItem}>
                  <Text style={styles.saveEditButtonText}>保存</Text>
                </Pressable>
                <Pressable style={styles.cancelEditButton} onPress={() => setAddingItem(null)}>
                  <Text style={styles.cancelEditButtonText}>取消</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={() => startAddingItem(record.id)}>
              <Text style={styles.addButtonText}>添加食物</Text>
            </Pressable>
          )}
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

function toNumber(value: string) {
  return Number(value) || 0;
}

function applyNutritionMatch<T extends EditingFoodItem | AddingFoodItem>(editingItem: T): T {
  const nutrition = findNutritionByName(editingItem.name);
  if (!nutrition) {
    return { ...editingItem, sourceText: undefined };
  }

  const estimate = calculateEstimateByGrams(nutrition.per100g, toNumber(editingItem.grams));
  return {
    ...editingItem,
    kcal: String(estimate.kcal),
    proteinG: String(estimate.proteinG),
    carbsG: String(estimate.carbsG),
    fatG: String(estimate.fatG),
    sourceText: formatNutritionSource(nutrition)
  };
}

function formatNutritionSource(nutrition: ReturnType<typeof findNutritionByName>) {
  if (!nutrition) {
    return "";
  }

  return `数据来源：${nutrition.source} · ${nutrition.sourceDataset} · FDC ID: ${nutrition.sourceFoodId}`;
}

function LabeledInput({
  label,
  value,
  keyboardType,
  onChangeText
}: {
  label: string;
  value: string;
  keyboardType?: "default" | "numeric";
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.editField}>
      <Text style={styles.editLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        style={styles.editInput}
      />
    </View>
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
    lineHeight: 20,
    marginTop: 6
  },
  sourceNote: {
    color: "#7b756c",
    fontSize: 12,
    lineHeight: 18,
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
  foodControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start"
  },
  foodItemBlock: {
    borderTopColor: "#eee5da",
    borderTopWidth: 1,
    gap: 10
  },
  foodInfo: {
    gap: 4,
    paddingTop: 10
  },
  foodName: {
    color: "#2d2923",
    fontWeight: "900"
  },
  macro: {
    color: "#625b52",
    fontSize: 12,
    lineHeight: 18
  },
  emptyItemsText: {
    color: "#7b756c",
    fontSize: 13,
    lineHeight: 19
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
  editButton: {
    alignItems: "center",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  editButtonText: {
    color: "#243b35",
    fontWeight: "800"
  },
  itemDeleteButton: {
    alignItems: "center",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  itemDeleteButtonText: {
    color: "#8a3f2a",
    fontWeight: "800"
  },
  addButton: {
    alignItems: "center",
    borderColor: "#b9cfc5",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  addButtonText: {
    color: "#243b35",
    fontWeight: "800"
  },
  editBox: {
    backgroundColor: "#faf8f4",
    borderRadius: 8,
    gap: 10,
    padding: 12
  },
  editGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  editField: {
    flexBasis: "48%",
    flexGrow: 1,
    gap: 4
  },
  editLabel: {
    color: "#6d665d",
    fontSize: 12,
    fontWeight: "700"
  },
  editInput: {
    backgroundColor: "#fff",
    borderColor: "#ded4c6",
    borderRadius: 8,
    borderWidth: 1,
    color: "#26231f",
    fontSize: 15,
    minHeight: 40,
    paddingHorizontal: 8
  },
  sourceText: {
    color: "#6d665d",
    fontSize: 12,
    lineHeight: 18
  },
  editActions: {
    flexDirection: "row",
    gap: 8
  },
  saveEditButton: {
    alignItems: "center",
    backgroundColor: "#243b35",
    borderRadius: 8,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  saveEditButtonText: {
    color: "#fff",
    fontWeight: "800"
  },
  cancelEditButton: {
    alignItems: "center",
    borderColor: "#d7cdc0",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  cancelEditButtonText: {
    color: "#514b43",
    fontWeight: "800"
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
