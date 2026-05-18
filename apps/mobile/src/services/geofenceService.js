import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import buffer from "@turf/buffer";
import { point, polygon } from "@turf/helpers";
import { collection, getDocs } from "firebase/firestore";
import { firestore, ensureAuth } from "../lib/firebase";
import { logError } from "../lib/errors";
import { runSql } from "./offlineDb";

const BUFFER_KM = 5;

export async function syncBorderGeofences() {
  try {
    await ensureAuth();
    const snapshot = await getDocs(collection(firestore, "borderGeofences"));
    const geofences = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    await cacheGeofences(geofences);
    return geofences;
  } catch (error) {
    await logError("sync_geofences", error);
    return loadCachedGeofences();
  }
}

async function cacheGeofences(geofences) {
  const now = new Date().toISOString();

  for (const geofence of geofences) {
    await runSql(
      "INSERT OR REPLACE INTO geofences (id, fromCountry, toCountry, geojson, cachedAt) VALUES (?, ?, ?, ?, ?);",
      [
        geofence.id,
        geofence.fromCountry || "",
        geofence.toCountry || "",
        JSON.stringify(geofence.geojson || []),
        now
      ]
    );
  }
}

export async function loadCachedGeofences() {
  const result = await runSql("SELECT * FROM geofences;");
  return (result.rows._array || []).map((row) => ({
    id: row.id,
    fromCountry: row.fromCountry,
    toCountry: row.toCountry,
    geojson: JSON.parse(row.geojson || "[]")
  }));
}

export function detectCountryCrossing({ location, currentCountry, geofences }) {
  const userPoint = point([location.lng, location.lat]);

  for (const fence of geofences) {
    if (fence.fromCountry !== currentCountry && fence.toCountry !== currentCountry) {
      continue;
    }

    const geoPolygon = polygon(fence.geojson);
    const buffered = buffer(geoPolygon, BUFFER_KM, { units: "kilometers" });
    const insideBuffered = booleanPointInPolygon(userPoint, buffered);

    if (insideBuffered) {
      const nextCountry = fence.fromCountry === currentCountry ? fence.toCountry : fence.fromCountry;
      return { nextCountry, inBuffer: true };
    }
  }

  return { nextCountry: currentCountry, inBuffer: false };
}
