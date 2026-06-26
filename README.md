# 暑假体态增肌教练

React Native + Expo 健身与饮食管理 App 骨架，已包含：

- 今日训练计划与逐段倒计时
- 动作详情：中文名、英文名、组数、次数、休息、动作要点、常见错误、视频链接
- 工作日久坐修复提醒：10:20、14:20、16:20
- 训练记录：组数、次数、弹力带重量、RPE、肩痛评分
- 饮食照片上传、AI 识别服务占位、营养估算、克数手动修改
- 训练日/休息日营养目标与每日补充建议

## 运行

当前环境没有检测到 Node/npm。安装 Node.js 后在本目录执行：

```bash
npm install
npm start
```

## 后续接入点

- Supabase：替换 `src/services/storageService.ts` 或新增 repository 层。
- 多模态 AI：替换 `src/services/foodAiService.ts` 的 `recognizeFoodFromImage` 实现。
- 训练数据：扩展 `src/data/trainingPlans.ts`。
