import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

import TopAppBar from "../components/TopAppBar";
import LeafletMapView from "../components/LeafletMapView";
import { Colors, Radii, Shadows, Spacing } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";
import { useCountryStore } from "../store/countryStore";
import { getEmergencyNumbers, getRoadAssistHotline, getTowingHotline } from "../services/contactService";
import { syncContacts } from "../services/syncService";

const DEFAULT_REGION = {
  latitude: 13.7563,
  longitude: 100.5018,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08
};

const TABS = [
  { key: "towing", label: "Towing", icon: "local-shipping" },
  { key: "tyres", label: "Tyres", icon: "build" },
  { key: "showroom", label: "Showroom", icon: "store" },
  { key: "hotlines", label: "Hotlines", icon: "call" }
];

export default function RoadAssistScreen() {
  const [activeTab, setActiveTab] = useState("towing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("offline");
  const [locationError, setLocationError] = useState(null);
  const navigation = useNavigation();
  const currentCountry = useCountryStore((state) => state.currentCountry());
  const offlineMode = useAppStore((state) => state.offlineMode);
  const contactsByCategory = useAppStore((state) => state.contactsByCategory);
  const lastSyncByCategory = useAppStore((state) => state.lastSyncByCategory);
  const lastKnownLocation = useAppStore((state) => state.lastKnownLocation);
  const setLastKnownLocation = useAppStore((state) => state.setLastKnownLocation);
  const setContacts = useAppStore((state) => state.setContacts);
  const countryName = currentCountry?.name || "BIMSTEC";
  const mapRef = useRef(null);
  const currentCountryCode = currentCountry.code;

  const contacts = activeTab === "hotlines" ? [] : contactsByCategory[activeTab] || [];
  const lastSyncedAt = lastSyncByCategory[activeTab];

  const hotlines = useMemo(() => {
    const emergency = getEmergencyNumbers(currentCountryCode);
    const towing = getTowingHotline(currentCountryCode);
    const assist = getRoadAssistHotline(currentCountryCode);

    return [
      {
        key: "emergency",
        title: "Emergency Numbers",
        detail: emergency
          ? `Ambulance ${emergency.ambulance} · Police ${emergency.police} · Fire ${emergency.fire}`
          : "Not available",
        phone: emergency?.police || emergency?.ambulance || emergency?.fire || null,
        icon: "local-hospital"
      },
      {
        key: "towing",
        title: "National Towing Hotline",
        detail: towing ? `${towing.number} · ${towing.authority}` : "Not available",
        phone: towing?.number || null,
        icon: "local-shipping"
      },
      {
        key: "assist",
        title: "Road Assist Hotline",
        detail: assist ? `${assist.phone} · ${assist.service}` : "Not available",
        phone: assist?.phone || null,
        icon: "support-agent"
      }
    ];
  }, [currentCountryCode]);

  const loadContacts = useCallback(async () => {
    if (activeTab === "hotlines") {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await syncContacts({
        country: currentCountryCode,
        category: activeTab,
        limitCount: 25
      });
      setSource(result.source);
      const nextSyncAt = result.source === "online" ? new Date().toISOString() : lastSyncedAt;
      setContacts(activeTab, result.contacts, nextSyncAt);
    } catch (loadError) {
      setError("Unable to load services.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentCountryCode, lastSyncedAt, setContacts]);

  const handleRefresh = useCallback(() => {
    loadContacts();
  }, [loadContacts]);

  const handleCall = useCallback((phone) => {
    if (!phone) {
      return;
    }

    Linking.openURL(`tel:${phone}`);
  }, []);

  const syncLabel = offlineMode ? "Offline" : source === "online" ? "Live" : "Cached";
  const syncTimeLabel = activeTab === "hotlines" ? "Local" : formatSyncTime(lastSyncedAt);
  const activeLabel = TABS.find((tab) => tab.key === activeTab)?.label || "Services";
  const primaryContact = contacts[0] || null;
  const secondaryContacts = contacts.slice(1, 4);
  const mapRegion = useMemo(() => {
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
    loadContacts();
  }, [loadContacts]);

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
      } catch (err) {
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

  useEffect(() => {
    if (!lastKnownLocation) {
      return;
    }

    mapRef.current?.animateToRegion(mapRegion, 450);
  }, [lastKnownLocation, mapRegion]);

  const handleRecenter = useCallback(() => {
    mapRef.current?.animateToRegion(mapRegion, 450);
  }, [mapRegion]);

  const handleOpenMap = useCallback(() => {
    navigation.navigate("Map");
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <TopAppBar title={`${countryName} Status: Clear`} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow}>
            {TABS.map((tab) => {
              const active = tab.key === activeTab;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={({ pressed }) => [
                    styles.tabButton,
                    active && styles.tabButtonActive,
                    pressed && styles.tabPressed
                  ]}
                >
                  <MaterialIcons
                    name={tab.icon}
                    size={20}
                    color={active ? Colors.onPrimary : Colors.onSurfaceVariant}
                  />
                  <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.syncBanner}>
          <View style={styles.syncLeft}>
            <MaterialIcons name="sync" size={18} color={Colors.infoBlue} />
            <Text style={styles.syncText}>{`Last Synced: ${syncTimeLabel}`}</Text>
          </View>
          <Pressable onPress={handleRefresh}>
            <Text style={styles.syncAction}>{`Refresh · ${syncLabel}`}</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          {activeTab === "hotlines" ? "Emergency Hotlines" : `${activeLabel} Services`}
        </Text>

        {activeTab !== "hotlines" && loading && (
          <Text style={styles.loadingText}>Loading services...</Text>
        )}
        {activeTab !== "hotlines" && !loading && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        {activeTab !== "hotlines" && !loading && !error && !contacts.length && (
          <Text style={styles.emptyText}>No cached services yet. Tap refresh to sync.</Text>
        )}

        {activeTab !== "hotlines" && !loading && !error && primaryContact && (
          <View style={styles.primaryCard}>
            <View style={styles.primaryHeader}>
              <View style={styles.primaryTitleBlock}>
                <Text style={styles.primaryTitle}>{(primaryContact.name || "Road Assist").toUpperCase()}</Text>
                <View style={styles.primaryMeta}>
                  <MaterialIcons name="near-me" size={16} color={Colors.assistanceOrange} />
                  <Text style={styles.primaryDistance}>
                    {primaryContact.address || "Verified provider"}
                  </Text>
                </View>
              </View>
              {primaryContact.isVerified ? (
                <View style={styles.openBadge}>
                  <Text style={styles.openBadgeText}>VERIFIED</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.primaryDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="schedule" size={16} color={Colors.onSurfaceVariant} />
                <Text style={styles.detailText}>
                  {primaryContact.lastVerified || "Hours vary by provider"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="verified" size={16} color={Colors.onSurfaceVariant} />
                <Text style={styles.detailText}>
                  {primaryContact.brand || "BIMSTEC network"}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => handleCall(primaryContact.phone)}
              style={({ pressed }) => [styles.callButton, pressed && styles.callPressed]}
            >
              <MaterialIcons name="call" size={22} color={Colors.onSurface} />
              <Text style={styles.callText}>{primaryContact.phone ? "CALL NOW" : "NO PHONE"}</Text>
            </Pressable>
          </View>
        )}

        {activeTab !== "hotlines" && !loading && !error && secondaryContacts.length > 0 && (
          <View style={styles.secondaryList}>
            {secondaryContacts.map((item) => (
              <Pressable
                key={item.id || item.name}
                onPress={() => handleCall(item.phone)}
                style={styles.secondaryItem}
              >
                <View>
                  <Text style={styles.secondaryTitle}>{item.name || "Road Assist"}</Text>
                  <Text style={styles.secondaryMeta}>
                    {item.address || item.phone || "Verified provider"}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={Colors.primary} />
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === "hotlines" && (
          <View style={styles.secondaryList}>
            {hotlines.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => handleCall(item.phone)}
                style={styles.hotlineCard}
              >
                <View style={styles.hotlineIcon}>
                  <MaterialIcons name={item.icon} size={20} color={Colors.onPrimary} />
                </View>
                <View style={styles.hotlineBody}>
                  <Text style={styles.secondaryTitle}>{item.title}</Text>
                  <Text style={styles.secondaryMeta}>{item.detail}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={Colors.primary} />
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.mapPreview}>
          <LeafletMapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            region={mapRegion}
            markerCoordinate={
              lastKnownLocation
                ? { latitude: lastKnownLocation.lat, longitude: lastKnownLocation.lng }
                : null
            }
          />
          <View style={styles.mapLabel}>
            <Text style={styles.mapLabelText}>
              {locationError ? "LOCATION PERMISSION REQUIRED" : "LIVE TRACKING ACTIVE"}
            </Text>
          </View>
          <View style={styles.mapActions}>
            <Pressable style={styles.mapActionButton} onPress={handleRecenter}>
              <MaterialIcons name="my-location" size={20} color={Colors.onSurface} />
            </Pressable>
            <Pressable style={styles.mapActionButton} onPress={handleOpenMap}>
              <MaterialIcons name="fullscreen" size={20} color={Colors.onSurface} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function formatSyncTime(isoString) {
  if (!isoString) {
    return "Never";
  }

  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
    paddingBottom: Spacing.xxl
  },
  tabBar: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.onSurface,
    paddingVertical: Spacing.sm
  },
  tabRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.onSurface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.lg,
    minWidth: 80
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  tabPressed: {
    transform: [{ scale: 0.95 }]
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    textTransform: "uppercase"
  },
  tabLabelActive: {
    color: Colors.onPrimary
  },
  syncBanner: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    backgroundColor: "rgba(0, 126, 180, 0.1)",
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.infoBlue,
    borderRadius: Radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  syncLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  syncText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.infoBlue
  },
  syncAction: {
    color: Colors.infoBlue,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    fontSize: 22,
    fontWeight: "900",
    textTransform: "uppercase",
    color: Colors.onSurface
  },
  loadingText: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.onSurfaceVariant
  },
  errorText: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.emergencyRed
  },
  emptyText: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.onSurfaceVariant
  },
  primaryCard: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 4,
    borderColor: Colors.onSurface,
    padding: Spacing.md,
    gap: Spacing.md
  },
  primaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md
  },
  primaryTitleBlock: {
    flex: 1
  },
  primaryTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.onSurface
  },
  primaryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4
  },
  primaryDistance: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.onSurfaceVariant
  },
  openBadge: {
    backgroundColor: Colors.safeGreen,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    borderWidth: 2,
    borderColor: Colors.onSurface
  },
  openBadgeText: {
    color: Colors.onPrimary,
    fontWeight: "800"
  },
  primaryDetails: {
    borderTopWidth: 2,
    borderTopColor: Colors.surfaceVariant,
    paddingTop: Spacing.md,
    gap: Spacing.xs
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  detailText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant
  },
  callButton: {
    backgroundColor: Colors.warningYellow,
    borderWidth: 4,
    borderColor: Colors.onSurface,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm
  },
  callPressed: {
    transform: [{ scale: 0.96 }]
  },
  callText: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.onSurface
  },
  secondaryList: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    gap: Spacing.sm
  },
  secondaryItem: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadows.hard
  },
  secondaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.onSurface
  },
  secondaryMeta: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2
  },
  hotlineCard: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    justifyContent: "space-between",
    ...Shadows.hard
  },
  hotlineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  hotlineBody: {
    flex: 1
  },
  mapPreview: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    borderWidth: 4,
    borderColor: Colors.onSurface,
    height: 180,
    overflow: "hidden",
    ...Shadows.hard
  },
  mapLabel: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surfaceWhite,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4
  },
  mapLabelText: {
    color: Colors.onPrimary,
    fontWeight: "800",
    fontSize: 11
  },
  mapActions: {
    position: "absolute",
    right: Spacing.sm,
    bottom: Spacing.sm,
    gap: Spacing.sm
  },
  mapActionButton: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    padding: Spacing.xs
  }
});
