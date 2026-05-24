import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  type User
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "./config";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_SCOPES = ["openid", "profile", "email"];

function getGoogleClientId(): string {
  const clientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? process.env.GOOGLE_WEB_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_WEB_CLIENT_ID is missing.");
  }

  return clientId;
}

function getRedirectUri(): string {
  return AuthSession.makeRedirectUri({ scheme: "roadsos" });
}

async function requestGoogleIdToken(): Promise<string> {
  const clientId = getGoogleClientId();
  const redirectUri = getRedirectUri();
  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    scopes: GOOGLE_SCOPES,
    responseType: AuthSession.ResponseType.IdToken,
    usePKCE: false,
    extraParams: {
      nonce: Math.random().toString(36).slice(2)
    }
  });

  const result = await request.promptAsync(Google.discovery);

  if (result.type !== "success") {
    throw new Error("Google sign-in cancelled.");
  }

  const idToken = result.params?.id_token;
  if (typeof idToken !== "string" || !idToken) {
    throw new Error("Google sign-in failed to return an ID token.");
  }

  return idToken;
}

async function ensureUserDocument(user: User): Promise<boolean> {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      onboardingComplete: false
    });
    return false;
  }

  const data = snapshot.data();
  return Boolean(data?.onboardingComplete);
}

export async function signInWithGoogle(): Promise<{
  uid: string;
  onboardingComplete: boolean;
}> {
  const idToken = await requestGoogleIdToken();
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  const onboardingComplete = await ensureUserDocument(result.user);

  return { uid: result.user.uid, onboardingComplete };
}

export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuth(cb: (uid: string | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    cb(user ? user.uid : null);
  });
}
