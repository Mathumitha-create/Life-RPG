import type { UserProfile, CharacterState } from "@liferpg/contracts";

class UserRepository {
  private profiles = new Map<string, UserProfile>();
  private characters = new Map<string, CharacterState>();

  async getProfile(uid: string): Promise<UserProfile | null> {
    return this.profiles.get(uid) ?? null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    this.profiles.set(profile.uid, { ...profile, updatedAt: new Date().toISOString() });
  }

  async getCharacter(uid: string): Promise<CharacterState | null> {
    return this.characters.get(uid) ?? null;
  }

  async saveCharacter(character: CharacterState & { uid?: string }, uid: string): Promise<void> {
    this.characters.set(uid, { ...character, updatedAt: new Date().toISOString() });
  }

  clearForTesting(): void {
    this.profiles.clear();
    this.characters.clear();
  }
}

export const userRepository = new UserRepository();
