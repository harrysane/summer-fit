import { NutritionTarget } from "../models/types";

export const nutritionTargets: Record<"training" | "rest", NutritionTarget> = {
  training: {
    dayType: "training",
    kcal: 2300,
    proteinG: 115,
    carbsG: 290,
    fatG: 65
  },
  rest: {
    dayType: "rest",
    kcal: 2100,
    proteinG: 110,
    carbsG: 240,
    fatG: 65
  }
};
