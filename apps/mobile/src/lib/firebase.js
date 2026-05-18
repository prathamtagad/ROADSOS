import Constants from "expo-constants";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";

const firebaseConfig = Constants.expoConfig?.extra?.firebase || {};

if (!firebaseConfig?.apiKey) {
  console.warn("Firebase config missing. Set values in apps/mobile/.env.");
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const realtimeDb = getDatabase(app);

export async function ensureAuth() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  return auth.currentUser;
}
