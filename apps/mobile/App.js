import React, { useCallback, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";
import RootNavigator from "./src/navigation/RootNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import OfflineBanner from "./src/components/OfflineBanner";
import { initializeOfflineDb } from "./src/services/offlineDb";
import { logError } from "./src/lib/errors";
import { listenToNetworkStatus } from "./src/services/networkService";
import { syncContacts, syncGeofences, restoreSyncMeta } from "./src/services/syncService";
import { detectCountryCrossing } from "./src/services/geofenceService";
import { useAppStore } from "./src/store/useAppStore";
import { useCountryStore } from "./src/store/countryStore";

export default function App() {
  const setOfflineMode = useAppStore((state) => state.setOfflineMode);
  const setBorderGeofences = useAppStore((state) => state.setBorderGeofences);
  const setLastGeofenceSync = useAppStore((state) => state.setLastGeofenceSync);
  const setContacts = useAppStore((state) => state.setContacts);
  const setBorderStatus = useAppStore((state) => state.setBorderStatus);
  const setLastKnownLocation = useAppStore((state) => state.setLastKnownLocation);
  const setLastSyncByCategory = useAppStore((state) => state.setLastSyncByCategory);
  const offlineMode = useAppStore((state) => state.offlineMode);
  const borderGeofences = useAppStore((state) => state.borderGeofences);
  const currentCountryCode = useCountryStore((state) => state.currentCountryCode);
  const isManualOverride = useCountryStore((state) => state.isManualOverride);
  const locationWatchRef = useRef(null);

  const syncGeofencesNow = useCallback(async () => {
    try {
      const geofences = await syncGeofences();
      setBorderGeofences(geofences);
      setLastGeofenceSync(new Date().toISOString());
    } catch (error) {
      logError("geofence_sync", error);
    }
  }, [setBorderGeofences, setLastGeofenceSync]);

  const syncContactsNow = useCallback(
    async (country) => {
      const categories = ["towing", "tyres", "showroom"];

      for (const category of categories) {
        try {
          const result = await syncContacts({ country, category, limitCount: 25 });
          const lastSyncedAt = result.source === "online" ? new Date().toISOString() : null;
          setContacts(category, result.contacts, lastSyncedAt);
        } catch (error) {
          logError("contacts_sync", error, { country, category });
        }
      }
    },
    [setContacts]
  );

  useEffect(() => {
    initializeOfflineDb()
      .then(async () => {
        const meta = await restoreSyncMeta();
        setLastSyncByCategory(meta.lastSyncByCategory);
        if (meta.lastGeofenceSync) {
          setLastGeofenceSync(meta.lastGeofenceSync);
        }
      })
      .catch((error) => {
        logError("offline_db_init", error);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = listenToNetworkStatus((isOnline) => {
      setOfflineMode(!isOnline);
      if (isOnline) {
        syncGeofencesNow();
        syncContactsNow(currentCountryCode);
      }
    });

    return () => unsubscribe();
  }, [currentCountryCode, setOfflineMode, syncContactsNow, syncGeofencesNow]);

  useEffect(() => {
    syncGeofencesNow();
  }, [syncGeofencesNow]);

  useEffect(() => {
    if (!offlineMode) {
      syncContactsNow(currentCountryCode);
    }
  }, [currentCountryCode, offlineMode, syncContactsNow]);

  useEffect(() => {
    let isActive = true;

    async function startLocationWatch() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const initialPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });

        setLastKnownLocation({
          lat: initialPosition.coords.latitude,
          lng: initialPosition.coords.longitude,
          altitude: initialPosition.coords.altitude || 0
        });

        locationWatchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 15000,
            distanceInterval: 25
          },
          (position) => {
            if (!isActive) {
              return;
            }

            const nextLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              altitude: position.coords.altitude || 0
            };

            setLastKnownLocation(nextLocation);

            if (!borderGeofences.length) {
              return;
            }

            const result = detectCountryCrossing({
              location: nextLocation,
              currentCountry: currentCountryCode,
              geofences: borderGeofences
            });

            setBorderStatus(result);

            if (
              !isManualOverride &&
              result.inBuffer &&
              result.nextCountry &&
              result.nextCountry !== currentCountryCode
            ) {
              useCountryStore.setState({ currentCountryCode: result.nextCountry });
            }
          }
        );
      } catch (error) {
        logError("location_watch", error);
      }
    }

    startLocationWatch();

    return () => {
      isActive = false;
      locationWatchRef.current?.remove();
      locationWatchRef.current = null;
    };
  }, [borderGeofences, currentCountryCode, isManualOverride, setBorderStatus, setLastKnownLocation]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <OfflineBanner />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
