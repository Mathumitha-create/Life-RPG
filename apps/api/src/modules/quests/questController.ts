import type { Request, Response } from "express";
import { ActivityInterpretationRequestSchema, CreateQuestRequestSchema, UpdateQuestRequestSchema, type ApiResponse } from "@liferpg/contracts";
import { questService } from "./questService.js";

function getQuestId(req: Request): string {
  const questId = req.params.id;
  if (!questId) throw new Error("Quest ID is required.");
  return questId;
}

export async function interpretActivityHandler(req: Request, res: Response): Promise<void> {
  const body = ActivityInterpretationRequestSchema.parse(req.body);
  const interpretation = await questService.interpret(body.categoryId, body.text);
  const response: ApiResponse<{ categoryId: string; interpretation: typeof interpretation }> = {
    success: true,
    data: { categoryId: body.categoryId, interpretation },
    requestId: req.requestId || "unknown",
  };
  res.status(200).json(response);
}

export async function listQuestsHandler(req: Request, res: Response): Promise<void> {
  const quests = await questService.list(req.user!.uid);
  const response: ApiResponse<typeof quests> = { success: true, data: quests, requestId: req.requestId || "unknown" };
  res.status(200).json(response);
}

export async function createQuestHandler(req: Request, res: Response): Promise<void> {
  const quest = await questService.create(req.user!.uid, CreateQuestRequestSchema.parse(req.body));
  const response: ApiResponse<typeof quest> = { success: true, data: quest, requestId: req.requestId || "unknown" };
  res.status(201).json(response);
}

export async function updateQuestHandler(req: Request, res: Response): Promise<void> {
  const quest = await questService.update(req.user!.uid, getQuestId(req), UpdateQuestRequestSchema.parse(req.body));
  const response: ApiResponse<typeof quest> = { success: true, data: quest, requestId: req.requestId || "unknown" };
  res.status(200).json(response);
}

export async function deleteQuestHandler(req: Request, res: Response): Promise<void> {
  await questService.delete(req.user!.uid, getQuestId(req));
  res.status(204).send();
}