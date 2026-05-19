import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import TopAppBar from "../components/TopAppBar";
import { Colors, Radii, Shadows, Spacing } from "../theme/tokens";
import { createIncident, startCountdown } from "../services/incidentService";
import { useAppStore } from "../store/useAppStore";
import { COUNTRY_NAME_MAP } from "../constants/hardcoded";


const BACKGROUND_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDHV8omdt2BK1qpZvB_oC15gA7GI-LiI0S4L87wJzmpAHAp3vB6chM3CsEs-M87D9JIHt1vTcgyR6DE_cwqvdLLFsaxHQ-STa9RFWcS0dw0PUqU32ZiW4ldSNcFRzLtF9Bs4sSNYR80wD6Dt_ZoCqyLgFhCIx8J1eObqbH0M0xfvyR48lgJTSTi48og41ZsiXEOxhwwDl8wwmgFg2yc8ZcuW87F007IipIc6QgdfsgFSsSpb_r59D3z0SPDHzGvnpk0vJyhv86eBdU5";

export default function EmergencyModeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const immediate = route.params?.immediate === true;
  const [secondsLeft, setSecondsLeft] = useState(immediate ? 0 : 10);
  const [dispatchState, setDispatchState] = useState(immediate ? "sending" : "pending");
  const [locationError, setLocationError] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const pulse = useRef(new Animated.Value(0)).current;
  const dispatchRef = useRef(false);
  const locationRef = useRef(null);
  const countdownStopRef = useRef(null);
  const currentCountry = useAppStore((state) => state.currentCountry);
  const countryName = COUNTRY_NAME_MAP[currentCountry] || "BIMSTEC";

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
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
          locationRef.current = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            altitude: position.coords.altitude || 0
          };
        }
      } catch (error) {
        if (isMounted) {
          setLocationError("unavailable");
        }
      }
    }

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const dispatchSos = useCallback(async (triggerType) => {
    if (dispatchRef.current) {
      return;
    }

    dispatchRef.current = true;
    setDispatchState("sending");

    try {
      await createIncident({
        userId: null,
        type: "emergency",
        triggerType,
        location: locationRef.current,
        country: currentCountry
      });
      setDispatchState("sent");
    } catch (error) {
      setDispatchState("error");
    }
  }, [currentCountry]);

  useEffect(() => {
    if (immediate) {
      dispatchSos("immediate");
      return;
    }

    const stop = startCountdown(10, setSecondsLeft, () => {
      setSecondsLeft(0);
      dispatchSos("countdown");
    });

    countdownStopRef.current = stop;

    return () => stop();
  }, [immediate, dispatchSos]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, useNativeDriver: false })
      ])
    ).start();
  }, [pulse]);

  const backgroundColor = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(183, 0, 17, 0.9)", "rgba(220, 38, 38, 1)"]
  });

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <TopAppBar title={`${countryName} Status: Clear`} />
      </SafeAreaView>
      <Animated.View style={[styles.canvas, { backgroundColor }]}>
        <Image source={{ uri: BACKGROUND_IMAGE }} style={styles.backgroundImage} />
        <View style={styles.content}>
          <View style={styles.countdownRing}>
            <Text style={styles.countdownValue}>{secondsLeft}</Text>
            <Text style={styles.countdownLabel}>SECONDS UNTIL DISPATCH</Text>
          </View>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={18} color={Colors.onPrimary} />
              <Text style={styles.locationTitle}>
                {locationError ? "Location unavailable" : "Location sharing active"}
              </Text>
            </View>
            <Text style={styles.locationSub}>Shared with Family and Emergency Services</Text>
          </View>
          <Text style={styles.dispatchStatus}>
            {dispatchState === "pending" && "Awaiting dispatch..."}
            {dispatchState === "sending" && "Dispatching SOS..."}
            {dispatchState === "sent" && "Dispatch sent to responders."}
            {dispatchState === "error" && "Dispatch failed. Check connection."}
          </Text>
          <Pressable
            onPress={() => {
              if (countdownStopRef.current) {
                countdownStopRef.current();
              }
              setCancelled(true);
              setDispatchState("cancelled");
              navigation.goBack();
            }}
            style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelPressed]}
          >
            <Text style={styles.cancelTitle}>CANCEL</Text>
            <Text style={styles.cancelCaption}>TAP TO ABORT</Text>
          </Pressable>
        </View>
        <View style={styles.aiBanner}>
          <MaterialIcons name="medical-services" size={24} color={Colors.onSurface} />
          <View style={styles.aiTextBlock}>
            <Text style={styles.aiLabel}>AI FIRST AID INSIGHT</Text>
            <Text style={styles.aiValue}>Maintain open airway. Check for pulse.</Text>
          </View>
        </View>
      </Animated.View>
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
  canvas: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    justifyContent: "center"
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2
  },
  content: {
    alignItems: "center",
    gap: Spacing.lg
  },
  countdownRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    borderColor: Colors.surfaceWhite,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  countdownValue: {
    fontSize: 100,
    fontWeight: "800",
    color: Colors.onPrimary,
    lineHeight: 110
  },
  countdownLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onPrimary,
    marginTop: 8,
    letterSpacing: 1
  },
  locationCard: {
    borderWidth: 2,
    borderColor: Colors.surfaceWhite,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    width: "100%",
    maxWidth: 360
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: 4
  },
  locationTitle: {
    color: Colors.onPrimary,
    fontWeight: "700",
    fontSize: 16
  },
  locationSub: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13
  },
  dispatchStatus: {
    color: Colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  cancelButton: {
    width: "100%",
    maxWidth: 360,
    height: 120,
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 4,
    borderColor: Colors.onSurface,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radii.lg,
    ...Shadows.hardLg
  },
  cancelPressed: {
    transform: [{ scale: 0.96 }]
  },
  cancelTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.onSurface
  },
  cancelCaption: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    letterSpacing: 0.6
  },
  aiBanner: {
    position: "absolute",
    bottom: 88,
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.warningYellow,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    alignItems: "flex-start",
    ...Shadows.hard
  },
  aiTextBlock: {
    flex: 1
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurface
  },
  aiValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
    marginTop: 4
  }
});
