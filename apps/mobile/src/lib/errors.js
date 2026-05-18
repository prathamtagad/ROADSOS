import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export async function logError(source, error, meta = {}) {
  const errorData = {
    source,
    message: error?.message || "Unknown error",
    name: error?.name || "Error",
    stack: error?.stack || null,
    meta,
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(firestore, "errors"), errorData);
  } catch (logErrorInner) {
    console.warn("Failed to log error", logErrorInner);
  }
}
