import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ROADSOS</Text>
      <Text style={styles.subtitle}>Emergency and road assist</Text>

      <Pressable
        style={[styles.primaryButton, styles.sosButton]}
        onPress={() => navigation.navigate("EmergencyMode")}
      >
        <Text style={styles.primaryButtonText}>SOS</Text>
      </Pressable>

      <Pressable
        style={[styles.primaryButton, styles.breakdownButton]}
        onPress={() => navigation.navigate("RoadAssist")}
      >
        <Text style={styles.primaryButtonText}>Breakdown</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("TouristEmergencyCard")}
      >
        <Text style={styles.secondaryButtonText}>Tourist Emergency Card</Text>
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
    backgroundColor: "#f6f6f8"
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 28
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14
  },
  sosButton: {
    backgroundColor: "#d72638"
  },
  breakdownButton: {
    backgroundColor: "#0f766e"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600"
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db"
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600"
  }
});
