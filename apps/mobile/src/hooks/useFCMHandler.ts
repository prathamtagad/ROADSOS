import { useCallback, useEffect, useMemo, useState } from "react";
import * as Notifications from "expo-notifications";
import { ref, set } from "firebase/database";

import { realtimeDb } from "../lib/firebase";

type ResponderAlertPayload = {
  incidentId: string;
  incidentLat: number;
  incidentLng: number;
  incidentType: string;
  distanceMeters: number;
};

type AlertState = {
  visible: boolean;
  payload: ResponderAlertPayload | null;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return value.toString();
  }

  return "";
}

export function useFCMHandler() {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    payload: null
  });

  const dismissAlert = useCallback(() => {
    setAlertState({ visible: false, payload: null });
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data || {};
      const type = toString(data.type);

      if (type === "RESPONDER_ALERT") {
        const incidentId = toString(data.incidentId);
        const incidentLat = toNumber(data.incidentLat) ?? 0;
        const incidentLng = toNumber(data.incidentLng) ?? 0;
        const incidentType = toString(data.incidentType) || "Emergency";
        const distanceMeters = toNumber(data.distance) ?? 0;

        if (incidentId) {
          setAlertState({
            visible: true,
            payload: {
              incidentId,
              incidentLat,
              incidentLng,
              incidentType,
              distanceMeters
            }
          });
        }
      }

      if (type === "AMBULANCE_UPDATE") {
        const incidentId = toString(data.incidentId);
        const eta = toNumber(data.ambulanceETA ?? data.eta ?? data.minutes);

        if (incidentId && realtimeDb && typeof eta === "number") {
          void set(ref(realtimeDb, `incidents/${incidentId}/liveTracking/ambulanceETA`), eta);
        }
      }
    });

    return () => subscription.remove();
  }, []);

  const result = useMemo(
    () => ({
      alertVisible: alertState.visible,
      alertPayload: alertState.payload,
      dismissAlert
    }),
    [alertState.payload, alertState.visible, dismissAlert]
  );

  return result;
}
