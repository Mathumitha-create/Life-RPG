import { z } from "zod";

export const CharacterAttributesSchema = z.object({
  intellect: z.number().int().min(0).default(10),
  strength: z.number().int().min(0).default(10),
  discipline: z.number().int().min(0).default(10),
  creativity: z.number().int().min(0).default(10),
  wisdom: z.number().int().min(0).default(10),
  social: z.number().int().min(0).default(10),
});

export type CharacterAttributes = z.infer<typeof CharacterAttributesSchema>;

export const CharacterCosmeticsSchema = z.object({
  hairId: z.string(),
  outfitId: z.string(),
  shoesId: z.string().optional(),
  accessoryId: z.string().optional(),
  backgroundId: z.string(),
  effectId: z.string().optional(),
});

export type CharacterCosmetics = z.infer<typeof CharacterCosmeticsSchema>;

export const CharacterStateSchema = z.object({
  level: z.number().int().min(1),
  totalXp: z.number().int().min(0),
  gold: z.number().int().min(0),
  gems: z.number().int().min(0),
  currentLevelTitle: z.string(),
  attributes: CharacterAttributesSchema,
  cosmetics: CharacterCosmeticsSchema,
  avatarBaseId: z.string(),
  currentStreak: z.number().int().min(0),
  longestStreak: z.number().int().min(0),
  lastActivityDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CharacterState = z.infer<typeof CharacterStateSchema>;

export const UpdateCosmeticsRequestSchema = z.object({
  hairId: z.string().optional(),
  outfitId: z.string().optional(),
  shoesId: z.string().optional(),
  accessoryId: z.string().optional(),
  backgroundId: z.string().optional(),
  effectId: z.string().optional(),
});

export type UpdateCosmeticsRequest = z.infer<typeof UpdateCosmeticsRequestSchema>;
