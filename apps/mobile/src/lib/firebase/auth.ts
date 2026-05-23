import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  type ConfirmationResult,
  type UserCredential
} from "firebase/auth";

import { auth } from "../firebase";
import { useAuthStore } from "../../store/authStore";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

WebBrowser.maybeCompleteAuthSession();

function getGoogleClientId(): string {
  const clientId = Constants.expoConfig?.extra?.googleWebClientId || null;
  if (!clientId) {
    throw new Error("Google OAuth client ID missing in Expo config.");
  }

  return clientId;
}

function getRedirectUri(): string {
  const configured = Constants.expoConfig?.extra?.googleRedirectUri || "";
  if (configured) {
    return configured;
  }

  return Linking.createURL("auth");
}

function getAccessTokenFromUrl(url: string): string | null {
  const hashIndex = url.indexOf("#");
  if (hashIndex !== -1) {
    const fragment = url.slice(hashIndex + 1);
    const params = new URLSearchParams(fragment);
    const token = params.get("access_token");
    if (token) {
      return token;
    }
  }

  const queryIndex = url.indexOf("?");
  if (queryIndex !== -1) {
    const query = url.slice(queryIndex + 1);
    const params = new URLSearchParams(query);
    const token = params.get("access_token");
    if (token) {
      return token;
    }
  }

  return null;
}

export async function signInWithGoogle(): Promise<UserCredential> {
  if (!auth) {
    throw new Error("Firebase not configured. Set values in apps/mobile/.env.");
  }

  const clientId = getGoogleClientId();
  const redirectUri = getRedirectUri();
  const state = Math.random().toString(36).slice(2);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: "openid profile email",
    prompt: "select_account",
    state
  });

  const result = await WebBrowser.openAuthSessionAsync(
    `${GOOGLE_AUTH_URL}?${params.toString()}`,
    redirectUri
  );

  if (result.type !== "success" || !result.url) {
    throw new Error("Google sign-in cancelled.");
  }

  const accessToken = getAccessTokenFromUrl(result.url);
  if (!accessToken) {
    throw new Error("Google sign-in failed to return an access token.");
  }

  const credential = GoogleAuthProvider.credential(null, accessToken);
  return signInWithCredential(auth, credential);
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error("Firebase not configured. Set values in apps/mobile/.env.");
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error("Firebase not configured. Set values in apps/mobile/.env.");
  }

  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithPhone(phone: string): Promise<ConfirmationResult> {
  if (!auth) {
    throw new Error("Firebase not configured. Set values in apps/mobile/.env.");
  }

  return signInWithPhoneNumber(auth, phone);
}

export async function verifyOTP(
  confirmation: ConfirmationResult,
  otp: string
): Promise<UserCredential> {
  return confirmation.confirm(otp);
}

export async function signOut(): Promise<void> {
  if (!auth) {
    return;
  }

  await firebaseSignOut(auth);
  useAuthStore.getState().clearAuth();
}
