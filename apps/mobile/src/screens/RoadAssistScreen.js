import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RoadAssistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Road Assist Mode</Text>
      <Text style={styles.body}>Towing, tyres, showrooms, and hotlines.</Text>
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
