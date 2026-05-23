import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";

import { firestore } from "../lib/firebase";

type ResponderStatus = "en_route" | "declined" | "no_response" | "unknown";

export type Responder = {
  uid: string;
  name: string;
  isVerified: boolean;
  distanceMeters: number;
  eta: number;
  status: ResponderStatus;
};

type ResponderDoc = {
  name?: string;
  isVerified?: boolean;
  distanceMeters?: number;
  distance?: number;
  eta?: number;
  status?: ResponderStatus;
};

function estimateEta(distanceMeters: number): number {
  if (!distanceMeters || distanceMeters <= 0) {
    return 0;
  }

  return Math.max(1, Math.round(distanceMeters / 80));
}

export function useResponderNetwork(incidentId: string) {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [nearestResponder, setNearestResponder] = useState<Responder | null>(null);
  const [closestETA, setClosestETA] = useState<number | null>(null);

  useEffect(() => {
    if (!firestore || !incidentId) {
      setResponders([]);
      setNearestResponder(null);
      setClosestETA(null);
      return;
    }

    const respondersRef = collection(firestore, "incidents", incidentId, "responders");
    const responderQuery = query(respondersRef);

    const unsubscribe = onSnapshot(responderQuery, (snapshot) => {
      const nextResponders = snapshot.docs.map((doc) => {
        const data = doc.data() as ResponderDoc;
        const distanceMeters =
          typeof data.distanceMeters === "number"
            ? data.distanceMeters
            : typeof data.distance === "number"
              ? data.distance
              : 0;
        const eta = typeof data.eta === "number" ? data.eta : estimateEta(distanceMeters);

        return {
          uid: doc.id,
          name: data.name || "Responder",
          isVerified: Boolean(data.isVerified),
          distanceMeters,
          eta,
          status: data.status || "unknown"
        };
      });

      const sorted = [...nextResponders].sort((a, b) => {
        if (a.eta && b.eta && a.eta !== b.eta) {
          return a.eta - b.eta;
        }

        if (a.distanceMeters !== b.distanceMeters) {
          return a.distanceMeters - b.distanceMeters;
        }

        return a.isVerified === b.isVerified ? 0 : a.isVerified ? -1 : 1;
      });

      const nearest = sorted[0] || null;
      setResponders(nextResponders);
      setNearestResponder(nearest);
      setClosestETA(nearest && nearest.eta > 0 ? nearest.eta : null);
    });

    return () => unsubscribe();
  }, [incidentId]);

  const state = useMemo(
    () => ({ responders, nearestResponder, closestETA }),
    [closestETA, nearestResponder, responders]
  );

  return state;
}
