import { z } from "zod";

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  nickname: z.string().min(1).max(30),
  age: z.number().int().min(1).max(120),
  avatarBaseId: z.string(),
  timezone: z.string(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export const OnboardingRequestSchema = z.object({
  name: z.string().min(1).max(50),
  nickname: z.string().min(1).max(30),
  age: z.number().int().min(1).max(120),
  avatarBaseId: z.string().min(1),
  timezone: z.string().default("UTC"),
  initialCosmetics: z
    .object({
      hairId: z.string().optional(),
      outfitId: z.string().optional(),
      shoesId: z.string().optional(),
      accessoryId: z.string().optional(),
      backgroundId: z.string().optional(),
    })
    .optional(),
});

export type OnboardingRequest = z.infer<typeof OnboardingRequestSchema>;
