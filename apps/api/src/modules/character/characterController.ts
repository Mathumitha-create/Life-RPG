import type { Request, Response } from "express";
import { UpdateCosmeticsRequestSchema, type ApiResponse } from "@liferpg/contracts";
import { characterService } from "./characterService.js";

export async function getCharacterHandler(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const character = await characterService.getCharacter(user.uid);

  const response: ApiResponse<typeof character> = {
    success: true,
    data: character,
    requestId: req.requestId || "unknown",
  };

  res.status(200).json(response);
}

export async function updateCosmeticsHandler(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  const body = UpdateCosmeticsRequestSchema.parse(req.body);

  const character = await characterService.updateCosmetics(user.uid, body);

  const response: ApiResponse<typeof character> = {
    success: true,
    data: character,
    requestId: req.requestId || "unknown",
  };

  res.status(200).json(response);
}
