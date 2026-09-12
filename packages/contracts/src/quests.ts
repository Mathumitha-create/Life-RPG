import { z } from "zod";

export const CategoryIdEnum = z.enum(["mind", "body", "career", "life", "social", "growth"]);
export type CategoryId = z.infer<typeof CategoryIdEnum>;

export const QuestTypeEnum = z.enum(["ONE_TIME", "DAILY", "REPEATING", "CHALLENGE"]);
export type QuestType = z.infer<typeof QuestTypeEnum>;

export const QuestStatusEnum = z.enum(["ACTIVE", "PAUSED", "ARCHIVED", "COMPLETED"]);
export type QuestStatus = z.infer<typeof QuestStatusEnum>;

export const ActivityInterpretationRequestSchema = z.object({
  categoryId: z.string(),
  text: z.string().min(1).max(500),
  locale: z.string().optional(),
});
export type ActivityInterpretationRequest = z.infer<typeof ActivityInterpretationRequestSchema>;

export const ActivityInterpretationSchema = z.object({
  activityType: z.string(),
  subject: z.string().optional(),
  metric: z.enum(["duration", "distance", "count", "pages", "completion", "amount"]).optional(),
  value: z.number().optional(),
  unit: z.string().optional(),
  polarity: z.enum(["positive", "negative", "neutral"]).default("positive"),
  difficultyBand: z.enum(["easy", "medium", "hard"]).default("medium"),
  attributeHints: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
  normalizedTitle: z.string(),
  clarificationNeeded: z.boolean().default(false),
  clarificationPrompt: z.string().optional(),
});
export type ActivityInterpretation = z.infer<typeof ActivityInterpretationSchema>;

export const RewardPreviewSchema = z.object({
  xp: z.number().int().min(0),
  gold: z.number().int().min(0),
  gem: z.number().int().min(0).default(0),
  attributeEffects: z.record(z.string(), z.number()),
});
export type RewardPreview = z.infer<typeof RewardPreviewSchema>;

export const QuestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  rawInput: z.string(),
  normalizedActivity: z.string(),
  categoryId: z.string(),
  type: QuestTypeEnum,
  status: QuestStatusEnum,
  interpretation: ActivityInterpretationSchema,
  rewardPreview: RewardPreviewSchema,
  recurrence: z
    .object({
      timezone: z.string(),
      daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    })
    .optional(),
  challenge: z
    .object({
      target: z.number(),
      unit: z.string(),
      current: z.number(),
    })
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Quest = z.infer<typeof QuestSchema>;

export const CreateQuestRequestSchema = z.object({
  categoryId: z.string(),
  text: z.string().min(1).max(500),
  type: QuestTypeEnum.default("ONE_TIME"),
  recurrence: z
    .object({
      timezone: z.string(),
      daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    })
    .optional(),
  challenge: z
    .object({
      target: z.number().positive(),
      unit: z.string(),
    })
    .optional(),
});
export type CreateQuestRequest = z.infer<typeof CreateQuestRequestSchema>;

export const UpdateQuestRequestSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  status: QuestStatusEnum.optional(),
  type: QuestTypeEnum.optional(),
});
export type UpdateQuestRequest = z.infer<typeof UpdateQuestRequestSchema>;

export const CompleteQuestRequestSchema = z.object({
  operationId: z.string().min(1),
  userLocalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  timezone: z.string().default("UTC"),
});
export type CompleteQuestRequest = z.infer<typeof CompleteQuestRequestSchema>;

export const QuestCompletionResultSchema = z.object({
  completionId: z.string(),
  questId: z.string(),
  xpEarned: z.number().int(),
  goldEarned: z.number().int(),
  gemEarned: z.number().int(),
  attributeEffects: z.record(z.string(), z.number()),
  newLevel: z.number().int(),
  previousLevel: z.number().int(),
  leveledUp: z.boolean(),
  newLevelTitle: z.string(),
  totalXp: z.number().int(),
  currentStreak: z.number().int(),
  streakIncremented: z.boolean(),
  unlockedAchievements: z.array(z.string()),
  character: z.lazy(() => z.any()),
});
export type QuestCompletionResult = z.infer<typeof QuestCompletionResultSchema>;
