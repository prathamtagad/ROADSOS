import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore, ensureAuth } from "../lib/firebase";
import { logError } from "../lib/errors";

export function startCountdown(seconds, onTick, onFinish) {
  let remaining = seconds;
  onTick(remaining);

  const intervalId = setInterval(() => {
    remaining -= 1;
    onTick(Math.max(remaining, 0));

    if (remaining <= 0) {
      clearInterval(intervalId);
      onFinish();
    }
  }, 1000);

  return () => clearInterval(intervalId);
}

export async function createIncident({ userId, type, triggerType, location, country }) {
  try {
    await ensureAuth();
    const payload = {
      userId,
      timestamp: serverTimestamp(),
      type,
      triggerType,
      status: "active",
      location: {
        lat: location?.lat || 0,
        lng: location?.lng || 0,
        altitude: location?.altitude || 0,
        country: country || ""
      },
      alertsSent: {
        family: false,
        hospital: false,
        ambulance: false,
        police: false
      }
    };

    const docRef = await addDoc(collection(firestore, "incidents"), payload);
    return docRef.id;
  } catch (error) {
    await logError("create_incident", error, { type, triggerType });
    throw error;
  }
}
