import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  Linking
} from "react-native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { firestore } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";

type ResponderAlertProps = {
  visible: boolean;
  distanceMeters: number;
  incidentType: string;
  incidentId: string;
  incidentLat: number;
  incidentLng: number;
  onDismiss: () => void;
};

function estimateEta(distanceMeters: number): number {
  if (!distanceMeters || distanceMeters <= 0) {
    return 0;
  }

  return Math.max(1, Math.round(distanceMeters / 80));
}

export default function ResponderAlert({
  visible,
  distanceMeters,
  incidentType,
  incidentId,
  incidentLat,
  incidentLng,
  onDismiss
}: ResponderAlertProps) {
  const user = useAuthStore((state) => state.user);
  const pulse = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRespondedRef = useRef(false);

  const distanceLabel = useMemo(() => {
    if (!distanceMeters || distanceMeters <= 0) {
      return "nearby";
    }

    if (distanceMeters >= 1000) {
      return `${(distanceMeters / 1000).toFixed(1)}km`;
    }

    return `${Math.round(distanceMeters)}m`;
  }, [distanceMeters]);

  const openMaps = useCallback(() => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${incidentLat},${incidentLng}&travelmode=walking`;
    Linking.openURL(url);
  }, [incidentLat, incidentLng]);

  const writeResponderStatus = useCallback(
    async (status: "en_route" | "declined" | "no_response") => {
      if (!firestore) {
        return;
      }

      const uid = user?.uid || "anonymous";
      const responderRef = doc(firestore, "incidents", incidentId, "responders", uid);
      const payload = {
        uid,
        name: user?.displayName || user?.email || "Responder",
        isVerified: Boolean((user as { isVerified?: boolean } | null)?.isVerified),
        status,
        distanceMeters: Math.max(0, distanceMeters || 0),
        eta: estimateEta(distanceMeters),
        respondedAt: serverTimestamp()
      };

      await setDoc(responderRef, payload, { merge: true });
    },
    [distanceMeters, incidentId, user]
  );

  const handleGoing = useCallback(async () => {
    if (hasRespondedRef.current) {
      return;
    }

    hasRespondedRef.current = true;
    await writeResponderStatus("en_route");
    openMaps();
    onDismiss();
  }, [onDismiss, openMaps, writeResponderStatus]);

  const handleDecline = useCallback(async () => {
    if (hasRespondedRef.current) {
      return;
    }

    hasRespondedRef.current = true;
    await writeResponderStatus("declined");
    onDismiss();
  }, [onDismiss, writeResponderStatus]);

  const handleNoResponse = useCallback(async () => {
    if (hasRespondedRef.current) {
      return;
    }

    hasRespondedRef.current = true;
    await writeResponderStatus("no_response");
    onDismiss();
  }, [onDismiss, writeResponderStatus]);

  useEffect(() => {
    if (!visible) {
      loopRef.current?.stop();
      return;
    }

    pulse.setValue(0);
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true })
      ])
    );
    loopRef.current.start();

    return () => loopRef.current?.stop();
  }, [pulse, visible]);

  useEffect(() => {
    if (!visible) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    hasRespondedRef.current = false;
    timerRef.current = setTimeout(() => {
      void handleNoResponse();
    }, 45000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleNoResponse, visible]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.1]
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Animated.View style={[styles.pulse, { transform: [{ scale }] }]} />
          <Text style={styles.title}>Someone needs help {distanceLabel} away</Text>
          <Text style={styles.subtitle}>{incidentType}</Text>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={handleGoing}>
              <Text style={styles.primaryText}>I'm Going</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={handleDecline}>
              <Text style={styles.secondaryText}>Can't Help</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  card: {
    width: "100%",
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 16
  },
  pulse: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e94560",
    opacity: 0.85
  },
  title: {
    color: "#f3f4ff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center"
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  actions: {
    width: "100%",
    gap: 12
  },
  primaryButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  primaryText: {
    color: "#0a0a1a",
    fontSize: 16,
    fontWeight: "700"
  },
  secondaryButton: {
    backgroundColor: "#2a2a3e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  secondaryText: {
    color: "#f3f4ff",
    fontSize: 16,
    fontWeight: "700"
  }
});
