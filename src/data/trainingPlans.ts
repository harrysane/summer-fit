import { Exercise, TrainingPlan } from "../models/types";

const videoUrls = {
  breathing: "https://www.youtube.com/results?search_query=diaphragmatic+breathing+physical+therapy",
  catCow: "https://www.youtube.com/results?search_query=cat+cow+exercise+form",
  thoracicRotation: "https://www.youtube.com/results?search_query=thoracic+rotation+mobility",
  wallAngel: "https://www.youtube.com/results?search_query=wall+angel+exercise+form",
  wallSlide: "https://www.youtube.com/results?search_query=wall+slide+serratus+physical+therapy",
  bandPullApart: "https://www.youtube.com/results?search_query=band+pull+apart+proper+form",
  bandFacePull: "https://www.youtube.com/results?search_query=band+face+pull+proper+form",
  externalRotation: "https://www.youtube.com/results?search_query=band+external+rotation+rotator+cuff",
  bandRow: "https://www.youtube.com/results?search_query=resistance+band+row+proper+form",
  pulldown: "https://www.youtube.com/results?search_query=resistance+band+lat+pulldown+proper+form",
  inclinePushup: "https://www.youtube.com/results?search_query=incline+push+up+proper+form",
  pushupPlus: "https://www.youtube.com/results?search_query=push+up+plus+serratus+anterior",
  chestPress: "https://www.youtube.com/results?search_query=resistance+band+chest+press+form",
  squat: "https://www.youtube.com/results?search_query=resistance+band+squat+proper+form",
  rdl: "https://www.youtube.com/results?search_query=resistance+band+romanian+deadlift+proper+form",
  splitSquat: "https://www.youtube.com/results?search_query=bulgarian+split+squat+proper+form",
  reverseLunge: "https://www.youtube.com/results?search_query=reverse+lunge+proper+form",
  gluteBridge: "https://www.youtube.com/results?search_query=glute+bridge+proper+form",
  calfRaise: "https://www.youtube.com/results?search_query=standing+calf+raise+proper+form",
  plank: "https://www.youtube.com/shorts/iCSgTupCuKY",
  sidePlank: "https://www.youtube.com/results?search_query=side+plank+proper+form",
  deadBug: "https://www.youtube.com/results?search_query=dead+bug+exercise+form",
  hollowHold: "https://www.youtube.com/results?search_query=hollow+hold+proper+form",
  mountainClimber: "https://www.youtube.com/results?search_query=mountain+climber+exercise+proper+form",
  crunch: "https://www.youtube.com/results?search_query=crunch+exercise+proper+form",
  reverseCrunch: "https://www.youtube.com/results?search_query=reverse+crunch+proper+form",
  pecStretch: "https://www.youtube.com/results?search_query=doorway+pec+stretch+physical+therapy",
  latStretch: "https://www.youtube.com/results?search_query=lat+stretch+physical+therapy",
  hipFlexor: "https://www.youtube.com/results?search_query=hip+flexor+stretch+physical+therapy",
  briskWalk: "https://www.youtube.com/results?search_query=brisk+walking+zone+2+cardio"
};

function makeExercise(params: Exercise): Exercise {
  return params;
}

function warmupExercises(): Exercise[] {
  return [
    makeExercise({
      id: "diaphragmatic-breathing",
      chineseName: "腹式呼吸",
      englishName: "Diaphragmatic Breathing",
      sets: 1,
      reps: "90 秒",
      restSeconds: 0,
      durationMinutes: 2,
      cues: ["仰卧或坐姿，肋骨下沉", "鼻吸口呼，呼气更长", "肩颈保持放松"],
      commonMistakes: ["耸肩吸气", "腰椎过度后仰", "憋气"],
      videoUrl: videoUrls.breathing
    }),
    makeExercise({
      id: "cat-cow",
      chineseName: "猫牛式",
      englishName: "Cat Cow",
      sets: 1,
      reps: "8-10 次",
      restSeconds: 0,
      durationMinutes: 2,
      cues: ["慢速活动整条脊柱", "呼吸带动动作", "颈部跟随胸椎自然移动"],
      commonMistakes: ["猛甩脖子", "只动腰不动胸椎", "速度过快"],
      videoUrl: videoUrls.catCow
    }),
    makeExercise({
      id: "wall-angel",
      chineseName: "靠墙天使",
      englishName: "Wall Angel",
      sets: 1,
      reps: "8-10 次",
      restSeconds: 20,
      durationMinutes: 3,
      cues: ["肋骨收住", "肩胛轻轻后缩下沉", "动作范围以无肩前侧疼痛为准"],
      commonMistakes: ["腰椎代偿后仰", "耸肩", "硬把手臂贴墙"],
      videoUrl: videoUrls.wallAngel
    }),
    makeExercise({
      id: "band-face-pull",
      chineseName: "弹力带面拉",
      englishName: "Band Face Pull",
      sets: 2,
      reps: "12-15 次",
      restSeconds: 30,
      durationMinutes: 3,
      cues: ["拉向眉眼高度", "结束位轻微外旋", "肩胛向后下方滑动"],
      commonMistakes: ["肩膀前顶", "只用手臂拉", "腰背后仰"],
      videoUrl: videoUrls.bandFacePull,
      equipment: "15kg 弹力带"
    })
  ];
}

export const weeklyTrainingPlans: Record<number, TrainingPlan> = {
  1: {
    id: "monday-plan",
    title: "周一：上肢修复 + 背部 + 核心",
    dayType: "training",
    estimatedMinutes: 60,
    focus: ["圆肩修复", "背部发力", "肩袖稳定", "核心抗伸展"],
    blocks: [
      {
        id: "monday-warmup",
        title: "训练前准备",
        startMinute: 0,
        durationMinutes: 10,
        exercises: warmupExercises()
      },
      {
        id: "monday-main",
        title: "背部与肩胛主训练",
        startMinute: 10,
        durationMinutes: 40,
        exercises: [
          makeExercise({
            id: "band-row",
            chineseName: "弹力带划船",
            englishName: "Resistance Band Row",
            sets: 4,
            reps: "12 次",
            restSeconds: 45,
            durationMinutes: 8,
            cues: ["先让肩胛向后下方滑动", "手肘贴近身体", "顶峰停 1 秒"],
            commonMistakes: ["身体后仰借力", "耸肩", "肩头向前顶"],
            videoUrl: videoUrls.bandRow,
            equipment: "15kg 或 30kg 弹力带"
          }),
          makeExercise({
            id: "band-face-pull-main",
            chineseName: "弹力带面拉",
            englishName: "Band Face Pull",
            sets: 4,
            reps: "15 次",
            restSeconds: 45,
            durationMinutes: 8,
            cues: ["小臂接近竖直", "拉到眉眼高度", "动作末端外旋"],
            commonMistakes: ["只用手臂拉", "肋骨外翻", "肩膀前顶"],
            videoUrl: videoUrls.bandFacePull,
            equipment: "15kg 弹力带"
          }),
          makeExercise({
            id: "incline-pushup",
            chineseName: "斜板俯卧撑",
            englishName: "Incline Push-up",
            sets: 3,
            reps: "8-12 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["身体保持一条线", "肩胛稳定贴住肋骨", "下降到肩前侧无疼痛范围"],
            commonMistakes: ["下放过深", "塌腰", "脖子前伸"],
            videoUrl: videoUrls.inclinePushup
          }),
          makeExercise({
            id: "pushup-plus",
            chineseName: "俯卧撑 Plus",
            englishName: "Push-up Plus",
            sets: 3,
            reps: "10 次",
            restSeconds: 45,
            durationMinutes: 6,
            cues: ["顶端继续把地面推远", "感受肩胛前伸", "肋骨保持收住"],
            commonMistakes: ["耸肩", "塌腰", "手肘锁死顶住"],
            videoUrl: videoUrls.pushupPlus
          }),
          makeExercise({
            id: "band-external-rotation",
            chineseName: "弹力带外旋",
            englishName: "Band External Rotation",
            sets: 3,
            reps: "左右各 12 次",
            restSeconds: 30,
            durationMinutes: 6,
            cues: ["手肘贴近身体", "小幅度慢速", "肩前侧保持放松"],
            commonMistakes: ["手肘乱跑", "用腰代偿", "拉得太重"],
            videoUrl: videoUrls.externalRotation,
            equipment: "15kg 或更轻弹力带"
          }),
          makeExercise({
            id: "dead-bug",
            chineseName: "死虫",
            englishName: "Dead Bug",
            sets: 3,
            reps: "每边 8 次",
            restSeconds: 30,
            durationMinutes: 4,
            cues: ["下背轻贴地面", "呼气时收紧腹部", "动作慢而稳"],
            commonMistakes: ["腰离地", "速度过快", "脖子用力"],
            videoUrl: videoUrls.deadBug
          })
        ]
      },
      {
        id: "monday-cooldown",
        title: "收操",
        startMinute: 50,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "pec-doorway-stretch",
            chineseName: "门框胸肌拉伸",
            englishName: "Doorway Pec Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 5,
            cues: ["前臂贴门框", "胸口轻轻向前", "肩前侧无刺痛"],
            commonMistakes: ["拉到疼痛", "腰椎前顶", "耸肩"],
            videoUrl: videoUrls.pecStretch
          }),
          makeExercise({
            id: "lat-stretch",
            chineseName: "背阔肌拉伸",
            englishName: "Lat Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 5,
            cues: ["手向远处伸", "保持自然呼吸", "不要压迫肩前侧"],
            commonMistakes: ["憋气", "肩膀硬顶", "拉伸过猛"],
            videoUrl: videoUrls.latStretch
          })
        ]
      }
    ]
  },
  2: {
    id: "tuesday-plan",
    title: "周二：下肢 + 臀腿 + 核心",
    dayType: "training",
    estimatedMinutes: 60,
    focus: ["臀腿增肌", "髋关节活动", "下肢稳定", "核心支撑"],
    blocks: [
      {
        id: "tuesday-warmup",
        title: "下肢热身",
        startMinute: 0,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "fast-walk-warmup",
            chineseName: "原地快走",
            englishName: "Marching Warm-up",
            sets: 1,
            reps: "2 分钟",
            restSeconds: 0,
            durationMinutes: 2,
            cues: ["轻微出汗即可", "摆臂自然", "呼吸稳定"],
            commonMistakes: ["一开始冲太快", "脚步过重", "耸肩"],
            videoUrl: videoUrls.briskWalk
          }),
          makeExercise({
            id: "hip-flexor-dynamic",
            chineseName: "髋屈肌动态拉伸",
            englishName: "Dynamic Hip Flexor Stretch",
            sets: 1,
            reps: "左右各 60 秒",
            restSeconds: 0,
            durationMinutes: 3,
            cues: ["骨盆微后倾", "感受髋前侧拉伸", "不要塌腰"],
            commonMistakes: ["腰椎前顶", "膝盖压痛", "憋气"],
            videoUrl: videoUrls.hipFlexor
          }),
          makeExercise({
            id: "bodyweight-squat",
            chineseName: "徒手深蹲",
            englishName: "Bodyweight Squat",
            sets: 2,
            reps: "15 次",
            restSeconds: 30,
            durationMinutes: 3,
            cues: ["膝盖跟脚尖方向一致", "脚掌踩稳", "躯干自然挺直"],
            commonMistakes: ["膝内扣", "脚跟抬起", "塌腰"],
            videoUrl: videoUrls.squat
          }),
          makeExercise({
            id: "glute-bridge-warmup",
            chineseName: "臀桥",
            englishName: "Glute Bridge",
            sets: 2,
            reps: "15 次",
            restSeconds: 30,
            durationMinutes: 2,
            cues: ["顶端夹臀", "肋骨别外翻", "脚跟发力"],
            commonMistakes: ["用腰顶", "膝盖乱晃", "速度太快"],
            videoUrl: videoUrls.gluteBridge
          })
        ]
      },
      {
        id: "tuesday-main",
        title: "臀腿主训练",
        startMinute: 10,
        durationMinutes: 40,
        exercises: [
          makeExercise({
            id: "band-squat",
            chineseName: "弹力带深蹲",
            englishName: "Banded Squat",
            sets: 4,
            reps: "12 次",
            restSeconds: 60,
            durationMinutes: 10,
            cues: ["脚掌踩稳", "膝盖跟脚尖方向一致", "站起时臀腿发力"],
            commonMistakes: ["膝内扣", "弯腰塌背", "弹力带位置不稳"],
            videoUrl: videoUrls.squat,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "band-rdl",
            chineseName: "弹力带罗马尼亚硬拉",
            englishName: "Banded Romanian Deadlift",
            sets: 4,
            reps: "10-12 次",
            restSeconds: 60,
            durationMinutes: 10,
            cues: ["髋向后折叠", "背部保持中立", "感受腘绳肌拉长"],
            commonMistakes: ["圆背", "蹲成深蹲", "耸肩拉"],
            videoUrl: videoUrls.rdl,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "bulgarian-split-squat",
            chineseName: "保加利亚分腿蹲",
            englishName: "Bulgarian Split Squat",
            sets: 3,
            reps: "左右各 8 次",
            restSeconds: 60,
            durationMinutes: 10,
            cues: ["前脚踩稳", "躯干稳定", "下降到可控范围"],
            commonMistakes: ["前膝乱晃", "身体歪斜", "后脚用力过多"],
            videoUrl: videoUrls.splitSquat,
            equipment: "徒手或 15kg 弹力带"
          }),
          makeExercise({
            id: "banded-glute-bridge",
            chineseName: "弹力带臀桥",
            englishName: "Banded Glute Bridge",
            sets: 3,
            reps: "15 次",
            restSeconds: 45,
            durationMinutes: 5,
            cues: ["顶端夹臀", "骨盆保持稳定", "膝盖跟脚尖同向"],
            commonMistakes: ["用腰顶", "动作太快", "膝盖内扣"],
            videoUrl: videoUrls.gluteBridge,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "standing-calf-raise",
            chineseName: "站姿提踵",
            englishName: "Standing Calf Raise",
            sets: 4,
            reps: "20 次",
            restSeconds: 30,
            durationMinutes: 5,
            cues: ["顶端停顿", "慢速下放", "脚踝保持正直"],
            commonMistakes: ["弹震借力", "脚踝内翻", "半程动作"],
            videoUrl: videoUrls.calfRaise
          })
        ]
      },
      {
        id: "tuesday-core",
        title: "核心与收操",
        startMinute: 50,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "plank",
            chineseName: "平板支撑",
            englishName: "Forearm Plank",
            sets: 3,
            reps: "40 秒",
            restSeconds: 30,
            durationMinutes: 5,
            cues: ["肘部在肩下方", "肋骨下沉", "臀部不要塌"],
            commonMistakes: ["塌腰", "臀部过高", "屏住呼吸"],
            videoUrl: videoUrls.plank
          }),
          makeExercise({
            id: "side-plank",
            chineseName: "侧平板",
            englishName: "Side Plank",
            sets: 2,
            reps: "左右各 30 秒",
            restSeconds: 30,
            durationMinutes: 5,
            cues: ["身体成一直线", "肩膀远离耳朵", "骨盆不要后倒"],
            commonMistakes: ["塌腰", "肩膀顶住", "身体旋转"],
            videoUrl: videoUrls.sidePlank
          })
        ]
      }
    ]
  },
  3: {
    id: "wednesday-plan",
    title: "周三：恢复日",
    dayType: "rest",
    estimatedMinutes: 50,
    focus: ["主动恢复", "肩胛修复", "胸椎活动", "低强度有氧"],
    blocks: [
      {
        id: "wednesday-cardio",
        title: "低强度快走",
        startMinute: 0,
        durationMinutes: 30,
        exercises: [
          makeExercise({
            id: "brisk-walk",
            chineseName: "快走",
            englishName: "Brisk Walk",
            sets: 1,
            reps: "30 分钟",
            restSeconds: 0,
            durationMinutes: 30,
            cues: ["能说话但略喘", "步幅自然", "肩颈放松"],
            commonMistakes: ["走到很累", "低头看手机", "耸肩"],
            videoUrl: videoUrls.briskWalk
          })
        ]
      },
      {
        id: "wednesday-scapula",
        title: "肩胛修复",
        startMinute: 30,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "band-pull-apart",
            chineseName: "弹力带拉开",
            englishName: "Band Pull Apart",
            sets: 2,
            reps: "15 次",
            restSeconds: 30,
            durationMinutes: 4,
            cues: ["肩胛后缩", "控制回放", "肋骨收住"],
            commonMistakes: ["耸肩", "腰背后仰", "手腕塌陷"],
            videoUrl: videoUrls.bandPullApart,
            equipment: "15kg 弹力带"
          }),
          makeExercise({
            id: "band-external-rotation",
            chineseName: "弹力带外旋",
            englishName: "Band External Rotation",
            sets: 2,
            reps: "左右各 12 次",
            restSeconds: 30,
            durationMinutes: 6,
            cues: ["手肘贴身", "慢速小幅度", "肩前侧放松"],
            commonMistakes: ["拉太重", "肘部乱跑", "身体旋转"],
            videoUrl: videoUrls.externalRotation,
            equipment: "15kg 或更轻弹力带"
          })
        ]
      },
      {
        id: "wednesday-mobility",
        title: "拉伸放松",
        startMinute: 40,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "pec-doorway-stretch",
            chineseName: "胸肌拉伸",
            englishName: "Doorway Pec Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 5,
            cues: ["轻柔拉伸", "不要顶肩", "保持呼吸"],
            commonMistakes: ["拉到刺痛", "腰椎前顶", "耸肩"],
            videoUrl: videoUrls.pecStretch
          }),
          makeExercise({
            id: "hip-flexor-stretch",
            chineseName: "髋屈肌拉伸",
            englishName: "Hip Flexor Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 5,
            cues: ["骨盆微后倾", "髋前侧拉开", "身体保持高"],
            commonMistakes: ["塌腰", "膝盖压痛", "憋气"],
            videoUrl: videoUrls.hipFlexor
          })
        ]
      }
    ]
  },
  4: {
    id: "thursday-plan",
    title: "周四：上肢推拉 + 肩袖稳定",
    dayType: "training",
    estimatedMinutes: 60,
    focus: ["上肢推拉", "肩袖稳定", "肩前侧减压", "核心控制"],
    blocks: [
      {
        id: "thursday-warmup",
        title: "上肢热身",
        startMinute: 0,
        durationMinutes: 10,
        exercises: warmupExercises()
      },
      {
        id: "thursday-main",
        title: "推拉主训练",
        startMinute: 10,
        durationMinutes: 40,
        exercises: [
          makeExercise({
            id: "band-row-heavy",
            chineseName: "弹力带划船",
            englishName: "Resistance Band Row",
            sets: 4,
            reps: "10 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["背部先发力", "手肘贴近身体", "顶峰停顿"],
            commonMistakes: ["耸肩", "身体后仰", "肩膀向前顶"],
            videoUrl: videoUrls.bandRow,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "band-lat-pulldown",
            chineseName: "弹力带下拉模拟",
            englishName: "Band Lat Pulldown",
            sets: 4,
            reps: "12 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["手肘向身体两侧下拉", "胸椎自然伸展", "肩胛下沉"],
            commonMistakes: ["腰后仰", "脖子紧张", "只用手拉"],
            videoUrl: videoUrls.pulldown,
            equipment: "15kg 或 30kg 弹力带"
          }),
          makeExercise({
            id: "incline-pushup-thursday",
            chineseName: "斜板俯卧撑",
            englishName: "Incline Push-up",
            sets: 4,
            reps: "8-12 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["动作范围可控", "肩胛稳定", "肋骨收住"],
            commonMistakes: ["肩前侧夹痛还硬做", "下放过深", "塌腰"],
            videoUrl: videoUrls.inclinePushup
          }),
          makeExercise({
            id: "band-chest-press",
            chineseName: "弹力带胸前推",
            englishName: "Band Chest Press",
            sets: 3,
            reps: "12 次",
            restSeconds: 60,
            durationMinutes: 6,
            cues: ["肩膀不前顶", "推到接近伸直但不锁死", "肩胛贴住肋骨"],
            commonMistakes: ["下放过深", "肋骨外翻", "耸肩"],
            videoUrl: videoUrls.chestPress,
            equipment: "15kg 弹力带"
          }),
          makeExercise({
            id: "external-rotation-retraction",
            chineseName: "弹力带外旋 + 肩胛后缩",
            englishName: "External Rotation + Scapular Retraction",
            sets: 3,
            reps: "左右各 12 次",
            restSeconds: 30,
            durationMinutes: 6,
            cues: ["先稳定肩胛", "再做小幅外旋", "肩前侧保持轻松"],
            commonMistakes: ["用腰代偿", "肘部乱跑", "拉得太重"],
            videoUrl: videoUrls.externalRotation,
            equipment: "15kg 或更轻弹力带"
          }),
          makeExercise({
            id: "hollow-hold",
            chineseName: "Hollow Hold",
            englishName: "Hollow Hold",
            sets: 3,
            reps: "20-30 秒",
            restSeconds: 30,
            durationMinutes: 4,
            cues: ["下背贴地", "肋骨下沉", "保持自然呼吸"],
            commonMistakes: ["脖子硬顶", "腰离地", "憋气"],
            videoUrl: videoUrls.hollowHold
          })
        ]
      },
      {
        id: "thursday-cooldown",
        title: "收操",
        startMinute: 50,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "pec-doorway-stretch",
            chineseName: "门框胸肌拉伸",
            englishName: "Doorway Pec Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 5,
            cues: ["胸口轻轻向前", "肩前侧无刺痛", "保持呼吸"],
            commonMistakes: ["拉伸过猛", "耸肩", "腰椎前顶"],
            videoUrl: videoUrls.pecStretch
          }),
          makeExercise({
            id: "lat-stretch",
            chineseName: "背阔肌拉伸",
            englishName: "Lat Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 5,
            cues: ["手向远处伸", "肩膀放松", "不要压迫肩前侧"],
            commonMistakes: ["憋气", "拉伸过猛", "身体扭转"],
            videoUrl: videoUrls.latStretch
          })
        ]
      }
    ]
  },
  5: {
    id: "friday-plan",
    title: "周五：下肢 + 腹肌强化",
    dayType: "training",
    estimatedMinutes: 60,
    focus: ["下肢力量", "臀腿训练", "腹肌强化", "核心耐力"],
    blocks: [
      {
        id: "friday-warmup",
        title: "热身",
        startMinute: 0,
        durationMinutes: 10,
        exercises: [
          makeExercise({
            id: "lower-warmup-flow",
            chineseName: "下肢热身组合",
            englishName: "Lower Body Warm-up Flow",
            sets: 1,
            reps: "10 分钟",
            restSeconds: 0,
            durationMinutes: 10,
            cues: ["快走、髋活动、臀桥、徒手深蹲依次完成", "逐渐升温", "保持动作质量"],
            commonMistakes: ["冷启动高强度", "省略髋活动", "动作太急"],
            videoUrl: videoUrls.hipFlexor
          })
        ]
      },
      {
        id: "friday-main",
        title: "下肢主训练",
        startMinute: 10,
        durationMinutes: 32,
        exercises: [
          makeExercise({
            id: "band-squat-friday",
            chineseName: "弹力带深蹲",
            englishName: "Banded Squat",
            sets: 4,
            reps: "12 次",
            restSeconds: 60,
            durationMinutes: 10,
            cues: ["脚掌踩稳", "膝盖跟脚尖同向", "站起时臀腿发力"],
            commonMistakes: ["膝内扣", "圆背", "只追求速度"],
            videoUrl: videoUrls.squat,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "reverse-lunge",
            chineseName: "反向箭步蹲",
            englishName: "Reverse Lunge",
            sets: 3,
            reps: "左右各 10 次",
            restSeconds: 45,
            durationMinutes: 8,
            cues: ["后脚轻落地", "前脚发力回到站立", "躯干稳定"],
            commonMistakes: ["身体晃动", "前膝内扣", "步幅过小"],
            videoUrl: videoUrls.reverseLunge
          }),
          makeExercise({
            id: "band-deadlift",
            chineseName: "弹力带硬拉",
            englishName: "Banded Deadlift",
            sets: 4,
            reps: "10 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["髋主导", "背部中立", "站起时夹臀"],
            commonMistakes: ["圆背", "耸肩拉", "膝盖过度前移"],
            videoUrl: videoUrls.rdl,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "glute-bridge-friday",
            chineseName: "臀桥",
            englishName: "Glute Bridge",
            sets: 3,
            reps: "15 次",
            restSeconds: 45,
            durationMinutes: 6,
            cues: ["顶端夹臀", "肋骨下沉", "脚跟发力"],
            commonMistakes: ["用腰顶", "动作过快", "膝盖内扣"],
            videoUrl: videoUrls.gluteBridge
          })
        ]
      },
      {
        id: "friday-core",
        title: "腹肌强化与收操",
        startMinute: 42,
        durationMinutes: 18,
        exercises: [
          makeExercise({
            id: "mountain-climber",
            chineseName: "登山跑",
            englishName: "Mountain Climber",
            sets: 5,
            reps: "30 秒",
            restSeconds: 30,
            durationMinutes: 5,
            cues: ["肩在手腕上方", "核心收紧", "节奏稳定"],
            commonMistakes: ["臀太高", "塌腰", "脚步砸地"],
            videoUrl: videoUrls.mountainClimber
          }),
          makeExercise({
            id: "crunch",
            chineseName: "卷腹",
            englishName: "Crunch",
            sets: 3,
            reps: "15 次",
            restSeconds: 30,
            durationMinutes: 5,
            cues: ["胸椎卷起", "下背不离地", "呼气收腹"],
            commonMistakes: ["拽脖子", "用惯性甩", "憋气"],
            videoUrl: videoUrls.crunch
          }),
          makeExercise({
            id: "reverse-crunch",
            chineseName: "反向卷腹",
            englishName: "Reverse Crunch",
            sets: 3,
            reps: "12 次",
            restSeconds: 30,
            durationMinutes: 4,
            cues: ["骨盆卷起", "慢速下放", "腹部持续发力"],
            commonMistakes: ["甩腿", "腰椎撞地", "速度太快"],
            videoUrl: videoUrls.reverseCrunch
          }),
          makeExercise({
            id: "hip-flexor-stretch",
            chineseName: "髋屈肌拉伸",
            englishName: "Hip Flexor Stretch",
            sets: 2,
            reps: "每侧 45 秒",
            restSeconds: 15,
            durationMinutes: 4,
            cues: ["骨盆微后倾", "呼吸放松", "不要压迫膝盖"],
            commonMistakes: ["塌腰", "拉伸过猛", "憋气"],
            videoUrl: videoUrls.hipFlexor
          })
        ]
      }
    ]
  },
  6: {
    id: "saturday-plan",
    title: "周六：全身训练 + 低强度有氧",
    dayType: "training",
    estimatedMinutes: 75,
    focus: ["全身训练", "臀腿与背部", "核心循环", "低强度有氧"],
    blocks: [
      {
        id: "saturday-warmup",
        title: "全身热身",
        startMinute: 0,
        durationMinutes: 10,
        exercises: warmupExercises()
      },
      {
        id: "saturday-main",
        title: "全身力量训练",
        startMinute: 10,
        durationMinutes: 44,
        exercises: [
          makeExercise({
            id: "band-squat-saturday",
            chineseName: "弹力带深蹲",
            englishName: "Banded Squat",
            sets: 4,
            reps: "12 次",
            restSeconds: 60,
            durationMinutes: 10,
            cues: ["稳定下蹲", "臀腿发力", "膝盖跟脚尖同向"],
            commonMistakes: ["膝内扣", "圆背", "动作变形还加速"],
            videoUrl: videoUrls.squat,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "band-row-saturday",
            chineseName: "弹力带划船",
            englishName: "Resistance Band Row",
            sets: 4,
            reps: "12 次",
            restSeconds: 60,
            durationMinutes: 10,
            cues: ["背部发力", "肩胛后缩下沉", "顶峰停顿"],
            commonMistakes: ["耸肩", "身体后仰", "手臂抢力"],
            videoUrl: videoUrls.bandRow,
            equipment: "15kg 或 30kg 弹力带"
          }),
          makeExercise({
            id: "incline-pushup-saturday",
            chineseName: "斜板俯卧撑",
            englishName: "Incline Push-up",
            sets: 4,
            reps: "10 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["身体一条线", "肩胛稳定", "下降到可控范围"],
            commonMistakes: ["肩前侧疼痛还硬做", "塌腰", "脖子前伸"],
            videoUrl: videoUrls.inclinePushup
          }),
          makeExercise({
            id: "band-rdl-saturday",
            chineseName: "弹力带罗马尼亚硬拉",
            englishName: "Banded Romanian Deadlift",
            sets: 4,
            reps: "10 次",
            restSeconds: 60,
            durationMinutes: 8,
            cues: ["髋向后折叠", "背部中立", "腘绳肌拉长"],
            commonMistakes: ["圆背", "蹲得太多", "耸肩"],
            videoUrl: videoUrls.rdl,
            equipment: "30kg 弹力带"
          }),
          makeExercise({
            id: "face-pull-external-rotation",
            chineseName: "面拉 + 外旋",
            englishName: "Face Pull + External Rotation",
            sets: 3,
            reps: "各 12-15 次",
            restSeconds: 30,
            durationMinutes: 8,
            cues: ["肩胛稳定", "动作慢", "肩前侧轻松"],
            commonMistakes: ["借力甩", "耸肩", "拉得太重"],
            videoUrl: videoUrls.bandFacePull,
            equipment: "15kg 弹力带"
          })
        ]
      },
      {
        id: "saturday-core-cardio",
        title: "核心循环与有氧",
        startMinute: 54,
        durationMinutes: 21,
        exercises: [
          makeExercise({
            id: "core-circuit",
            chineseName: "核心循环",
            englishName: "Core Circuit",
            sets: 3,
            reps: "平板、侧平板、死虫",
            restSeconds: 30,
            durationMinutes: 8,
            cues: ["保持抗伸展", "动作质量优先", "自然呼吸"],
            commonMistakes: ["塌腰", "憋气", "追求速度"],
            videoUrl: videoUrls.deadBug
          }),
          makeExercise({
            id: "zone-2-cardio",
            chineseName: "快走 / 慢跑 / 单车",
            englishName: "Zone 2 Cardio",
            sets: 1,
            reps: "10 分钟",
            restSeconds: 0,
            durationMinutes: 10,
            cues: ["能说话但略喘", "保持轻松", "不要冲刺"],
            commonMistakes: ["强度太高", "步频乱", "耸肩"],
            videoUrl: videoUrls.briskWalk
          }),
          makeExercise({
            id: "cooldown-breathing",
            chineseName: "拉伸放松",
            englishName: "Cool Down",
            sets: 1,
            reps: "3 分钟",
            restSeconds: 0,
            durationMinutes: 3,
            cues: ["呼吸放慢", "拉伸轻柔", "记录训练感受"],
            commonMistakes: ["直接结束", "拉伸过猛", "忽略肩前侧反馈"],
            videoUrl: videoUrls.pecStretch
          })
        ]
      }
    ]
  },
  0: {
    id: "sunday-plan",
    title: "周日：休息 / 拉伸 / 散步",
    dayType: "rest",
    estimatedMinutes: 52,
    focus: ["主动恢复", "散步", "晚间肩颈修复", "一周复盘"],
    blocks: [
      {
        id: "sunday-walk",
        title: "主动恢复",
        startMinute: 0,
        durationMinutes: 40,
        exercises: [
          makeExercise({
            id: "easy-walk",
            chineseName: "散步",
            englishName: "Easy Walk",
            sets: 1,
            reps: "40-60 分钟",
            restSeconds: 0,
            durationMinutes: 40,
            cues: ["保持轻松", "不要久坐一整天", "可以饭后进行"],
            commonMistakes: ["完全躺一天", "走到很累", "低头看手机"],
            videoUrl: videoUrls.briskWalk
          })
        ]
      },
      {
        id: "sunday-evening-reset",
        title: "晚间肩颈修复",
        startMinute: 40,
        durationMinutes: 12,
        exercises: [
          makeExercise({
            id: "wall-slide",
            chineseName: "墙面滑行",
            englishName: "Wall Slide",
            sets: 2,
            reps: "10 次",
            restSeconds: 30,
            durationMinutes: 4,
            cues: ["肋骨收住", "肩胛贴住肋骨滑动", "肩前侧无刺痛"],
            commonMistakes: ["腰椎后仰", "耸肩", "硬顶到疼痛"],
            videoUrl: videoUrls.wallSlide
          }),
          makeExercise({
            id: "pec-doorway-stretch",
            chineseName: "门框胸肌拉伸",
            englishName: "Doorway Pec Stretch",
            sets: 2,
            reps: "每侧 60 秒",
            restSeconds: 15,
            durationMinutes: 4,
            cues: ["轻柔拉伸", "肩膀远离耳朵", "自然呼吸"],
            commonMistakes: ["拉到疼痛", "腰椎前顶", "憋气"],
            videoUrl: videoUrls.pecStretch
          }),
          makeExercise({
            id: "diaphragmatic-breathing",
            chineseName: "腹式呼吸",
            englishName: "Diaphragmatic Breathing",
            sets: 1,
            reps: "4 分钟",
            restSeconds: 0,
            durationMinutes: 4,
            cues: ["降低兴奋度", "呼气更长", "准备睡觉"],
            commonMistakes: ["刷手机分心", "耸肩呼吸", "憋气"],
            videoUrl: videoUrls.breathing
          })
        ]
      }
    ]
  }
};

export const todayPlan: TrainingPlan = weeklyTrainingPlans[1];

export const microRepairPlan = {
  title: "3 分钟久坐修复",
  items: ["下巴微收 40 秒", "肩胛后缩下沉 40 秒", "胸小肌拉伸 50 秒", "原地深蹲或提踵 50 秒"]
};

export function getTrainingPlanForDate(date: Date): TrainingPlan {
  return weeklyTrainingPlans[date.getDay()] ?? todayPlan;
}
