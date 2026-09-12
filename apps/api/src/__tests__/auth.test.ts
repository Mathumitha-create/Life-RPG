import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("API Foundation & Auth Middleware", () => {
  it("GET /api/v1/health returns 200 with standard ApiResponse envelope", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("healthy");
    expect(res.body.requestId).toBeDefined();
    expect(res.headers["x-request-id"]).toBeDefined();
  });

  it("GET /api/v1/me rejects request without Authorization header with 401", async () => {
    const res = await request(app).get("/api/v1/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("AUTH_REQUIRED");
  });

  it("GET /api/v1/me rejects request with invalid Authorization token", async () => {
    const res = await request(app)
      .get("/api/v1/me")
      .set("Authorization", "Bearer invalid-token-xyz");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_TOKEN");
  });

  it("GET /api/v1/me resolves profile with valid dev bypass token", async () => {
    const res = await request(app)
      .get("/api/v1/me")
      .set("Authorization", "Bearer dev-token:user123:test@liferpg.local");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.uid).toBe("user123");
    expect(res.body.data.email).toBe("test@liferpg.local");
  });
});
