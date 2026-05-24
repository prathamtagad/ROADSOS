import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";
import { app, auth, db } from "./firebase/config";

export { auth };
export const firestore = db;
export const functions = getFunctions(app);
export const realtimeDb = getDatabase(app);

export async function ensureAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  throw new Error("Sign-in required to access Firebase resources.");
}
