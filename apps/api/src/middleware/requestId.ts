import type { Request, Response, NextFunction } from "express";
import { nanoid } from "nanoid";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        uid: string;
        email?: string;
        displayName?: string;
      };
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.header("X-Request-Id");
  const requestId = incomingId && incomingId.length > 0 ? incomingId : `req_${nanoid(12)}`;
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}
