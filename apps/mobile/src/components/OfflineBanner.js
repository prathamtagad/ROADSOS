import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Radii, Spacing } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";

export default function OfflineBanner() {
  const offlineMode = useAppStore((state) => state.offlineMode);
  const lastSyncByCategory = useAppStore((state) => state.lastSyncByCategory);

  if (!offlineMode) {
    return null;
  }

  const lastSync = Object.values(lastSyncByCategory).sort().pop();
  const syncLabel = lastSync ? formatSyncAge(lastSync) : "never synced";

  return (
    <View style={styles.banner}>
      <MaterialIcons name="cloud-off" size={18} color={Colors.onSurface} />
      <Text style={styles.text}>
        {`OFFLINE MODE · Showing saved contacts — last synced ${syncLabel}`}
      </Text>
    </View>
  );
}

function formatSyncAge(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.warningYellow,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Colors.onSurface
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurface,
    letterSpacing: 0.4
  }
});
