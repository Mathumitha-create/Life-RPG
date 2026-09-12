import type { Request, Response } from "express";
import { OnboardingRequestSchema, type ApiResponse, type UserProfile } from "@liferpg/contracts";
import { userService } from "./userService.js";

export async function onboardingHandler(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const body = OnboardingRequestSchema.parse(req.body);

  const result = await userService.completeOnboarding(
    user.uid,
    user.email || "adventurer@liferpg.local",
    body
  );

  const response: ApiResponse<typeof result> = {
    success: true,
    data: result,
    requestId: req.requestId || "unknown",
  };

  res.status(201).json(response);
}

export async function getProfileHandler(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  let profile = await userService.getProfile(user.uid);

  if (!profile) {
    profile = {
      uid: user.uid,
      email: user.email || "adventurer@liferpg.local",
      displayName: user.displayName || "Adventurer",
      nickname: user.displayName || "Nova",
      age: 24,
      avatarBaseId: "base_warrior",
      timezone: "UTC",
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const response: ApiResponse<UserProfile> = {
    success: true,
    data: profile,
    requestId: req.requestId || "unknown",
  };

  res.status(200).json(response);
}
