import { Router } from "express";
import type { Request, Response } from "express";
import type { ApiResponse } from "@liferpg/contracts";
import { requireAuth } from "../middleware/auth.js";
import { getMeHandler } from "../modules/auth/authController.js";

export const apiRouter = Router();

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

// Authenticated user profile resolution
apiRouter.get("/me", requireAuth, getMeHandler);
