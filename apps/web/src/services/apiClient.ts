import type {
  ApiResponse,
  UserProfile,
  CharacterState,
  OnboardingRequest,
  UpdateCosmeticsRequest,
  ActivityInterpretation,
  CreateQuestRequest,
  Quest,
  UpdateQuestRequest,
} from "@liferpg/contracts";
import type { BaseAvatarDefinition, CosmeticAssetDefinition } from "@liferpg/game-rules";

export class ApiClient {
  private getHeaders(idToken: string | null): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (idToken) {
      headers["Authorization"] = `Bearer ${idToken}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, idToken: string | null): Promise<T> {
    const headers = {
      ...this.getHeaders(idToken),
      ...(options.headers || {}),
    };

    const res = await fetch(`/api/v1${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 204) return undefined as T;

    const json = (await res.json()) as ApiResponse<T>;

    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "An unexpected network error occurred.");
    }

    return json.data as T;
  }

  async getProfile(idToken: string | null): Promise<UserProfile | null> {
    return this.request<UserProfile | null>("/me", { method: "GET" }, idToken);
  }

  async completeOnboarding(
    data: OnboardingRequest,
    idToken: string | null
  ): Promise<{ profile: UserProfile; character: CharacterState }> {
    return this.request<{ profile: UserProfile; character: CharacterState }>(
      "/onboarding",
      { method: "POST", body: JSON.stringify(data) },
      idToken
    );
  }

  async getCharacter(idToken: string | null): Promise<CharacterState> {
    return this.request<CharacterState>("/character", { method: "GET" }, idToken);
  }

  async updateCosmetics(data: UpdateCosmeticsRequest, idToken: string | null): Promise<CharacterState> {
    return this.request<CharacterState>(
      "/character/cosmetics",
      { method: "PATCH", body: JSON.stringify(data) },
      idToken
    );
  }

  async getAssetsCatalog(): Promise<{
    baseAvatars: BaseAvatarDefinition[];
    cosmetics: CosmeticAssetDefinition[];
  }> {
    return this.request<{
      baseAvatars: BaseAvatarDefinition[];
      cosmetics: CosmeticAssetDefinition[];
    }>("/catalog/assets", { method: "GET" }, null);
  }

    async interpretActivity(
      data: Pick<CreateQuestRequest, "categoryId" | "text">,
      idToken: string | null
    ): Promise<{ categoryId: string; interpretation: ActivityInterpretation }> {
      return this.request("/activities/interpret", { method: "POST", body: JSON.stringify(data) }, idToken);
    }

    async getQuests(idToken: string | null): Promise<Quest[]> {
      return this.request<Quest[]>("/quests", { method: "GET" }, idToken);
    }

    async createQuest(data: CreateQuestRequest, idToken: string | null): Promise<Quest> {
      return this.request<Quest>("/quests", { method: "POST", body: JSON.stringify(data) }, idToken);
    }

    async updateQuest(questId: string, data: UpdateQuestRequest, idToken: string | null): Promise<Quest> {
      return this.request<Quest>(`/quests/${questId}`, { method: "PATCH", body: JSON.stringify(data) }, idToken);
    }

    async deleteQuest(questId: string, idToken: string | null): Promise<void> {
      await this.request<never>(`/quests/${questId}`, { method: "DELETE" }, idToken);
    }
}

export const apiClient = new ApiClient();
