import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase";

export async function logError(source, error, meta = {}) {
  if (!firestore) {
    console.warn("Firebase not configured. Error not logged.");
    return;
  }

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
    const message = logErrorInner?.message || "";
    const code = logErrorInner?.code || "";
    const isPermissionDenied =
      code === "permission-denied" ||
      message.includes("Missing or insufficient permissions");

    if (!isPermissionDenied) {
      console.warn("Failed to log error", logErrorInner);
    }
  }
}
