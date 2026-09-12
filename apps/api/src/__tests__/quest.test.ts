import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();
const heroAuth = "Bearer dev-token:quest-hero:quest@liferpg.local";
const otherAuth = "Bearer dev-token:other-hero:other@liferpg.local";

describe("Phase 3 quest interpretation and CRUD", () => {
  it("interprets a common activity into structured facts without rewards", async () => {
    const response = await request(app)
      .post("/api/v1/activities/interpret")
      .set("Authorization", heroAuth)
      .send({ categoryId: "mind", text: "Study DSA for 2 hours" });

    expect(response.status).toBe(200);
    expect(response.body.data.interpretation.activityType).toBe("study");
    expect(response.body.data.interpretation.value).toBe(120);
    expect(response.body.data.interpretation.metric).toBe("duration");
    expect(response.body.data.interpretation.xp).toBeUndefined();
  });

  it("creates, updates, lists, and deletes only the authenticated user's quests", async () => {
    const created = await request(app)
      .post("/api/v1/quests")
      .set("Authorization", heroAuth)
      .send({ categoryId: "body", text: "Walk 5 km", type: "DAILY" });

    expect(created.status).toBe(201);
    expect(created.body.data.rewardPreview.xp).toBeGreaterThan(0);
    expect(created.body.data.type).toBe("DAILY");

    const questId = created.body.data.id as string;
    const foreignUpdate = await request(app)
      .patch(`/api/v1/quests/${questId}`)
      .set("Authorization", otherAuth)
      .send({ title: "Stolen quest" });
    expect(foreignUpdate.status).toBe(404);

    const updated = await request(app)
      .patch(`/api/v1/quests/${questId}`)
      .set("Authorization", heroAuth)
      .send({ title: "Walk five kilometers" });
    expect(updated.status).toBe(200);
    expect(updated.body.data.title).toBe("Walk five kilometers");

    const listed = await request(app).get("/api/v1/quests").set("Authorization", heroAuth);
    expect(listed.status).toBe(200);
    expect(listed.body.data.some((quest: { id: string }) => quest.id === questId)).toBe(true);

    const deleted = await request(app).delete(`/api/v1/quests/${questId}`).set("Authorization", heroAuth);
    expect(deleted.status).toBe(204);
  });

  it("requests one concise clarification for ambiguous activity text", async () => {
    const response = await request(app)
      .post("/api/v1/quests")
      .set("Authorization", heroAuth)
      .send({ categoryId: "life", text: "Do something useful" });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("CLARIFICATION_NEEDED");
    expect(response.body.error.details.interpretation.clarificationNeeded).toBe(true);
  });
});