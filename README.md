# Summer Fit Coach

基于 Expo + React Native 的健身与饮食管理 App。项目面向实习期间久坐较多、希望进行体态修复和增肌重塑的用户，提供今日训练计划、动作记录、饮食记录、训练建议和每日完成打卡等功能。

当前版本优先支持 Expo Web，并使用浏览器 `localStorage` 做本地持久化，适合作为后续接入 Supabase、AI 食物识别和移动端本地通知的产品原型。

## 项目简介

Summer Fit Coach 以“可坚持的训练系统”为核心，而不是单纯记录数据。应用将训练动作、动作要点、常见错误、倒计时、训练记录和饮食建议整合在同一个界面中，帮助用户在工作日通勤和久坐场景下完成相对轻量但连续的训练管理。

目标场景：

- 暑假或实习期间的自重 / 弹力带训练
- 久坐导致的圆肩、含胸、肩胛不稳等体态问题
- 增肌重塑与腹肌强化
- Web 端快速使用，后续平滑扩展到移动端

## 核心功能

- 今日训练计划：展示当天训练主题、训练模块、动作列表和倒计时。
- 动作详情：包含中文名、英文名、组数、次数、休息时间、动作要点、常见错误和参考视频。
- 训练记录：记录动作、组数、次数、弹力带重量、RPE 和肩部疼痛评分。
- 今日训练完成打卡：支持每日完成状态展示，并通过 `localStorage` 在 Web 端持久化。
- 饮食记录：支持上传食物照片，使用模拟 AI 识别结果估算营养，并允许手动修改克数。
- 营养建议：根据训练日 / 休息日目标，计算热量、蛋白质、碳水和脂肪差距，并给出补充建议。
- 久坐提醒：预留工作日久坐修复提醒逻辑，覆盖 10:20、14:20、16:20 三个时间点。
- 视频播放：支持 YouTube 嵌入参考视频，并预留本地视频播放器用于处理后的视频素材。

## 技术栈

- Expo SDK 51
- React 18
- React Native 0.74
- React Native Web
- TypeScript
- Expo Notifications
- Expo Image Picker
- Browser localStorage
- Python + OpenCV + FFmpeg：用于本地动作视频风格化处理脚本

## 当前已完成功能

- 搭建 Expo + React Native 项目结构。
- 完成底部 Tab 导航和主要页面：
  - 今日训练
  - 训练记录
  - 饮食记录
  - 每日建议
- 完成训练计划数据模型和示例训练数据。
- 完成动作卡片组件，展示动作处方、要点、错误和视频。
- 完成今日训练倒计时组件。
- 完成训练记录的基础录入和展示。
- 完成饮食照片上传、模拟识别、克数调整和营养汇总。
- 完成训练日 / 休息日营养目标和每日补充建议。
- 完成今日训练打卡，并在 Expo Web 中通过 `localStorage` 持久化。
- 完成疼痛评分说明，帮助用户判断训练中是否需要降低强度或停止动作。
- 新增本地视频处理脚本，可将动作视频转换为黑白水墨线稿风格。

## 后续计划

- 接入 Supabase，实现用户数据、训练记录、饮食记录和打卡记录的云端同步。
- 接入真实多模态 AI API，根据食物照片识别食物种类、估算重量和宏量营养。
- 将 Web 端 `localStorage` 抽象为 repository，统一 Web / iOS / Android 的存储接口。
- 完善训练周期系统，支持 8 周渐进计划、周计划切换和训练完成率统计。
- 增加训练趋势图，例如周训练次数、RPE 变化、肩痛评分变化、体重和腰围记录。
- 优化移动端体验，完善 iOS / Android 本地通知和离线使用。
- 增加更多动作视频素材，并用本地视频播放器替代部分外部链接。

## 本地运行

安装依赖：

```bash
npm install
```

启动 Expo Web：

```bash
npm run web
```

如果在 Windows PowerShell 中遇到脚本执行策略限制，可以使用：

```bash
npm.cmd run web
```

启动后访问：

```text
http://localhost:8081
```

如果 8081 端口被占用，可以指定其他端口：

```bash
npx expo start --web --port 8082
```

类型检查：

```bash
npm run typecheck
```

或在 PowerShell 中使用：

```bash
npm.cmd run typecheck
```

## 视频处理脚本

项目包含一个可选的视频处理脚本，用于将原始动作视频转换成黑白水墨线稿风格视频。

默认输入：

```text
source-videos/plank.mp4
```

默认输出：

```text
public/videos/plank-ink.mp4
```

安装脚本依赖：

```bash
python -m pip install -r requirements-video.txt
```

运行处理：

```bash
python scripts/process_ink_video.py
```

如果系统找不到 FFmpeg，可以安装 FFmpeg，或通过参数指定路径：

```bash
python scripts/process_ink_video.py --ffmpeg C:\path\to\ffmpeg.exe
```

## 项目定位

这是一个仍在迭代中的个人作品集项目。当前重点是验证健身管理 App 的信息架构、训练流程和本地记录体验；后续会继续补齐云端数据、AI 识别、训练统计和移动端体验。
