import type {
  ApiResponse,
  UserProfile,
  CharacterState,
  OnboardingRequest,
  UpdateCosmeticsRequest,
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
}

export const apiClient = new ApiClient();
