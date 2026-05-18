import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { startCountdown } from "../services/incidentService";

export default function EmergencyModeScreen() {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const stop = startCountdown(10, setSecondsLeft, () => {
      setSecondsLeft(0);
    });

    return () => stop();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Triggered</Text>
      <Text style={styles.timer}>{secondsLeft}s</Text>
      <Text style={styles.body}>
        Cancel requires your PIN. If not cancelled, alerts are dispatched.
      </Text>
      <Pressable style={styles.cancelButton} onPress={() => {}}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#111827"
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12
  },
  timer: {
    fontSize: 64,
    fontWeight: "700",
    color: "#f97316",
    marginBottom: 12
  },
  body: {
    color: "#e5e7eb",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: "#ef4444"
  },
  cancelText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600"
  }
});
