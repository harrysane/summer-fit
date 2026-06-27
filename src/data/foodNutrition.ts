export type FoodNutritionItem = {
  id: string;
  nameZh: string;
  nameEn: string;
  aliases: string[];
  per100g: FoodNutritionPer100g;
  source: "USDA FoodData Central";
  sourceDataset: "SR Legacy 04/2018";
  sourceFoodId: string;
  sourceFoodDescription: string;
};

export type FoodNutritionPer100g = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export const foodNutrition: FoodNutritionItem[] = [
  {
    id: "banana-raw",
    nameZh: "香蕉",
    nameEn: "Bananas, raw",
    aliases: ["banana", "bananas", "香蕉", "生香蕉"],
    per100g: { kcal: 89, proteinG: 1.09, carbsG: 22.84, fatG: 0.33 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "173944",
    sourceFoodDescription: "Bananas, raw"
  },
  {
    id: "chicken-breast-cooked",
    nameZh: "熟鸡胸肉",
    nameEn: "Chicken breast, meat only, cooked, roasted",
    aliases: ["chicken breast", "cooked chicken breast", "鸡胸肉", "熟鸡胸", "鸡肉"],
    per100g: { kcal: 165, proteinG: 31.02, carbsG: 0, fatG: 3.57 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "171477",
    sourceFoodDescription: "Chicken, broilers or fryers, breast, meat only, cooked, roasted"
  },
  {
    id: "egg-hard-boiled",
    nameZh: "鸡蛋",
    nameEn: "Egg, whole, cooked, hard-boiled",
    aliases: ["egg", "eggs", "boiled egg", "hard boiled egg", "鸡蛋", "水煮蛋", "煮鸡蛋"],
    per100g: { kcal: 155, proteinG: 12.58, carbsG: 1.12, fatG: 10.61 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "173424",
    sourceFoodDescription: "Egg, whole, cooked, hard-boiled"
  },
  {
    id: "milk-whole",
    nameZh: "全脂牛奶",
    nameEn: "Milk, whole, 3.25% milkfat, with added vitamin D",
    aliases: ["milk", "whole milk", "牛奶", "全脂奶", "全脂牛奶"],
    per100g: { kcal: 61, proteinG: 3.15, carbsG: 4.8, fatG: 3.25 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "171265",
    sourceFoodDescription: "Milk, whole, 3.25% milkfat, with added vitamin D"
  },
  {
    id: "oats",
    nameZh: "燕麦",
    nameEn: "Oats",
    aliases: ["oat", "oats", "oatmeal", "燕麦", "燕麦片"],
    per100g: { kcal: 389, proteinG: 16.89, carbsG: 66.27, fatG: 6.9 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "169705",
    sourceFoodDescription: "Oats (Includes foods for USDA's Food Distribution Program)"
  },
  {
    id: "rice-white-cooked",
    nameZh: "熟米饭",
    nameEn: "Rice, white, long-grain, regular, cooked, enriched, with salt",
    aliases: ["rice", "white rice", "cooked rice", "米饭", "熟米饭", "白米饭"],
    per100g: { kcal: 130, proteinG: 2.69, carbsG: 28.17, fatG: 0.28 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "169753",
    sourceFoodDescription: "Rice, white, long-grain, regular, cooked, enriched, with salt"
  },
  {
    id: "potato-baked",
    nameZh: "土豆",
    nameEn: "Potatoes, baked, flesh, without salt",
    aliases: ["potato", "potatoes", "baked potato", "土豆", "马铃薯"],
    per100g: { kcal: 93, proteinG: 1.96, carbsG: 21.55, fatG: 0.1 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "170033",
    sourceFoodDescription: "Potatoes, baked, flesh, without salt"
  },
  {
    id: "sweet-potato-baked",
    nameZh: "红薯",
    nameEn: "Sweet potato, cooked, baked in skin, flesh, without salt",
    aliases: ["sweet potato", "sweet potatoes", "红薯", "地瓜", "番薯"],
    per100g: { kcal: 90, proteinG: 2.01, carbsG: 20.71, fatG: 0.15 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "168483",
    sourceFoodDescription: "Sweet potato, cooked, baked in skin, flesh, without salt"
  },
  {
    id: "tofu-firm",
    nameZh: "豆腐",
    nameEn: "Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)",
    aliases: ["tofu", "firm tofu", "豆腐", "老豆腐", "北豆腐"],
    per100g: { kcal: 78, proteinG: 9.04, carbsG: 2.85, fatG: 4.17 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "172448",
    sourceFoodDescription: "Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)"
  },
  {
    id: "beef-ground-90-cooked",
    nameZh: "牛肉",
    nameEn: "Beef, ground, 90% lean meat / 10% fat, patty, cooked, pan-broiled",
    aliases: ["beef", "lean beef", "ground beef", "牛肉", "瘦牛肉"],
    per100g: { kcal: 204, proteinG: 25.21, carbsG: 0, fatG: 10.68 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "171793",
    sourceFoodDescription: "Beef, ground, 90% lean meat / 10% fat, patty, cooked, pan-broiled"
  },
  {
    id: "broccoli-cooked",
    nameZh: "西兰花",
    nameEn: "Broccoli, cooked, boiled, drained, without salt",
    aliases: ["broccoli", "cooked broccoli", "西兰花", "花椰菜"],
    per100g: { kcal: 35, proteinG: 2.38, carbsG: 7.18, fatG: 0.41 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "169967",
    sourceFoodDescription: "Broccoli, cooked, boiled, drained, without salt"
  },
  {
    id: "apple-raw-with-skin",
    nameZh: "苹果",
    nameEn: "Apples, raw, with skin",
    aliases: ["apple", "apples", "苹果", "带皮苹果"],
    per100g: { kcal: 52, proteinG: 0.26, carbsG: 13.81, fatG: 0.17 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "171688",
    sourceFoodDescription: "Apples, raw, with skin (Includes foods for USDA's Food Distribution Program)"
  },
  {
    id: "bread-whole-wheat",
    nameZh: "面包",
    nameEn: "Bread, whole-wheat, commercially prepared",
    aliases: ["bread", "whole wheat bread", "toast", "面包", "全麦面包", "吐司"],
    per100g: { kcal: 252, proteinG: 12.45, carbsG: 42.71, fatG: 3.5 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "172688",
    sourceFoodDescription: "Bread, whole-wheat, commercially prepared"
  },
  {
    id: "salmon-atlantic-cooked",
    nameZh: "三文鱼",
    nameEn: "Fish, salmon, Atlantic, farmed, cooked, dry heat",
    aliases: ["salmon", "atlantic salmon", "三文鱼", "鲑鱼"],
    per100g: { kcal: 206, proteinG: 22.1, carbsG: 0, fatG: 12.35 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "175168",
    sourceFoodDescription: "Fish, salmon, Atlantic, farmed, cooked, dry heat"
  },
  // USDA SR Legacy does not provide a plain Chinese-style braised pork trotter entry.
  // This uses the closest available pork feet item, so values may differ from Chinese braised pork trotters.
  {
    id: "pork-feet-pickled",
    nameZh: "猪蹄",
    nameEn: "Pork, cured, feet, pickled",
    aliases: ["pork feet", "pig feet", "pork trotter", "猪蹄", "猪脚"],
    per100g: { kcal: 140, proteinG: 11.63, carbsG: 0.01, fatG: 10.02 },
    source: "USDA FoodData Central",
    sourceDataset: "SR Legacy 04/2018",
    sourceFoodId: "167870",
    sourceFoodDescription: "Pork, cured, feet, pickled"
  }
];

export function findNutritionByName(name: string) {
  const normalizedName = normalizeFoodName(name);
  if (!normalizedName) {
    return undefined;
  }

  return foodNutrition.find((item) => {
    const names = [item.nameZh, item.nameEn, ...item.aliases];
    return names.some((candidate) => normalizeFoodName(candidate) === normalizedName);
  });
}

export function calculateEstimateByGrams(per100g: FoodNutritionPer100g, grams: number) {
  const ratio = grams / 100;
  return {
    kcal: Math.round(per100g.kcal * ratio),
    proteinG: roundMacro(per100g.proteinG * ratio),
    carbsG: roundMacro(per100g.carbsG * ratio),
    fatG: roundMacro(per100g.fatG * ratio)
  };
}

function normalizeFoodName(value: string) {
  return value.trim().toLowerCase();
}

function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}
