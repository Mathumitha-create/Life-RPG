import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("Onboarding & Character System", () => {
  const devAuthHeader = "Bearer dev-token:hero_99:hero99@liferpg.local";

  it("completes onboarding successfully for a new user", async () => {
    const payload = {
      name: "Arthur Pendelton",
      nickname: "Arthur",
      age: 26,
      avatarBaseId: "base_warrior",
      timezone: "America/New_York",
      initialCosmetics: {
        hairId: "hair_spiky_amber",
        outfitId: "outfit_plate_armor",
        backgroundId: "bg_mountain",
      },
    };

    const res = await request(app)
      .post("/api/v1/onboarding")
      .set("Authorization", devAuthHeader)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.nickname).toBe("Arthur");
    expect(res.body.data.character.level).toBe(1);
    expect(res.body.data.character.gold).toBe(100);
    expect(res.body.data.character.gems).toBe(5);
    expect(res.body.data.character.attributes.strength).toBe(16);
  });

  it("fetches character state with attributes and cosmetics", async () => {
    const res = await request(app)
      .get("/api/v1/character")
      .set("Authorization", devAuthHeader);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.level).toBe(1);
    expect(res.body.data.cosmetics.hairId).toBe("hair_spiky_amber");
  });

  it("updates character cosmetics smoothly", async () => {
    const res = await request(app)
      .patch("/api/v1/character/cosmetics")
      .set("Authorization", devAuthHeader)
      .send({
        backgroundId: "bg_celestial",
        accessoryId: "acc_glasses",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cosmetics.backgroundId).toBe("bg_celestial");
    expect(res.body.data.cosmetics.accessoryId).toBe("acc_glasses");
  });

  it("fetches global asset catalog", async () => {
    const res = await request(app).get("/api/v1/catalog/assets");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.baseAvatars.length).toBeGreaterThanOrEqual(6);
    expect(res.body.data.cosmetics.length).toBeGreaterThanOrEqual(10);
  });
});
