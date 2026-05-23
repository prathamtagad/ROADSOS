import { geohashForLocation, geohashQueryBounds } from "geofire-common";

export const getGeohash = (lat: number, lng: number, precision = 9): string => {
  return geohashForLocation([lat, lng], precision);
};

export const getNeighborBounds = (
  lat: number,
  lng: number,
  radiusKm: number
): Array<[string, string]> => {
  return geohashQueryBounds([lat, lng], radiusKm * 1000);
};

export const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
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
};
