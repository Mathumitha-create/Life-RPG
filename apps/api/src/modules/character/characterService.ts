import type { CharacterState, UpdateCosmeticsRequest } from "@liferpg/contracts";
import { userRepository } from "../../repositories/userRepository.js";
import { getBaseAvatar, getLevelTitle } from "@liferpg/game-rules";

export class CharacterService {
  async getCharacter(uid: string): Promise<CharacterState> {
    let character = await userRepository.getCharacter(uid);

    // If character does not exist yet (e.g. dev user before onboarding), create default
    if (!character) {
      const defaultAvatar = getBaseAvatar("base_warrior");
      const now = new Date().toISOString();
      const newCharacter: CharacterState = {
        level: 1,
        totalXp: 0,
        gold: 100,
        gems: 5,
        currentLevelTitle: getLevelTitle(1),
        attributes: { ...defaultAvatar.baseAttributes },
        cosmetics: { ...defaultAvatar.defaultCosmetics },
        avatarBaseId: defaultAvatar.id,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: now,
        updatedAt: now,
      };
      await userRepository.saveCharacter(newCharacter, uid);
      character = newCharacter;
    }

    return character;
  }

  async updateCosmetics(uid: string, updates: UpdateCosmeticsRequest): Promise<CharacterState> {
    const character = await this.getCharacter(uid);

    const updatedCosmetics = {
      ...character.cosmetics,
      ...(updates.hairId && { hairId: updates.hairId }),
      ...(updates.outfitId && { outfitId: updates.outfitId }),
      ...(updates.shoesId && { shoesId: updates.shoesId }),
      ...(updates.accessoryId && { accessoryId: updates.accessoryId }),
      ...(updates.backgroundId && { backgroundId: updates.backgroundId }),
      ...(updates.effectId && { effectId: updates.effectId }),
    };

    const updatedCharacter: CharacterState = {
      ...character,
      cosmetics: updatedCosmetics,
      updatedAt: new Date().toISOString(),
    };

    await userRepository.saveCharacter(updatedCharacter, uid);
    return updatedCharacter;
  }
}

export const characterService = new CharacterService();
