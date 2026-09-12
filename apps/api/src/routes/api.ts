import { Router } from "express";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ApiResponse } from "@liferpg/contracts";
import { requireAuth } from "../middleware/auth.js";
import { onboardingHandler, getProfileHandler } from "../modules/users/userController.js";
import { getCharacterHandler, updateCosmeticsHandler } from "../modules/character/characterController.js";
import { getAssetsCatalogHandler } from "../modules/catalog/catalogController.js";
import {
  createQuestHandler,
  deleteQuestHandler,
  interpretActivityHandler,
  listQuestsHandler,
  updateQuestHandler,
} from "../modules/quests/questController.js";

export const apiRouter = Router();

function asyncHandler(handler: (req: Request, res: Response) => Promise<void>): RequestHandler {
  return (req, res, next: NextFunction) => {
    void handler(req, res).catch(next);
  };
}

// Health check endpoint (Public)
apiRouter.get("/health", (req: Request, res: Response) => {
  const response: ApiResponse<{ status: string; uptime: number; timestamp: string }> = {
    success: true,
    data: {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    requestId: req.requestId || "unknown",
  };
  res.status(200).json(response);
});

// Catalog endpoints (Public or authenticated)
apiRouter.get("/catalog/assets", getAssetsCatalogHandler);

// Authenticated user profile routes
apiRouter.get("/me", requireAuth, getProfileHandler);
apiRouter.post("/onboarding", requireAuth, onboardingHandler);

// Authenticated character routes
apiRouter.get("/character", requireAuth, getCharacterHandler);
apiRouter.patch("/character/cosmetics", requireAuth, updateCosmeticsHandler);

// Quest creation and management routes
apiRouter.post("/activities/interpret", requireAuth, asyncHandler(interpretActivityHandler));
apiRouter.get("/quests", requireAuth, asyncHandler(listQuestsHandler));
apiRouter.post("/quests", requireAuth, asyncHandler(createQuestHandler));
apiRouter.patch("/quests/:id", requireAuth, asyncHandler(updateQuestHandler));
apiRouter.delete("/quests/:id", requireAuth, asyncHandler(deleteQuestHandler));
