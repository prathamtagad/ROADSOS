import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import LeafletMapView from "../components/LeafletMapView";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import TopAppBar from "../components/TopAppBar";
import { Colors, Radii, Shadows, Spacing } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";
import { COUNTRY_NAME_MAP } from "../constants/hardcoded";

const DEFAULT_REGION = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08
};

export default function MapScreen() {
  const [locationError, setLocationError] = useState(null);
  const currentCountry = useAppStore((state) => state.currentCountry);
  const lastKnownLocation = useAppStore((state) => state.lastKnownLocation);
  const setLastKnownLocation = useAppStore((state) => state.setLastKnownLocation);
  const countryName = COUNTRY_NAME_MAP[currentCountry] || "BIMSTEC";
  const mapRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function ensureLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setLocationError("permission");
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });

        if (isMounted) {
          setLastKnownLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            altitude: position.coords.altitude || 0
          });
        }
      } catch (error) {
        if (isMounted) {
          setLocationError("unavailable");
        }
      }
    }

    if (!lastKnownLocation) {
      ensureLocation();
    }

    return () => {
      isMounted = false;
    };
  }, [lastKnownLocation, setLastKnownLocation]);

  const region = useMemo(() => {
    if (!lastKnownLocation) {
      return DEFAULT_REGION;
    }

    return {
      latitude: lastKnownLocation.lat,
      longitude: lastKnownLocation.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    };
  }, [lastKnownLocation]);

  useEffect(() => {
    if (!lastKnownLocation) {
      return;
    }

    mapRef.current?.animateToRegion(region, 450);
  }, [lastKnownLocation, region]);

  const handleRecenter = useCallback(() => {
    mapRef.current?.animateToRegion(region, 450);
  }, [region]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <TopAppBar title={`${countryName} Status: Live Map`} />
      </SafeAreaView>
      <View style={styles.mapWrap}>
        <LeafletMapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          region={region}
          markerCoordinate={lastKnownLocation ? {
            latitude: lastKnownLocation.lat,
            longitude: lastKnownLocation.lng
          } : null}
        />
        <View style={styles.mapOverlay}>
          <View style={styles.locationBadge}>
            <MaterialIcons name="location-on" size={18} color={Colors.onPrimary} />
            <Text style={styles.locationText}>
              {lastKnownLocation
                ? `${lastKnownLocation.lat.toFixed(4)}, ${lastKnownLocation.lng.toFixed(4)}`
                : "Waiting for GPS"}
            </Text>
          </View>
          {locationError ? (
            <Text style={styles.locationError}>Location permission required.</Text>
          ) : null}
          <Pressable onPress={handleRecenter} style={styles.recenterButton}>
            <MaterialIcons name="my-location" size={18} color={Colors.onSurface} />
            <Text style={styles.recenterText}>Recenter</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  safeTop: {
    backgroundColor: Colors.surface
  },
  mapWrap: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    overflow: "hidden",
    ...Shadows.hard
  },
  mapOverlay: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    top: Spacing.md,
    gap: Spacing.sm
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignSelf: "flex-start"
  },
  locationText: {
    color: Colors.onPrimary,
    fontWeight: "800",
    fontSize: 12
  },
  locationError: {
    color: Colors.emergencyRed,
    fontWeight: "700",
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.emergencyRed,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.md,
    alignSelf: "flex-start"
  },
  recenterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    alignSelf: "flex-start"
  },
  recenterText: {
    fontWeight: "800",
    fontSize: 12,
    color: Colors.onSurface
  }
});
