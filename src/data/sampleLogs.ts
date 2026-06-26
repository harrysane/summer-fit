import { FoodRecord, TrainingSetLog } from "../models/types";

export const trainingLogsSeed: TrainingSetLog[] = [];

export const foodRecordsSeed: FoodRecord[] = [
  {
    id: "sample-breakfast",
    createdAt: new Date().toISOString(),
    mealType: "breakfast",
    aiConfidence: 0.82,
    userEdited: false,
    items: [
      {
        id: "oats",
        name: "燕麦",
        grams: 60,
        estimate: { kcal: 228, proteinG: 8, carbsG: 40, fatG: 4 }
      },
      {
        id: "milk",
        name: "牛奶",
        grams: 250,
        estimate: { kcal: 160, proteinG: 8, carbsG: 12, fatG: 9 }
      }
    ]
  }
];
