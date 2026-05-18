import { fetchContactsByCategory } from "./contactService";
import { syncBorderGeofences } from "./geofenceService";
import { getAllMeta, setMeta } from "./offlineDb";

const META_PREFIX = "sync";

function contactsMetaKey(country, category) {
  return `${META_PREFIX}:contacts:${country}:${category}`;
}

const GEOFENCE_META_KEY = `${META_PREFIX}:geofences`;

export async function syncContacts({ country, category, limitCount = 50, brand }) {
  const result = await fetchContactsByCategory({ country, category, limitCount, brand });

  if (result.source === "online") {
    await setMeta(contactsMetaKey(country, category), new Date().toISOString());
  }

  return result;
}

export async function syncGeofences() {
  const geofences = await syncBorderGeofences();

  if (geofences?.length) {
    await setMeta(GEOFENCE_META_KEY, new Date().toISOString());
  }

  return geofences;
}

export async function restoreSyncMeta() {
  const rows = await getAllMeta();
  const lastSyncByCategory = {};
  let lastGeofenceSync = null;

  for (const row of rows) {
    if (row.key === GEOFENCE_META_KEY) {
      lastGeofenceSync = row.value;
      continue;
    }

    if (!row.key.startsWith(`${META_PREFIX}:contacts:`)) {
      continue;
    }

    const parts = row.key.split(":");
    const category = parts[3];
    if (!category) {
      continue;
    }

    if (!lastSyncByCategory[category] || row.value > lastSyncByCategory[category]) {
      lastSyncByCategory[category] = row.value;
    }
  }

  return { lastSyncByCategory, lastGeofenceSync };
}
