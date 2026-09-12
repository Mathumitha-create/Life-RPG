import React from "react";
import { useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { OnboardingWizard } from "./features/onboarding/OnboardingWizard";
import { GameShell } from "./components/layout/GameShell";
import { apiClient } from "./services/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { OnboardingRequest, CharacterCosmetics, UserProfile, CharacterState, CreateQuestRequest } from "@liferpg/contracts";
import { Compass } from "lucide-react";

export function App(): React.JSX.Element {
  const { user, idToken, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();

  // Fetch User Profile
  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      try {
        const res = await apiClient.getProfile(idToken);
        return res;
      } catch {
        // Return initial mock state for dev mode if backend profile is not yet initialized
        const initialProfile: UserProfile = {
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
        return initialProfile;
      }
    },
    enabled: !!user,
  });

  // Fetch Character State
  const { data: character, isLoading: isCharacterLoading } = useQuery({
    queryKey: ["characterState", user?.uid],
    queryFn: async () => {
      if (!user) return null;
      return apiClient.getCharacter(idToken);
    },
    enabled: !!user && !!profile?.onboardingCompleted,
  });

  const { data: quests = [], isLoading: isQuestsLoading, error: questsError } = useQuery({
    queryKey: ["quests", user?.uid],
    queryFn: () => apiClient.getQuests(idToken),
    enabled: !!user && !!profile?.onboardingCompleted,
  });

  // Onboarding Mutation
  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingRequest) => {
      return apiClient.completeOnboarding(data, idToken);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(["userProfile", user?.uid], result.profile);
      queryClient.setQueryData(["characterState", user?.uid], result.character);
    },
  });

  // Update Cosmetics Mutation
  const updateCosmeticsMutation = useMutation({
    mutationFn: async (cosmetics: CharacterCosmetics) => {
      return apiClient.updateCosmetics(cosmetics, idToken);
    },
    onSuccess: (updatedCharacter) => {
      queryClient.setQueryData(["characterState", user?.uid], updatedCharacter);
    },
  });

  const createQuestMutation = useMutation({
    mutationFn: (data: CreateQuestRequest) => apiClient.createQuest(data, idToken),
    onSuccess: (quest) => queryClient.setQueryData(["quests", user?.uid], (current: typeof quests) => [quest, ...current]),
  });

  const updateQuestMutation = useMutation({
    mutationFn: ({ questId, title }: { questId: string; title: string }) => apiClient.updateQuest(questId, { title }, idToken),
    onSuccess: (updatedQuest) => queryClient.setQueryData(["quests", user?.uid], (current: typeof quests) => current.map((quest) => quest.id === updatedQuest.id ? updatedQuest : quest)),
  });

  const deleteQuestMutation = useMutation({
    mutationFn: (questId: string) => apiClient.deleteQuest(questId, idToken),
    onSuccess: (_result, questId) => queryClient.setQueryData(["quests", user?.uid], (current: typeof quests) => current.filter((quest) => quest.id !== questId)),
  });

  if (isAuthLoading || (user && (isProfileLoading || (profile?.onboardingCompleted && isCharacterLoading)))) {
    return (
      <div className="min-h-screen bg-rpg-bg flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rpg-panel border-2 border-rpg-amber flex items-center justify-center shadow-glow-amber animate-bounce">
          <Compass className="w-7 h-7 text-rpg-amber animate-spin" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-rpg-parchment font-display tracking-wider">
          Connecting to Life RPG Realm...
        </p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // If user has not completed onboarding, render OnboardingWizard
  if (!profile || !profile.onboardingCompleted) {
    return (
      <OnboardingWizard
        onComplete={async (data) => {
          await onboardingMutation.mutateAsync({
            name: data.name,
            nickname: data.nickname,
            age: data.age,
            avatarBaseId: data.avatarBaseId,
            initialCosmetics: data.initialCosmetics,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          });
        }}
        isLoading={onboardingMutation.isPending}
      />
    );
  }

  // Fallback default character state if character is still loading or resolving
  const activeCharacter: CharacterState = character || {
    level: 1,
    totalXp: 0,
    gold: 100,
    gems: 5,
    currentLevelTitle: "Wanderer",
    attributes: { intellect: 10, strength: 10, discipline: 10, creativity: 10, wisdom: 10, social: 10 },
    cosmetics: {
      hairId: "hair_spiky_amber",
      outfitId: "outfit_adventurer",
      shoesId: "shoes_boots",
      accessoryId: "acc_none",
      backgroundId: "bg_forest",
      effectId: "effect_none",
    },
    avatarBaseId: "base_warrior",
    currentStreak: 0,
    longestStreak: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <GameShell
      profile={profile}
      character={activeCharacter}
      onUpdateCosmetics={async (cosmetics) => {
        await updateCosmeticsMutation.mutateAsync(cosmetics);
      }}
      isUpdatingCosmetics={updateCosmeticsMutation.isPending}
      quests={quests}
      isLoadingQuests={isQuestsLoading}
      isSavingQuest={createQuestMutation.isPending || updateQuestMutation.isPending}
      questError={questsError instanceof Error ? questsError.message : undefined}
      onCreateQuest={async (data) => { await createQuestMutation.mutateAsync(data); }}
      onUpdateQuest={async (questId, title) => { await updateQuestMutation.mutateAsync({ questId, title }); }}
      onDeleteQuest={async (questId) => { await deleteQuestMutation.mutateAsync(questId); }}
    />
  );
}

export default App;
