import admin from "firebase-admin";
import { env } from "./env.js";

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  if (admin.apps.length > 0 && admin.apps[0]) {
    firebaseApp = admin.apps[0];
    return firebaseApp;
  }

  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Local / development / testing fallback
    firebaseApp = admin.initializeApp({
      projectId: env.FIREBASE_PROJECT_ID,
    });
  }

  return firebaseApp;
}

export const authAdmin = () => getFirebaseAdmin().auth();
export const firestoreAdmin = () => getFirebaseAdmin().firestore();
