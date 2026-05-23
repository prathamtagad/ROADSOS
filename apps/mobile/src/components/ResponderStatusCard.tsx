import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { useResponderNetwork } from "../hooks/useResponderNetwork";

type ResponderStatusCardProps = {
  incidentId: string;
};

export default function ResponderStatusCard({ incidentId }: ResponderStatusCardProps) {
  const { nearestResponder, closestETA } = useResponderNetwork(incidentId);

  if (!closestETA || !nearestResponder) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#e94560" />
        <Text style={styles.loading}>Searching for nearby responders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        ✅ {nearestResponder.name} is coming — {Math.round(closestETA)} min away
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "#f3f4ff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center"
  },
  loading: {
    color: "#9ca3af",
    fontSize: 13,
    textAlign: "center"
  }
});
