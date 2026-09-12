import type { Request, Response, NextFunction } from "express";
import { authAdmin } from "../config/firebase.js";
import { env } from "../config/env.js";
import { AppError } from "./errorHandler.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError(401, "AUTH_REQUIRED", "Authentication is required to access this resource."));
    return;
  }

  const token = authHeader.substring("Bearer ".length).trim();
  if (!token) {
    next(new AppError(401, "AUTH_REQUIRED", "Invalid Authorization header format."));
    return;
  }

  // Support local dev bypass tokens in dev/test mode for rapid testing & offline dev
  if (env.DEV_AUTH_BYPASS && token.startsWith("dev-token:")) {
    const parts = token.split(":");
    const uid = parts[1] || "dev-hero-1";
    const email = parts[2] || "hero@liferpg.local";
    req.user = {
      uid,
      email,
      displayName: "Dev Hero",
    };
    next();
    return;
  }

  try {
    const decodedToken = await authAdmin().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
    next();
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    next(
      new AppError(
        401,
        "INVALID_TOKEN",
        "The provided authentication token is invalid or expired.",
        err?.message
      )
    );
  }
}
