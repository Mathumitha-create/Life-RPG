import type { Request, Response } from "express";
import { BASE_AVATARS, COSMETIC_ASSETS } from "@liferpg/game-rules";
import type { ApiResponse } from "@liferpg/contracts";

export async function getAssetsCatalogHandler(req: Request, res: Response): Promise<void> {
  const response: ApiResponse<{
    baseAvatars: typeof BASE_AVATARS;
    cosmetics: typeof COSMETIC_ASSETS;
  }> = {
    success: true,
    data: {
      baseAvatars: BASE_AVATARS,
      cosmetics: COSMETIC_ASSETS,
    },
    requestId: req.requestId || "unknown",
  };

  res.status(200).json(response);
}
