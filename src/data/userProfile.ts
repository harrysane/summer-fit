import { UserProfile } from "../models/types";

export const userProfile: UserProfile = {
  heightCm: 172,
  weightKg: 61,
  internshipStart: "09:00",
  internshipEnd: "17:00",
  commuteMinutesOneWay: 60,
  sedentaryRiskNotes: [
    "久坐较多，训练前先恢复胸椎和肩胛活动",
    "可能存在肩前侧压力和肱骨前移倾向，推类动作保持肩胛稳定",
    "腹肌强化以抗伸展、抗旋转和骨盆控制为主"
  ],
  equipment: [
    { id: "band-15", label: "迪卡侬弹力带 15kg", resistanceKg: 15 },
    { id: "band-30", label: "迪卡侬弹力带 30kg", resistanceKg: 30 }
  ],
  goals: ["体态修复", "增肌", "腹肌强化"]
};
