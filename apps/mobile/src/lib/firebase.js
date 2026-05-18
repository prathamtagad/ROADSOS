import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, signInAnonymously, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";

const firebaseConfig = Constants.expoConfig?.extra?.firebase || {};
const hasFirebaseConfig = Boolean(
  firebaseConfig?.apiKey && firebaseConfig?.projectId && firebaseConfig?.appId
);

if (!hasFirebaseConfig) {
  console.warn("Firebase config missing. Set values in apps/mobile/.env.");
}

const app = hasFirebaseConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

let auth = null;
if (app) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error) {
    auth = getAuth(app);
  }
}

export { auth };
export const firestore = app ? getFirestore(app) : null;
export const functions = app ? getFunctions(app) : null;
export const realtimeDb = app ? getDatabase(app) : null;

export async function ensureAuth() {
  if (!auth) {
    throw new Error("Firebase not configured. Set values in apps/mobile/.env.");
  }

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  return auth.currentUser;
}
