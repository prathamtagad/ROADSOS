import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  type ConfirmationResult,
  type UserCredential
} from "firebase/auth";

import { auth } from "../firebase";
import { useAuthStore } from "../../store/authStore";

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
