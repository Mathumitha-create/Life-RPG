import { nanoid } from "nanoid";
import type { CreateQuestRequest, Quest, UpdateQuestRequest } from "@liferpg/contracts";
import { calculateRewards } from "@liferpg/game-rules";
import { AppError } from "../../middleware/errorHandler.js";
import { questRepository } from "../../repositories/questRepository.js";
import { activityInterpreter, type ActivityInterpreter } from "./activityInterpreter.js";

export class QuestService {
  constructor(private readonly interpreter: ActivityInterpreter = activityInterpreter) {}

  async interpret(categoryId: CreateQuestRequest["categoryId"], text: string) {
    return this.interpreter.interpret({ categoryId, text });
  }

  async list(uid: string): Promise<Quest[]> {
    return questRepository.listByUser(uid);
  }

  async create(uid: string, request: CreateQuestRequest): Promise<Quest> {
    const interpretation = await this.interpret(request.categoryId, request.text);
    if (interpretation.clarificationNeeded) {
      throw new AppError(422, "CLARIFICATION_NEEDED", interpretation.clarificationPrompt ?? "Please clarify this activity.", { interpretation });
    }
    const now = new Date().toISOString();
    const rewardPreview = calculateRewards({
      categoryId: request.categoryId,
      difficultyBand: interpretation.difficultyBand,
      metric: interpretation.metric,
      value: interpretation.value,
    });
    const quest: Quest = {
      id: nanoid(),
      userId: uid,
      title: interpretation.normalizedTitle,
      rawInput: request.text,
      normalizedActivity: interpretation.activityType,
      categoryId: request.categoryId,
      type: request.type,
      status: "ACTIVE",
      interpretation,
      rewardPreview: {
        xp: rewardPreview.xp,
        gold: rewardPreview.gold,
        gem: rewardPreview.gem,
        attributeEffects: rewardPreview.attributeEffects,
      },
      recurrence: request.recurrence,
      challenge: request.challenge ? { ...request.challenge, current: 0 } : undefined,
      createdAt: now,
      updatedAt: now,
    };
    return questRepository.save(quest);
  }

  async update(uid: string, questId: string, updates: UpdateQuestRequest): Promise<Quest> {
    const quest = await questRepository.getById(uid, questId);
    if (!quest) throw new AppError(404, "QUEST_NOT_FOUND", "This quest could not be found.");
    return questRepository.save({ ...quest, ...updates, updatedAt: new Date().toISOString() });
  }

  async delete(uid: string, questId: string): Promise<void> {
    if (!(await questRepository.delete(uid, questId))) {
      throw new AppError(404, "QUEST_NOT_FOUND", "This quest could not be found.");
    }
  }
}

export const questService = new QuestService();