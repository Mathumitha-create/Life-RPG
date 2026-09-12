import rateLimit from "express-rate-limit";
import type { ApiResponse } from "@liferpg/contracts";

export const standardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please slow down and try again later.",
      },
      requestId: req.requestId || "unknown",
    };
    res.status(429).json(response);
  },
});

export const expensiveRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 expensive requests per minute (e.g., AI interpretation)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "AI_RATE_LIMIT_EXCEEDED",
        message: "Activity interpretation rate limit exceeded. Please wait a moment.",
      },
      requestId: req.requestId || "unknown",
    };
    res.status(429).json(response);
  },
});
