import type { OnboardingRequest, UserProfile, CharacterState } from "@liferpg/contracts";
import { getBaseAvatar, getLevelTitle } from "@liferpg/game-rules";
import { userRepository } from "../../repositories/userRepository.js";
import { AppError } from "../../middleware/errorHandler.js";

export class UserService {
  async getProfile(uid: string): Promise<UserProfile | null> {
    return userRepository.getProfile(uid);
  }

  async completeOnboarding(
    uid: string,
    email: string,
    data: OnboardingRequest
  ): Promise<{ profile: UserProfile; character: CharacterState }> {
    const existing = await userRepository.getProfile(uid);
    if (existing && existing.onboardingCompleted) {
      throw new AppError(400, "ONBOARDING_ALREADY_COMPLETED", "User onboarding has already been completed.");
    }

    const baseAvatar = getBaseAvatar(data.avatarBaseId);
    const now = new Date().toISOString();

    const profile: UserProfile = {
      uid,
      email,
      displayName: data.name,
      nickname: data.nickname,
      age: data.age,
      avatarBaseId: data.avatarBaseId,
      timezone: data.timezone || "UTC",
      onboardingCompleted: true,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    const initialCosmetics = {
      ...baseAvatar.defaultCosmetics,
      ...(data.initialCosmetics || {}),
    };

    const character: CharacterState = {
      level: 1,
      totalXp: 0,
      gold: 100, // Initial welcome reward
      gems: 5,   // Initial welcome gems
      currentLevelTitle: getLevelTitle(1),
      attributes: { ...baseAvatar.baseAttributes },
      cosmetics: initialCosmetics,
      avatarBaseId: data.avatarBaseId,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: now,
      updatedAt: now,
    };

    await userRepository.saveProfile(profile);
    await userRepository.saveCharacter(character, uid);

    return { profile, character };
  }
}

export const userService = new UserService();
