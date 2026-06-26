import { TrainingPlan } from "../models/types";

export const todayPlan: TrainingPlan = {
  id: "summer-posture-hypertrophy-day-a",
  title: "体态修复 + 上肢拉推 + 核心",
  dayType: "training",
  estimatedMinutes: 58,
  focus: ["肩胛后缩下压", "胸椎伸展", "弹力带增肌", "腹肌抗伸展"],
  blocks: [
    {
      id: "warmup",
      title: "热身与肩前侧减压",
      startMinute: 0,
      durationMinutes: 10,
      exercises: [
        {
          id: "thoracic-extension",
          chineseName: "跪姿胸椎伸展",
          englishName: "Kneeling Thoracic Extension",
          sets: 2,
          reps: "8-10 次",
          restSeconds: 20,
          durationMinutes: 4,
          cues: ["肘部放在椅面或桌沿", "呼气时胸口向地面沉", "腰不要塌"],
          commonMistakes: ["用腰椎代偿", "耸肩", "憋气"],
          videoUrl: "https://www.youtube.com/results?search_query=kneeling+thoracic+extension"
        },
        {
          id: "band-face-pull",
          chineseName: "弹力带面拉",
          englishName: "Band Face Pull",
          sets: 2,
          reps: "15 次",
          restSeconds: 30,
          durationMinutes: 6,
          cues: ["拉向眉眼高度", "肘略高于肩", "结束位外旋，小臂接近竖直"],
          commonMistakes: ["肋骨外翻", "只用手臂拉", "肩膀向前顶"],
          videoUrl: "https://www.youtube.com/results?search_query=band+face+pull+proper+form",
          equipment: "15kg 弹力带"
        }
      ]
    },
    {
      id: "strength",
      title: "弹力带增肌主训练",
      startMinute: 10,
      durationMinutes: 34,
      exercises: [
        {
          id: "band-row",
          chineseName: "弹力带划船",
          englishName: "Resistance Band Row",
          sets: 4,
          reps: "10-15 次",
          restSeconds: 75,
          durationMinutes: 10,
          cues: ["先让肩胛向后下方滑动", "手肘贴近身体", "顶峰停 1 秒"],
          commonMistakes: ["脖子紧张", "身体后仰借力", "肩头前顶"],
          videoUrl: "https://www.youtube.com/results?search_query=resistance+band+row+form",
          equipment: "30kg 弹力带"
        },
        {
          id: "band-chest-press",
          chineseName: "弹力带胸推",
          englishName: "Resistance Band Chest Press",
          sets: 3,
          reps: "8-12 次",
          restSeconds: 90,
          durationMinutes: 10,
          cues: ["肩胛保持稳定贴住肋骨", "手腕中立", "推到接近伸直但不锁死"],
          commonMistakes: ["肩膀向前冲", "肋骨外翻", "下放过深导致肩前侧疼"],
          videoUrl: "https://www.youtube.com/results?search_query=resistance+band+chest+press+form",
          equipment: "15kg 或 30kg 弹力带"
        },
        {
          id: "band-lateral-raise",
          chineseName: "弹力带侧平举",
          englishName: "Band Lateral Raise",
          sets: 3,
          reps: "12-18 次",
          restSeconds: 60,
          durationMinutes: 7,
          cues: ["手臂在身体斜前方抬起", "肩膀远离耳朵", "全程慢速"],
          commonMistakes: ["耸肩", "甩动借力", "超过肩高仍硬抬"],
          videoUrl: "https://www.youtube.com/results?search_query=band+lateral+raise+form",
          equipment: "15kg 弹力带"
        },
        {
          id: "band-pull-apart",
          chineseName: "弹力带拉开",
          englishName: "Band Pull Apart",
          sets: 3,
          reps: "15-20 次",
          restSeconds: 45,
          durationMinutes: 7,
          cues: ["手臂微屈", "肩胛向后靠近", "控制回放"],
          commonMistakes: ["腰背后仰", "手腕塌陷", "只追求拉很宽"],
          videoUrl: "https://www.youtube.com/results?search_query=band+pull+apart+form",
          equipment: "15kg 弹力带"
        }
      ]
    },
    {
      id: "core",
      title: "腹肌与骨盆控制",
      startMinute: 44,
      durationMinutes: 10,
      exercises: [
        {
          id: "dead-bug",
          chineseName: "死虫",
          englishName: "Dead Bug",
          sets: 3,
          reps: "每侧 8-10 次",
          restSeconds: 45,
          durationMinutes: 5,
          cues: ["下背轻贴地面", "慢慢伸腿伸手", "呼气时收紧腹部"],
          commonMistakes: ["腰离地", "速度太快", "脖子用力"],
          videoUrl: "https://www.youtube.com/results?search_query=dead+bug+exercise+form"
        },
        {
          id: "plank",
          chineseName: "平板支撑",
          englishName: "Forearm Plank",
          sets: 3,
          reps: "30-45 秒",
          restSeconds: 45,
          durationMinutes: 5,
          cues: ["肘在肩正下方", "臀部微收", "从头到脚保持一条线"],
          commonMistakes: ["塌腰", "臀部过高", "肩胛失控塌陷"],
          videoUrl: "https://www.youtube.com/shorts/iCSgTupCuKY"
        }
      ]
    },
    {
      id: "cooldown",
      title: "放松整理",
      startMinute: 54,
      durationMinutes: 4,
      exercises: [
        {
          id: "pec-doorway-stretch",
          chineseName: "门框胸肌拉伸",
          englishName: "Doorway Pec Stretch",
          sets: 2,
          reps: "每侧 30 秒",
          restSeconds: 15,
          durationMinutes: 4,
          cues: ["前臂贴门框", "胸口轻轻向前", "肩前侧无刺痛"],
          commonMistakes: ["拉到疼痛", "腰椎前顶", "耸肩"],
          videoUrl: "https://www.youtube.com/results?search_query=doorway+pec+stretch"
        }
      ]
    }
  ]
};

export const microRepairPlan = {
  title: "3 分钟久坐修复",
  items: ["胸椎伸展 60 秒", "弹力带拉开 60 秒", "下巴回收 + 肩胛后缩 60 秒"]
};
