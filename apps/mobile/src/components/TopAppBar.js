import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Spacing } from "../theme/tokens";

export default function TopAppBar({ title, onNotificationsPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <MaterialIcons name="language" size={22} color={Colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable
        onPress={onNotificationsPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.iconPressed]}
      >
        <MaterialIcons name="notifications" size={22} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary
  },
  iconButton: {
    padding: 6,
    borderRadius: 12
  },
  iconPressed: {
    transform: [{ scale: 0.95 }]
  }
});
