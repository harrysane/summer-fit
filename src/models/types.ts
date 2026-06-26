export type TrainingDayType = "training" | "rest";

export type UserProfile = {
  heightCm: number;
  weightKg: number;
  internshipStart: string;
  internshipEnd: string;
  commuteMinutesOneWay: number;
  sedentaryRiskNotes: string[];
  equipment: ResistanceBand[];
  goals: string[];
};

export type ResistanceBand = {
  id: string;
  label: string;
  resistanceKg: 15 | 30;
};

export type Exercise = {
  id: string;
  chineseName: string;
  englishName: string;
  sets: number;
  reps: string;
  restSeconds: number;
  durationMinutes: number;
  cues: string[];
  commonMistakes: string[];
  videoUrl: string;
  equipment?: string;
};

export type TrainingBlock = {
  id: string;
  title: string;
  startMinute: number;
  durationMinutes: number;
  exercises: Exercise[];
};

export type TrainingPlan = {
  id: string;
  title: string;
  dayType: TrainingDayType;
  estimatedMinutes: number;
  focus: string[];
  blocks: TrainingBlock[];
};

export type TrainingSetLog = {
  id: string;
  planId: string;
  exerciseId: string;
  exerciseName: string;
  createdAt: string;
  setNumber: number;
  reps: number;
  bandKg: 15 | 30 | 0;
  rpe: number;
  shoulderPainScore: number;
};

export type TrainingCheckIn = {
  date: string;
  completedAt: string;
};

export type NutritionTarget = {
  dayType: TrainingDayType;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type MacroEstimate = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type FoodItem = {
  id: string;
  name: string;
  grams: number;
  estimate: MacroEstimate;
};

export type FoodRecord = {
  id: string;
  imageUri?: string;
  createdAt: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: FoodItem[];
  aiConfidence: number;
  userEdited: boolean;
};
