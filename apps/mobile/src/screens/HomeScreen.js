import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import LeafletMapView from "../components/LeafletMapView";
import TopAppBar from "../components/TopAppBar";
import { Colors, Radii, Shadows, Spacing } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";
import { useCountryStore } from "../store/countryStore";
import { fetchNearestAmenity } from "../services/nearbyService";

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCD1zNC-miAasZEccCH4z-mhNgC3jIFdcwPi-VXxcOv2vfl5PHy43P8bCCan4Km4DHYqIkA8UqI0b-vuwmyiI_jhD1nVss-N4_vIFNsXaokGsOW_Q6GCP-zdWNmhgCxA1oiJUVrsdVJb7d6cvCSiKR2tDBiZh5pvPOlERfgOP_IPniPq_EA8XAk6ONhgkCzVAfYTT-eqgxqMn0DvtnVdXXSrSWcROksJvXd7Skb7fAahwPclg68ZEHsQrUxXfnj5KrVfJ7hhMOvB_V0";

export default function HomeScreen() {
  const navigation = useNavigation();
  const currentCountry = useCountryStore((state) => state.currentCountry());
  const lastKnownLocation = useAppStore((state) => state.lastKnownLocation);
  const countryName = currentCountry?.name || "BIMSTEC";
  const tapStateRef = useRef({ count: 0, resetTimer: null, navTimer: null });
  const [nearestHospital, setNearestHospital] = useState(null);
  const [nearestPolice, setNearestPolice] = useState(null);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState("");
  const fallbackHospitalName = `${countryName} General Hospital`;
  const fallbackPoliceName = `${countryName} Central Police Station`;

  useEffect(() => {
    if (!lastKnownLocation) {
      return;
    }

    let isActive = true;
    setPlacesLoading(true);
    setPlacesError("");

    Promise.all([
      fetchNearestAmenity({
        latitude: lastKnownLocation.lat,
        longitude: lastKnownLocation.lng,
        amenity: "hospital"
      }),
      fetchNearestAmenity({
        latitude: lastKnownLocation.lat,
        longitude: lastKnownLocation.lng,
        amenity: "police"
      })
    ])
      .then(([hospital, police]) => {
        if (!isActive) {
          return;
        }

        setNearestHospital(hospital);
        setNearestPolice(police);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setPlacesError(error instanceof Error ? error.message : "Unable to load nearby services.");
        setNearestHospital(null);
        setNearestPolice(null);
      })
      .finally(() => {
        if (isActive) {
          setPlacesLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [currentCountry?.code, lastKnownLocation]);

  const hasLocation = Boolean(lastKnownLocation);
  const hospitalLabel = !hasLocation
    ? "Waiting for GPS"
    : nearestHospital
      ? `${nearestHospital.name} (${nearestHospital.distanceKm.toFixed(1)}km)`
      : placesLoading
        ? "Searching nearby hospitals..."
        : placesError
          ? "No hospital found"
          : `${fallbackHospitalName} (default)`;
  const hospitalEta = !hasLocation
    ? "ENABLE LOCATION"
    : nearestHospital
      ? `EST. ${nearestHospital.etaMins} MINS`
      : placesError
        ? "CHECK CONNECTION"
        : "EST. -- MINS";
  const policeLabel = !hasLocation
    ? "Waiting for GPS"
    : nearestPolice
      ? `${nearestPolice.name} (${nearestPolice.distanceKm.toFixed(1)}km)`
      : placesLoading
        ? "Searching nearby stations..."
        : placesError
          ? "No police station found"
          : `${fallbackPoliceName} (default)`;
  const policeMeta = !hasLocation
    ? "ENABLE LOCATION"
    : nearestPolice
      ? "DIRECT LINE READY"
      : placesError
        ? "CHECK CONNECTION"
        : "DEFAULT LISTING";

  const mapRegion = useMemo(() => {
    if (!lastKnownLocation) {
      return {
        latitude: 13.7563,
        longitude: 100.5018,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08
      };
    }

    return {
      latitude: lastKnownLocation.lat,
      longitude: lastKnownLocation.lng,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    };
  }, [lastKnownLocation]);

  const resetTapState = useCallback(() => {
    const tapState = tapStateRef.current;
    if (tapState.resetTimer) {
      clearTimeout(tapState.resetTimer);
    }
    if (tapState.navTimer) {
      clearTimeout(tapState.navTimer);
    }
    tapState.count = 0;
    tapState.resetTimer = null;
    tapState.navTimer = null;
  }, []);

  const handleSosPress = useCallback(() => {
    const tapState = tapStateRef.current;
    tapState.count += 1;

    if (tapState.count === 1) {
      tapState.navTimer = setTimeout(() => {
        navigation.navigate("EmergencyMode");
        resetTapState();
      }, 350);
      tapState.resetTimer = setTimeout(() => {
        resetTapState();
      }, 700);
      return;
    }

    if (tapState.count >= 3) {
      if (tapState.navTimer) {
        clearTimeout(tapState.navTimer);
      }
      resetTapState();
      navigation.navigate("EmergencyMode", { immediate: true });
    }
  }, [navigation, resetTapState]);

  const handleSosLongPress = useCallback(() => {
    resetTapState();
    navigation.navigate("EmergencyMode", { immediate: true });
  }, [navigation, resetTapState]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <TopAppBar title={`${countryName} Status: Clear`} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statusBanner}>
          <View style={styles.statusLeft}>
            <View style={styles.flagBadge}>
              <Text style={styles.flagText}>{currentCountry.code}</Text>
            </View>
            <Text style={styles.statusText}>{`${countryName.toUpperCase()} | BORDER MODE ACTIVE`}</Text>
          </View>
          <MaterialIcons name="gps-fixed" size={22} color={Colors.safeGreen} />
        </View>

        <View style={styles.sosSection}>
          <View style={styles.sosWrapper}>
            <View style={styles.rippleOuter} />
            <View style={styles.rippleInner} />
            <Pressable
              onPress={handleSosPress}
              onLongPress={handleSosLongPress}
              delayLongPress={3000}
              style={({ pressed }) => [styles.sosButton, pressed && styles.sosPressed]}
            >
              <MaterialIcons name="warning" size={56} color={Colors.onPrimary} />
              <Text style={styles.sosText}>SOS</Text>
            </Pressable>
          </View>
          <Text style={styles.sosHint}>HOLD FOR 3S OR TRIPLE TAP</Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate("RoadAssist")}
          style={({ pressed }) => [styles.assistButton, pressed && styles.assistPressed]}
        >
          <MaterialIcons name="build" size={28} color={Colors.onSurface} />
          <Text style={styles.assistText}>ROAD ASSIST</Text>
        </Pressable>

        <View style={styles.quickGrid}>
          <View style={styles.quickCard}>
            <View style={[styles.iconBox, { backgroundColor: Colors.infoBlue }]}>
              <MaterialIcons name="local-hospital" size={20} color={Colors.onPrimary} />
            </View>
            <View style={styles.quickBody}>
              <Text style={styles.quickLabel}>NEAREST HOSPITAL</Text>
              <Text style={styles.quickValue}>{hospitalLabel}</Text>
              <View style={styles.quickMeta}>
                <MaterialIcons name="navigation" size={14} color={Colors.infoBlue} />
                <Text style={styles.quickMetaText}>{hospitalEta}</Text>
              </View>
            </View>
          </View>
          <View style={styles.quickCard}>
            <View style={[styles.iconBox, { backgroundColor: Colors.tertiary }]}>
              <MaterialIcons name="local-police" size={20} color={Colors.onPrimary} />
            </View>
            <View style={styles.quickBody}>
              <Text style={styles.quickLabel}>NEAREST POLICE</Text>
              <Text style={styles.quickValue}>{policeLabel}</Text>
              <View style={styles.quickMeta}>
                <MaterialIcons name="call" size={14} color={Colors.tertiary} />
                <Text style={styles.quickMetaText}>{policeMeta}</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable style={styles.mapPreview} onPress={() => navigation.navigate("Map")}
        >
          {lastKnownLocation ? (
            <LeafletMapView
              style={styles.mapImage}
              region={mapRegion}
              markerCoordinate={{
                latitude: lastKnownLocation.lat,
                longitude: lastKnownLocation.lng
              }}
            />
          ) : (
            <>
              <Image source={{ uri: MAP_IMAGE }} style={styles.mapImage} />
              <View style={styles.mapOverlay} />
              <View style={styles.mapPin}>
                <MaterialIcons name="location-on" size={36} color={Colors.emergencyRed} />
              </View>
            </>
          )}
          <View style={styles.mapHint}>
            <Text style={styles.mapHintText}>Tap for Live Map</Text>
          </View>
        </Pressable>
      </ScrollView>
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
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl
  },
  statusBanner: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.inverseSurface,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadows.hard
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  flagBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm
  },
  flagText: {
    fontWeight: "800",
    color: Colors.onSurface
  },
  statusText: {
    color: Colors.inverseOnSurface,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6
  },
  sosSection: {
    marginTop: Spacing.xxl,
    alignItems: "center"
  },
  sosWrapper: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center"
  },
  rippleOuter: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: Colors.emergencyRed,
    opacity: 0.5
  },
  rippleInner: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: Colors.emergencyRed,
    opacity: 0.2
  },
  sosButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.emergencyRed,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.onSurface,
    ...Shadows.hardLg
  },
  sosPressed: {
    transform: [{ scale: 0.96 }]
  },
  sosText: {
    fontSize: 40,
    fontWeight: "800",
    color: Colors.onPrimary,
    marginTop: 6
  },
  sosHint: {
    marginTop: Spacing.lg,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: Colors.primary
  },
  assistButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.warningYellow,
    paddingVertical: 18,
    borderRadius: Radii.lg,
    borderWidth: 3,
    borderColor: Colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    ...Shadows.hard
  },
  assistPressed: {
    transform: [{ scale: 0.98 }]
  },
  assistText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.onSurface
  },
  quickGrid: {
    marginTop: Spacing.xl,
    gap: Spacing.md
  },
  quickCard: {
    backgroundColor: Colors.surfaceWhite,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    ...Shadows.hard
  },
  iconBox: {
    padding: 10,
    borderRadius: Radii.md
  },
  quickBody: {
    flex: 1
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurfaceVariant
  },
  quickValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.onSurface,
    marginTop: 4
  },
  quickMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8
  },
  quickMetaText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.infoBlue
  },
  mapPreview: {
    marginTop: Spacing.xl,
    height: 180,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    overflow: "hidden",
    ...Shadows.hard
  },
  mapImage: {
    width: "100%",
    height: "100%"
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(183, 0, 17, 0.1)"
  },
  mapPin: {
    position: "absolute",
    top: "45%",
    left: "46%"
  },
  mapHint: {
    position: "absolute",
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4
  },
  mapHintText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.onSurface
  }
});
