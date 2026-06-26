import { FoodItem } from "../models/types";

type FoodRecognitionResult = {
  items: FoodItem[];
  confidence: number;
};

export async function recognizeFoodFromImage(imageUri: string): Promise<FoodRecognitionResult> {
  // Replace this adapter with a multimodal AI API call. Keep callers dependent on
  // FoodRecognitionResult so Supabase storage and AI vendors can change independently.
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    confidence: 0.76,
    items: [
      {
        id: `rice-${Date.now()}`,
        name: "米饭",
        grams: 180,
        estimate: { kcal: 209, proteinG: 4.7, carbsG: 46.8, fatG: 0.5 }
      },
      {
        id: `chicken-${Date.now()}`,
        name: "鸡胸肉",
        grams: 120,
        estimate: { kcal: 198, proteinG: 37.2, carbsG: 0, fatG: 4.3 }
      },
      {
        id: `vegetable-${Date.now()}`,
        name: "蔬菜",
        grams: 150,
        estimate: { kcal: 60, proteinG: 3, carbsG: 10, fatG: 1 }
      }
    ]
  };
}

export function scaleFoodItemByGrams(item: FoodItem, grams: number): FoodItem {
  if (item.grams <= 0) {
    return {
      ...item,
      grams,
      estimate: { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    };
  }

  const ratio = grams / item.grams;
  return {
    ...item,
    grams,
    estimate: {
      kcal: Math.round(item.estimate.kcal * ratio),
      proteinG: roundMacro(item.estimate.proteinG * ratio),
      carbsG: roundMacro(item.estimate.carbsG * ratio),
      fatG: roundMacro(item.estimate.fatG * ratio)
    }
  };
}

function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}
