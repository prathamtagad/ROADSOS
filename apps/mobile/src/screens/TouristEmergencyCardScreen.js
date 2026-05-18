import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TouristEmergencyCardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tourist Emergency Card</Text>
      <Text style={styles.body}>
        This screen will show bilingual emergency details without unlocking.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8
  },
  body: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center"
  }
});
