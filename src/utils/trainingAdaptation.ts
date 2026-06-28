import { TrainingSetLog } from "../models/types";

export type TrainingAdaptationReason =
  | "early-calibration"
  | "too-easy"
  | "too-hard"
  | "discomfort-risk"
  | "missing-feedback"
  | "no-prompt";

export type TrainingAdaptationSeverity = "low" | "medium" | "high";

export type TrainingAdaptationResult = {
  shouldPrompt: boolean;
  reason: TrainingAdaptationReason;
  severity: TrainingAdaptationSeverity;
  message: string;
  suggestedAction?: string;
};

type AnalyzeTrainingAdaptationOptions = {
  logs: TrainingSetLog[];
  planId?: string;
  exerciseId?: string;
  now?: Date;
};

const RECENT_LOG_LIMIT = 6;
const HIGH_PAIN_SCORE = 4;
const SEVERE_PAIN_SCORE = 7;
const HIGH_RPE = 9;
const LOW_RPE = 6;
const HIGH_REPS = 15;

export function analyzeTrainingAdaptation(
  options: AnalyzeTrainingAdaptationOptions
): TrainingAdaptationResult {
  const { logs, planId, exerciseId, now = new Date() } = options;
  const scopedLogs = getScopedLogs(logs, planId, exerciseId);
  const recentLogs = scopedLogs.slice(0, RECENT_LOG_LIMIT);
  const uniqueTrainingDays = countUniqueTrainingDays(scopedLogs);

  // Product meaning: shoulder pain or discomfort is a safety signal. It should take priority
  // over progress suggestions because the user may need to reduce range, load, or stop an exercise.
  const highestPainScore = maxNumber(recentLogs.map((log) => log.shoulderPainScore));
  if (highestPainScore >= HIGH_PAIN_SCORE) {
    return {
      shouldPrompt: true,
      reason: "discomfort-risk",
      severity: highestPainScore >= SEVERE_PAIN_SCORE ? "high" : "medium",
      message:
        highestPainScore >= SEVERE_PAIN_SCORE
          ? "最近记录中出现了强烈肩部不适，需要优先保护动作安全。"
          : "最近记录中肩部不适评分偏高，建议先确认动作幅度和肩前侧压力。",
      suggestedAction:
        highestPainScore >= SEVERE_PAIN_SCORE
          ? "停止相关动作，改做轻量修复，并考虑咨询专业人士。"
          : "下次训练降低幅度或弹力带强度，保持疼痛不超过 3/10。"
    };
  }

  // Product meaning: very high RPE suggests the set may be too close to failure for the current
  // recovery level. Prompt only when it appears in recent logs, not after every hard set.
  const highRpeCount = recentLogs.filter((log) => log.rpe >= HIGH_RPE).length;
  if (highRpeCount >= 2 || recentLogs[0]?.rpe >= 10) {
    return {
      shouldPrompt: true,
      reason: "too-hard",
      severity: "medium",
      message: "最近训练主观难度偏高，可能已经接近力竭或恢复压力过大。",
      suggestedAction: "下次同类动作先减少 1 组，或降低弹力带强度，目标 RPE 控制在 7-8。"
    };
  }

  // Product meaning: early data is noisy. During the first few training days, prompt the user to
  // keep recording consistently instead of giving aggressive progression advice.
  if (scopedLogs.length < 3 || [1, 3, 7].includes(uniqueTrainingDays)) {
    return {
      shouldPrompt: true,
      reason: "early-calibration",
      severity: "low",
      message: "当前训练记录还在校准期，系统需要更多数据判断你的真实强度。",
      suggestedAction: "继续记录每组次数、弹力带重量、RPE 和肩部不适评分。"
    };
  }

  // Product meaning: adaptation rules depend on subjective feedback. If many recent logs have
  // missing or invalid RPE / discomfort values, ask for better feedback before making suggestions.
  const missingFeedbackCount = recentLogs.filter(isMissingSubjectiveFeedback).length;
  if (recentLogs.length >= 4 && missingFeedbackCount >= Math.ceil(recentLogs.length / 2)) {
    return {
      shouldPrompt: true,
      reason: "missing-feedback",
      severity: "low",
      message: "最近训练记录缺少足够的主观反馈，系统暂时难以判断强度是否合适。",
      suggestedAction: "保存记录时补充 RPE 和肩部不适评分，尤其是最后 1-2 组。"
    };
  }

  // Product meaning: if the user repeatedly exceeds common rep targets with low RPE and low
  // discomfort, the current exercise setup is likely too easy and can progress conservatively.
  const easyRecentLogs = recentLogs.filter(
    (log) => log.reps >= HIGH_REPS && log.rpe > 0 && log.rpe <= LOW_RPE && log.shoulderPainScore <= 2
  );
  if (recentLogs.length >= 4 && easyRecentLogs.length >= 3) {
    return {
      shouldPrompt: true,
      reason: "too-easy",
      severity: "low",
      message: "最近多组训练完成次数较高，RPE 较低，且没有明显不适，当前强度可能偏轻。",
      suggestedAction: "下次可优先增加 1-2 次重复，或在动作稳定时升级弹力带强度。"
    };
  }

  return {
    shouldPrompt: false,
    reason: "no-prompt",
    severity: "low",
    message: "当前训练记录没有触发额外反馈提示。"
  };
}

function getScopedLogs(logs: TrainingSetLog[], planId?: string, exerciseId?: string) {
  return [...logs]
    .filter((log) => (planId ? log.planId === planId : true))
    .filter((log) => (exerciseId ? log.exerciseId === exerciseId : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function countUniqueTrainingDays(logs: TrainingSetLog[]) {
  const days = new Set<string>();

  for (const log of logs) {
    const date = new Date(log.createdAt);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    days.add(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`
    );
  }

  return days.size;
}

function isMissingSubjectiveFeedback(log: TrainingSetLog) {
  return !Number.isFinite(log.rpe) || log.rpe <= 0 || !Number.isFinite(log.shoulderPainScore);
}

function maxNumber(values: number[]) {
  return values.reduce((max, value) => (Number.isFinite(value) ? Math.max(max, value) : max), 0);
}
