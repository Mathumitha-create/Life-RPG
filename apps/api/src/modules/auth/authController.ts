import type { Request, Response } from "express";
import type { ApiResponse, UserProfile } from "@liferpg/contracts";

export async function getMeHandler(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  
  // In Phase 1 foundation: return authenticated user state
  const mockProfile: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email ?? "adventurer@liferpg.local",
    displayName: user.displayName ?? "Adventurer",
    nickname: user.displayName ?? "Nova",
    age: 24,
    avatarBaseId: "base_adventurer",
    timezone: "UTC",
    onboardingCompleted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const response: ApiResponse<typeof mockProfile> = {
    success: true,
    data: mockProfile,
    requestId: req.requestId || "unknown",
  };

  res.status(200).json(response);
}
