const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function buildOverpassQuery({ latitude, longitude, radiusMeters, amenity }) {
  return `[
    out:json
  ];
  (
    node[amenity=${amenity}](around:${radiusMeters},${latitude},${longitude});
    way[amenity=${amenity}](around:${radiusMeters},${latitude},${longitude});
    relation[amenity=${amenity}](around:${radiusMeters},${latitude},${longitude});
  );
  out center 20;`;
}

export async function fetchNearestAmenity({ latitude, longitude, amenity }) {
  const query = buildOverpassQuery({
    latitude,
    longitude,
    radiusMeters: 6000,
    amenity
  });

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: query
  });

  if (!response.ok) {
    throw new Error("Unable to fetch nearby services.");
  }

  const data = await response.json();
  const elements = Array.isArray(data.elements) ? data.elements : [];
  if (!elements.length) {
    return null;
  }

  let best = null;
  for (const element of elements) {
    const lat = typeof element.lat === "number" ? element.lat : element.center?.lat;
    const lng = typeof element.lon === "number" ? element.lon : element.center?.lon;
    if (typeof lat !== "number" || typeof lng !== "number") {
      continue;
    }

    const distanceKm = haversineDistanceKm(latitude, longitude, lat, lng);
    if (!best || distanceKm < best.distanceKm) {
      best = {
        name: element.tags?.name || "Unnamed",
        distanceKm,
        etaMins: Math.max(2, Math.round(distanceKm * 3))
      };
    }
  }

  return best;
}
