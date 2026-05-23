import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { geohashQueryBounds } from "geofire-common";

if (!admin.apps.length) {
  admin.initializeApp();
}

type IncidentData = {
  userId?: string;
  type?: string;
  location?: {
    lat?: number;
    lng?: number;
  };
};

type UserLocation = {
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

type UserData = {
  name?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  geohash?: string;
  fcmToken?: string;
  fcmTokens?: string[];
  location?: UserLocation;
  lastKnownLocation?: UserLocation;
  lastLocation?: UserLocation;
};

type ResponderCandidate = {
  uid: string;
  name: string;
  isVerified: boolean;
  distanceMeters: number;
  tokens: string[];
};

function toNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function resolveLocation(data: UserData): { lat: number; lng: number } | null {
  const location = data.location || data.lastKnownLocation || data.lastLocation;
  if (!location) {
    return null;
  }

  const lat = toNumber(location.lat ?? location.latitude);
  const lng = toNumber(location.lng ?? location.longitude);

  if (lat === null || lng === null) {
    return null;
  }

  return { lat, lng };
}

function getNeighborBounds(lat: number, lng: number, radiusKm: number): Array<[string, string]> {
  return geohashQueryBounds([lat, lng], radiusKm * 1000);
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radiusMeters = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusMeters * c;
}

export const responderDispatch = onDocumentCreated("incidents/{incidentId}", async (event) => {
  const incidentId = event.params.incidentId as string;
  const incidentData = event.data?.data() as IncidentData | undefined;

  if (!incidentData) {
    return;
  }

  const incidentLat = incidentData.location?.lat;
  const incidentLng = incidentData.location?.lng;

  if (typeof incidentLat !== "number" || typeof incidentLng !== "number") {
    return;
  }

  const bounds = getNeighborBounds(incidentLat, incidentLng, 0.5);
  const usersRef = admin.firestore().collection("users");

  const snapshots = await Promise.all(
    bounds.map(([start, end]) =>
      usersRef
        .where("geohash", ">=", start)
        .where("geohash", "<=", end)
        .where("isAvailable", "==", true)
        .get()
    )
  );

  const candidates = new Map<string, ResponderCandidate>();

  for (const snapshot of snapshots) {
    for (const doc of snapshot.docs) {
      if (doc.id === incidentData.userId) {
        continue;
      }

      const data = doc.data() as UserData;
      const location = resolveLocation(data);
      if (!location) {
        continue;
      }

      const distanceMeters = haversineDistance(
        incidentLat,
        incidentLng,
        location.lat,
        location.lng
      );

      if (distanceMeters > 500) {
        continue;
      }

      const tokens = Array.isArray(data.fcmTokens)
        ? data.fcmTokens
        : data.fcmToken
          ? [data.fcmToken]
          : [];

      candidates.set(doc.id, {
        uid: doc.id,
        name: data.name || "Responder",
        isVerified: Boolean(data.isVerified),
        distanceMeters,
        tokens
      });
    }
  }

  const sorted = Array.from(candidates.values()).sort((a, b) => {
    if (a.isVerified !== b.isVerified) {
      return a.isVerified ? -1 : 1;
    }

    return a.distanceMeters - b.distanceMeters;
  });

  const tokens = Array.from(
    new Set(sorted.flatMap((candidate) => candidate.tokens).filter((token) => token))
  );

  const verifiedCount = sorted.filter((candidate) => candidate.isVerified).length;
  const closestDistance = sorted.length ? Math.round(sorted[0].distanceMeters) : 0;
  const incidentType = incidentData.type || "Emergency";

  if (tokens.length) {
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: "🚨 Someone needs help nearby"
      },
      data: {
        type: "RESPONDER_ALERT",
        incidentId,
        incidentLat: incidentLat.toString(),
        incidentLng: incidentLng.toString(),
        incidentType,
        distance: closestDistance.toString()
      }
    });
  }

  await admin
    .firestore()
    .collection("incidents")
    .doc(incidentId)
    .set(
      {
        responderSearch: {
          notifiedCount: tokens.length,
          verifiedCount,
          notifiedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      },
      { merge: true }
    );
});
