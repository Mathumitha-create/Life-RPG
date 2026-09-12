import type { Quest } from "@liferpg/contracts";
import { env } from "../config/env.js";
import { firestoreAdmin } from "../config/firebase.js";

class QuestRepository {
  private quests = new Map<string, Quest>();

  private get usesFirestore(): boolean {
    return Boolean(env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
  }

  private collection(uid: string) {
    return firestoreAdmin().collection("users").doc(uid).collection("quests");
  }

  async listByUser(uid: string): Promise<Quest[]> {
    if (this.usesFirestore) {
      const snapshot = await this.collection(uid).get();
      return snapshot.docs
        .map((doc) => doc.data() as Quest)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    }
    return [...this.quests.values()]
      .filter((quest) => quest.userId === uid)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async getById(uid: string, questId: string): Promise<Quest | null> {
    if (this.usesFirestore) {
      const snapshot = await this.collection(uid).doc(questId).get();
      return snapshot.exists ? (snapshot.data() as Quest) : null;
    }
    const quest = this.quests.get(questId);
    return quest?.userId === uid ? quest : null;
  }

  async save(quest: Quest): Promise<Quest> {
    if (this.usesFirestore) {
      await this.collection(quest.userId).doc(quest.id).set(quest);
      return quest;
    }
    this.quests.set(quest.id, quest);
    return quest;
  }

  async delete(uid: string, questId: string): Promise<boolean> {
    const quest = await this.getById(uid, questId);
    if (!quest) return false;
    if (this.usesFirestore) {
      await this.collection(uid).doc(questId).delete();
      return true;
    }
    return this.quests.delete(questId);
  }

  clearForTesting(): void {
    this.quests.clear();
  }
}

export const questRepository = new QuestRepository();