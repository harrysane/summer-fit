const profile = {
  heightCm: 172,
  weightKg: 61,
  internship: "9:00-17:00",
  commuteMinutes: 60,
  equipment: ["15kg 迪卡侬弹力带", "30kg 迪卡侬弹力带"],
  goal: "体态修复 + 增肌重塑 + 腹肌强化"
};

const nutritionTargets = {
  training: { label: "训练日", kcal: 2300, protein: 115, carbs: 290, fat: 65 },
  rest: { label: "休息日", kcal: 2100, protein: 110, carbs: 240, fat: 65 }
};

const dailySchedule = [
  ["06:45", "起床，喝水 300ml"],
  ["06:47-06:59", "早晨 12 分钟身体重置"],
  ["06:59-07:20", "早餐"],
  ["07:35-08:35", "通勤"],
  ["08:35-08:55", "公司附近慢走 10-15 分钟"],
  ["10:20-10:23", "第一次久坐修复 3 分钟"],
  ["12:00-12:25", "午饭"],
  ["12:25-12:40", "饭后走路 15 分钟"],
  ["14:20-14:23", "第二次久坐修复 3 分钟"],
  ["15:40-15:50", "加餐"],
  ["18:15-19:15", "当天主训练"],
  ["21:30-21:42", "晚间 12 分钟肩颈修复"],
  ["22:45-23:15", "入睡"]
];

const resetRoutines = {
  morning: {
    title: "早晨 12 分钟身体重置",
    blocks: [
      ["0:00-1:30", "鼻吸口呼腹式呼吸，仰卧，肋骨下沉"],
      ["1:30-3:00", "猫牛式，慢做 8-10 次"],
      ["3:00-4:30", "胸椎跪姿旋转，左右各 6 次"],
      ["4:30-6:00", "靠墙天使，8-10 次"],
      ["6:00-7:30", "弹力带拉开，15kg，15 次"],
      ["7:30-9:00", "弹力带面拉，15kg，15 次"],
      ["9:00-10:30", "臀桥，15 次"],
      ["10:30-12:00", "髋屈肌拉伸，左右各 45 秒"]
    ]
  },
  sedentary: {
    title: "3 分钟久坐修复",
    blocks: [
      ["0:00-0:40", "下巴微收，颈后拉长，做 8 次"],
      ["0:40-1:20", "肩胛后缩下沉，夹背 10 次"],
      ["1:20-2:10", "站姿胸小肌拉伸，左右各 25 秒"],
      ["2:10-3:00", "原地深蹲 10 次或站立提踵 20 次"]
    ]
  },
  evening: {
    title: "晚间 12 分钟肩颈修复",
    blocks: [
      ["0:00-2:00", "泡沫轴胸椎伸展；没有泡沫轴就用卷毛巾垫背"],
      ["2:00-4:00", "门框胸肌拉伸，左右各 1 分钟"],
      ["4:00-6:00", "弹力带外旋，左右各 12-15 次"],
      ["6:00-8:00", "墙面滑行，10 次"],
      ["8:00-10:00", "儿童式 + 背阔肌拉伸"],
      ["10:00-12:00", "腹式呼吸，降低兴奋度"]
    ]
  }
};

const videoLibrary = {
  breathing: video("腹式呼吸", "Diaphragmatic Breathing", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=diaphragmatic%20breathing%20physical%20therapy%20exercise"),
  catCow: video("猫牛式", "Cat Cow", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=cat%20cow%20exercise%20physical%20therapy"),
  thoracicRotation: video("胸椎旋转", "Thoracic Rotation", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=thoracic%20rotation%20physical%20therapy"),
  wallAngel: video("靠墙天使", "Wall Angel", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=wall%20angel%20exercise%20physical%20therapy"),
  wallSlide: video("墙面滑行", "Wall Slide", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=wall%20slide%20serratus%20physical%20therapy"),
  bandPullApart: video("弹力带拉开", "Band Pull Apart", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=band%20pull%20apart%20proper%20form"),
  bandFacePull: video("弹力带面拉", "Band Face Pull", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=band%20face%20pull%20proper%20form"),
  externalRotation: video("弹力带外旋", "Band External Rotation", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=band%20external%20rotation%20rotator%20cuff%20physical%20therapy"),
  bandRow: video("弹力带划船", "Resistance Band Row", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=resistance%20band%20row%20proper%20form"),
  pulldown: video("弹力带下拉模拟", "Band Lat Pulldown", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=resistance%20band%20lat%20pulldown%20proper%20form"),
  inclinePushup: video("斜板俯卧撑", "Incline Push-up", "军队标准", "https://www.youtube.com/embed/videoseries?listType=search&list=U.S.%20Army%20PRT%20push%20up%20proper%20form"),
  pushupPlus: video("俯卧撑 Plus", "Push-up Plus", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=push%20up%20plus%20serratus%20anterior%20physical%20therapy"),
  chestPress: video("弹力带胸前推", "Band Chest Press", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=resistance%20band%20chest%20press%20proper%20form"),
  squat: video("弹力带深蹲", "Band Squat", "军队标准", "https://www.youtube.com/embed/videoseries?listType=search&list=U.S.%20Army%20PRT%20squat%20bender"),
  rdl: video("弹力带罗马尼亚硬拉", "Band Romanian Deadlift", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=resistance%20band%20romanian%20deadlift%20proper%20form"),
  splitSquat: video("保加利亚分腿蹲", "Bulgarian Split Squat", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=bulgarian%20split%20squat%20proper%20form"),
  reverseLunge: video("反向箭步蹲", "Reverse Lunge", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=reverse%20lunge%20proper%20form"),
  gluteBridge: video("臀桥", "Glute Bridge", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=glute%20bridge%20proper%20form"),
  calfRaise: video("站姿提踵", "Standing Calf Raise", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=standing%20calf%20raise%20proper%20form"),
  plank: video("平板支撑", "Plank", "军队标准", "https://www.youtube.com/embed/iCSgTupCuKY", true),
  sidePlank: video("侧平板", "Side Plank", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=side%20plank%20proper%20form"),
  deadBug: video("死虫", "Dead Bug", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=dead%20bug%20exercise%20physical%20therapy"),
  hollowHold: video("Hollow Hold", "Hollow Hold", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=hollow%20hold%20proper%20form"),
  mountainClimber: video("登山跑", "Mountain Climber", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=mountain%20climber%20exercise%20proper%20form"),
  crunch: video("卷腹", "Crunch", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=crunch%20exercise%20proper%20form"),
  reverseCrunch: video("反向卷腹", "Reverse Crunch", "普通健身", "https://www.youtube.com/embed/videoseries?listType=search&list=reverse%20crunch%20proper%20form"),
  pecStretch: video("门框胸肌拉伸", "Doorway Pec Stretch", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=doorway%20pec%20stretch%20physical%20therapy"),
  latStretch: video("背阔肌拉伸", "Lat Stretch", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=lat%20stretch%20physical%20therapy"),
  hipFlexor: video("髋屈肌拉伸", "Hip Flexor Stretch", "康复标准", "https://www.youtube.com/embed/videoseries?listType=search&list=hip%20flexor%20stretch%20physical%20therapy")
};

const weekPlan = {
  1: {
    title: "周一：上肢修复 + 背部 + 核心",
    type: "training",
    minutes: 60,
    blocks: [
      block("0:00-1:30", "腹式呼吸", "仰卧，肋骨下沉", "2 轮", "90 秒", "0 秒", ["肋骨向下收", "鼻吸口呼"], ["腰拱起", "耸肩"], "breathing"),
      block("1:30-3:00", "猫牛式", "Cat Cow", "1 组", "10 次", "0 秒", ["慢速活动脊柱"], ["猛甩脖子"], "catCow"),
      block("3:00-4:30", "胸椎旋转", "Thoracic Rotation", "1 组", "左右各 6 次", "0 秒", ["视线跟随手肘"], ["腰部代偿"], "thoracicRotation"),
      block("4:30-6:00", "靠墙天使", "Wall Angel", "1 组", "10 次", "0 秒", ["肋骨收住", "肩不要耸"], ["腰椎后仰"], "wallAngel"),
      block("6:00-8:00", "弹力带拉开", "Band Pull Apart", "2 组", "12 次", "30 秒", ["肩胛后缩", "控制回放"], ["脖子紧", "手腕塌"], "bandPullApart"),
      block("8:00-10:00", "弹力带面拉", "Band Face Pull", "2 组", "12 次", "30 秒", ["拉到眉眼高度", "顶峰外旋"], ["肩前顶"], "bandFacePull"),
      block("10:00-18:00", "弹力带划船", "Resistance Band Row", "4 组", "12 次", "45 秒", ["先收肩胛", "肘贴近身体"], ["身体后仰借力"], "bandRow"),
      block("18:00-26:00", "弹力带面拉", "Band Face Pull", "4 组", "15 次", "30-45 秒", ["小臂接近竖直"], ["只用手臂拉"], "bandFacePull"),
      block("26:00-34:00", "斜板俯卧撑", "Incline Push-up", "3 组", "8-12 次", "60 秒", ["身体一条线", "肩胛稳定"], ["下放过深肩痛"], "inclinePushup"),
      block("34:00-40:00", "俯卧撑 Plus", "Push-up Plus", "3 组", "10 次", "45 秒", ["顶端继续推开地面"], ["塌腰"], "pushupPlus"),
      block("40:00-46:00", "弹力带外旋", "Band External Rotation", "左右各 3 组", "12 次", "30 秒", ["肘贴身体", "小幅度慢速"], ["肘乱跑"], "externalRotation"),
      block("46:00-50:00", "死虫", "Dead Bug", "3 组", "每边 8 次", "30 秒", ["下背轻贴地"], ["腰离地"], "deadBug"),
      block("50:00-60:00", "收操与记录", "Stretch + Log", "1 轮", "10 分钟", "0 秒", ["胸肌、背阔肌、呼吸"], ["拉到刺痛"], "pecStretch")
    ]
  },
  2: {
    title: "周二：下肢 + 臀腿 + 核心",
    type: "training",
    minutes: 60,
    blocks: [
      block("0:00-10:00", "下肢热身", "Lower Body Warm-up", "1 轮", "10 分钟", "0 秒", ["快走、髋屈肌动态拉伸、徒手深蹲、臀桥"], ["一开始就高强度"], "hipFlexor"),
      block("10:00-20:00", "弹力带深蹲", "Band Squat", "4 组", "12 次", "60 秒", ["膝盖跟脚尖方向一致", "脚掌踩稳"], ["膝内扣"], "squat"),
      block("20:00-30:00", "弹力带罗马尼亚硬拉", "Band Romanian Deadlift", "4 组", "10-12 次", "60 秒", ["髋向后折叠", "背部中立"], ["弯腰圆背"], "rdl"),
      block("30:00-40:00", "保加利亚分腿蹲", "Bulgarian Split Squat", "左右各 3 组", "8 次", "60 秒", ["前脚发力", "躯干稳定"], ["前膝乱晃"], "splitSquat"),
      block("40:00-45:00", "弹力带臀桥", "Banded Glute Bridge", "3 组", "15 次", "45 秒", ["顶端夹臀", "肋骨别翻"], ["用腰顶"], "gluteBridge"),
      block("45:00-50:00", "站姿提踵", "Standing Calf Raise", "4 组", "20 次", "30 秒", ["顶端停顿", "慢速下放"], ["弹震借力"], "calfRaise"),
      block("50:00-56:00", "平板 + 侧平板", "Plank + Side Plank", "3 组", "40 秒 / 30 秒", "30 秒", ["骨盆微后倾"], ["塌腰"], "plank"),
      block("56:00-60:00", "拉伸与记录", "Stretch + Log", "1 轮", "4 分钟", "0 秒", ["股四头肌、腘绳肌"], ["憋气"], "hipFlexor")
    ]
  },
  3: {
    title: "周三：恢复日",
    type: "rest",
    minutes: 50,
    blocks: [
      block("18:15-18:45", "快走", "Brisk Walk", "1 组", "30 分钟", "0 秒", ["能说话但略喘"], ["走到很累"], "plank"),
      block("18:45-18:55", "肩胛修复循环", "Scapular Reset", "2 组", "拉开 + 面拉 + 外旋", "30 秒", ["动作干净"], ["耸肩"], "bandFacePull"),
      block("18:55-19:05", "拉伸", "Mobility", "1 轮", "10 分钟", "0 秒", ["胸肌、背阔肌、髋屈肌、小腿"], ["拉到痛"], "pecStretch")
    ]
  },
  4: {
    title: "周四：上肢推拉 + 肩袖稳定",
    type: "training",
    minutes: 60,
    blocks: [
      block("0:00-10:00", "上肢热身", "Upper Warm-up", "1 轮", "10 分钟", "0 秒", ["同周一"], ["跳过热身"], "wallSlide"),
      block("10:00-18:00", "弹力带划船", "Band Row", "4 组", "10 次", "60 秒", ["肩胛先动"], ["耸肩"], "bandRow"),
      block("18:00-26:00", "弹力带下拉模拟", "Band Lat Pulldown", "4 组", "12 次", "60 秒", ["肘向身体两侧下拉"], ["腰后仰"], "pulldown"),
      block("26:00-34:00", "斜板俯卧撑", "Incline Push-up", "4 组", "8-12 次", "60 秒", ["肩胛稳定"], ["肩前侧夹痛还硬做"], "inclinePushup"),
      block("34:00-40:00", "弹力带胸前推", "Band Chest Press", "3 组", "12 次", "60 秒", ["不要锁死肘", "肩不前顶"], ["下放过深"], "chestPress"),
      block("40:00-46:00", "外旋 + 肩胛后缩", "External Rotation + Retraction", "左右各 3 组", "12 次", "30 秒", ["小幅度慢速"], ["用腰代偿"], "externalRotation"),
      block("46:00-50:00", "Hollow Hold", "Hollow Hold", "3 组", "20-30 秒", "30 秒", ["下背贴地"], ["脖子硬顶"], "hollowHold"),
      block("50:00-60:00", "收操", "Cool Down", "1 轮", "10 分钟", "0 秒", ["同周一"], ["拉伸过猛"], "pecStretch")
    ]
  },
  5: {
    title: "周五：下肢 + 腹肌强化",
    type: "training",
    minutes: 60,
    blocks: [
      block("0:00-10:00", "热身", "Warm-up", "1 轮", "10 分钟", "0 秒", ["快走、髋活动、臀桥、徒手深蹲"], ["冷启动"], "hipFlexor"),
      block("10:00-20:00", "弹力带深蹲", "Band Squat", "4 组", "12 次", "60 秒", ["脚掌踩稳"], ["膝内扣"], "squat"),
      block("20:00-28:00", "反向箭步蹲", "Reverse Lunge", "左右各 3 组", "10 次", "45 秒", ["后撤轻落地"], ["躯干摇晃"], "reverseLunge"),
      block("28:00-36:00", "弹力带硬拉", "Band Deadlift", "4 组", "10 次", "60 秒", ["髋主导"], ["圆背"], "rdl"),
      block("36:00-42:00", "臀桥", "Glute Bridge", "3 组", "15 次", "45 秒", ["顶端夹臀"], ["腰顶"], "gluteBridge"),
      block("42:00-47:00", "登山跑", "Mountain Climber", "5 组", "30 秒", "30 秒", ["肩在手腕上方"], ["臀太高"], "mountainClimber"),
      block("47:00-52:00", "卷腹", "Crunch", "3 组", "15 次", "30 秒", ["胸椎卷起"], ["拽脖子"], "crunch"),
      block("52:00-56:00", "反向卷腹", "Reverse Crunch", "3 组", "12 次", "30 秒", ["骨盆卷起"], ["甩腿"], "reverseCrunch"),
      block("56:00-60:00", "拉伸与记录", "Stretch + Log", "1 轮", "4 分钟", "0 秒", ["放松髋和腹部"], ["直接躺平不记录"], "hipFlexor")
    ]
  },
  6: {
    title: "周六：全身训练 + 有氧",
    type: "training",
    minutes: 75,
    blocks: [
      block("0:00-10:00", "全身热身", "Full Body Warm-up", "1 轮", "10 分钟", "0 秒", ["从关节活动到微出汗"], ["一上来冲刺"], "catCow"),
      block("10:00-20:00", "弹力带深蹲", "Band Squat", "4 组", "12 次", "60 秒", ["稳定下蹲"], ["膝内扣"], "squat"),
      block("20:00-30:00", "弹力带划船", "Band Row", "4 组", "12 次", "60 秒", ["背部发力"], ["耸肩"], "bandRow"),
      block("30:00-38:00", "斜板俯卧撑", "Incline Push-up", "4 组", "10 次", "60 秒", ["肩胛稳定"], ["肩前痛"], "inclinePushup"),
      block("38:00-46:00", "弹力带罗马尼亚硬拉", "Band RDL", "4 组", "10 次", "60 秒", ["髋折叠"], ["圆背"], "rdl"),
      block("46:00-54:00", "面拉 + 外旋", "Face Pull + External Rotation", "各 3 组", "12-15 次", "30 秒", ["肩袖稳定"], ["借力甩"], "bandFacePull"),
      block("54:00-62:00", "核心循环", "Core Circuit", "3 轮", "平板、侧平板、死虫", "30 秒", ["抗伸展"], ["腰塌"], "deadBug"),
      block("62:00-72:00", "低强度有氧", "Zone 2 Cardio", "1 组", "10 分钟", "0 秒", ["快走/慢跑/单车"], ["冲太猛"], "plank"),
      block("72:00-75:00", "拉伸放松", "Cool Down", "1 轮", "3 分钟", "0 秒", ["呼吸放慢"], ["直接结束"], "pecStretch")
    ]
  },
  0: {
    title: "周日：休息 / 拉伸 / 散步",
    type: "rest",
    minutes: 52,
    blocks: [
      block("任意时间", "散步", "Walk", "1 组", "40-60 分钟", "0 秒", ["保持轻松"], ["久坐一整天"], "plank"),
      block("晚上", "晚间肩颈修复", "Evening Reset", "1 轮", "12 分钟", "0 秒", ["按晚间修复流程"], ["睡前高刺激游戏"], "wallSlide")
    ]
  }
};

const progression = [
  ["第 1-2 周", "适应期：2-3 组，RPE 6，肩前侧不适就减小幅度。"],
  ["第 3-4 周", "增加训练量：大部分动作 3-4 组，每组 10-15 次。"],
  ["第 5-6 周", "提高强度：划船、深蹲、硬拉更多使用 30kg；俯卧撑降低高度。"],
  ["第 7 周", "小降量恢复：总组数减少 30%，重点修复肩、髋、胸椎。"],
  ["第 8 周", "测试周：平板 90 秒、俯卧撑 8-15 个、深蹲 40 个、30kg 划船 4x12。"]
];

const foodTemplates = {
  breakfast: [
    ["燕麦", 60, 228, 8, 40, 4],
    ["牛奶", 250, 160, 8, 12, 9],
    ["鸡蛋", 100, 144, 13, 1, 10],
    ["香蕉", 120, 110, 1, 27, 0]
  ],
  lunch: [
    ["熟米饭", 250, 290, 6, 65, 1],
    ["鸡胸/鱼/牛肉", 180, 260, 42, 0, 8],
    ["蔬菜", 300, 90, 5, 15, 2]
  ],
  snack: [
    ["无糖酸奶", 150, 110, 9, 8, 4],
    ["全麦面包", 70, 180, 7, 32, 3]
  ],
  dinner: [
    ["熟米饭", 200, 232, 5, 52, 1],
    ["肉蛋奶豆", 180, 250, 35, 5, 9],
    ["蔬菜", 300, 90, 5, 15, 2]
  ]
};

function video(nameCn, nameEn, sourceType, embedUrl, isShorts = false) {
  return { nameCn, nameEn, sourceType, embedUrl, isShorts };
}

function block(time, name, english, sets, reps, rest, cues, mistakes, videoKey) {
  return { time, name, english, sets, reps, rest, cues, mistakes, videoKey };
}

window.FIT_DATA = {
  dailySchedule,
  foodTemplates,
  nutritionTargets,
  profile,
  progression,
  resetRoutines,
  videoLibrary,
  weekPlan
};
