import { FoodRecord, MacroEstimate, NutritionTarget } from "../models/types";

export function sumFoodRecords(records: FoodRecord[]): MacroEstimate {
  return records.reduce(
    (total, record) => {
      for (const item of record.items) {
        total.kcal += item.estimate.kcal;
        total.proteinG += item.estimate.proteinG;
        total.carbsG += item.estimate.carbsG;
        total.fatG += item.estimate.fatG;
      }
      return total;
    },
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}

export function buildDailyAdvice(consumed: MacroEstimate, target: NutritionTarget) {
  const proteinGap = Math.max(target.proteinG - consumed.proteinG, 0);
  const carbsGap = Math.max(target.carbsG - consumed.carbsG, 0);
  const fatGap = Math.max(target.fatG - consumed.fatG, 0);

  const advice: string[] = [];
  if (proteinGap > 20) {
    advice.push(`蛋白质还差约 ${Math.round(proteinGap)}g，可补鸡胸肉 ${Math.round(proteinGap / 0.31)}g 或希腊酸奶 ${Math.round(proteinGap / 0.1)}g。`);
  }
  if (carbsGap > 45) {
    advice.push(`碳水还差约 ${Math.round(carbsGap)}g，可补米饭 ${Math.round(carbsGap / 0.26)}g 或香蕉 ${Math.round(carbsGap / 0.23)}g。`);
  }
  if (fatGap > 15) {
    advice.push(`脂肪还差约 ${Math.round(fatGap)}g，可补坚果 ${Math.round(fatGap / 0.5)}g 或鸡蛋 ${Math.round(fatGap / 0.1)}g。`);
  }

  if (advice.length === 0) {
    advice.push("今天的宏量营养已经接近目标，晚餐保持清淡、足量蛋白和蔬菜即可。");
  }

  return advice;
}

export function macroPercent(consumed: number, target: number) {
  if (target <= 0) {
    return 0;
  }
  return Math.min(consumed / target, 1);
}
