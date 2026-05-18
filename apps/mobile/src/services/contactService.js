import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firestore, ensureAuth } from "../lib/firebase";
import { logError } from "../lib/errors";
import { runSql } from "./offlineDb";
import { EMERGENCY_NUMBERS, NATIONAL_TOWING_HOTLINES, ROAD_ASSIST_HOTLINES } from "../constants/hardcoded";

export async function fetchContactsByCategory({ country, category, limitCount = 50, brand }) {
  try {
    await ensureAuth();
    const contactsRef = collection(firestore, "contacts");
    let q = query(
      contactsRef,
      where("country", "==", country),
      where("category", "==", category),
      limit(limitCount)
    );

    if (brand) {
      q = query(
        contactsRef,
        where("country", "==", country),
        where("category", "==", category),
        where("brand", "==", brand),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const contacts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    await cacheContacts(contacts);

    return { source: "online", contacts };
  } catch (error) {
    await logError("fetch_contacts", error, { country, category });
    const contacts = await loadCachedContacts({ country, category, limitCount, brand });
    return { source: "offline", contacts };
  }
}

async function cacheContacts(contacts) {
  const now = new Date().toISOString();

  for (const contact of contacts) {
    await runSql(
      "INSERT OR REPLACE INTO contacts (id, name, phone, category, country, lat, lng, address, rating, brand, lastVerified, isVerified, userCorrectionFlag, cachedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
      [
        contact.id,
        contact.name || "",
        contact.phone || "",
        contact.category || "",
        contact.country || "",
        contact.location?.lat || null,
        contact.location?.lng || null,
        contact.address || "",
        contact.rating || null,
        contact.brand || "",
        contact.lastVerified ? contact.lastVerified.toDate?.().toISOString?.() || null : null,
        contact.isVerified ? 1 : 0,
        contact.userCorrectionFlag ? 1 : 0,
        now
      ]
    );
  }
}

async function loadCachedContacts({ country, category, limitCount, brand }) {
  const params = [country, category];
  let whereSql = "country = ? AND category = ?";

  if (brand) {
    whereSql += " AND brand = ?";
    params.push(brand);
  }

  const result = await runSql(
    `SELECT * FROM contacts WHERE ${whereSql} ORDER BY lastVerified DESC LIMIT ?;`,
    [...params, limitCount]
  );

  return result.rows._array || [];
}

export function getEmergencyNumbers(country) {
  return EMERGENCY_NUMBERS[country] || null;
}

export function getTowingHotline(country) {
  return NATIONAL_TOWING_HOTLINES[country] || null;
}

export function getRoadAssistHotline(country) {
  return ROAD_ASSIST_HOTLINES[country] || null;
}
