import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Radii, Spacing } from "../theme/tokens";

const NAV_ITEMS = [
  { key: "sos", label: "SOS", icon: "warning", route: "Home" },
  { key: "assist", label: "Assist", icon: "support-agent", route: "RoadAssist" },
  { key: "map", label: "Map", icon: "map", route: "Map" },
  { key: "profile", label: "Profile", icon: "person", route: "TouristEmergencyCard" }
];

export default function BottomNav({ activeKey }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const active = activeKey === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => navigation.navigate(item.route)}
            style={({ pressed }) => [
              styles.item,
              active && styles.itemActive,
              pressed && styles.itemPressed
            ]}
          >
            <MaterialIcons
              name={item.icon}
              size={22}
              color={active ? Colors.onPrimary : Colors.onSurfaceVariant}
            />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 2,
    borderTopColor: Colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.lg
  },
  itemActive: {
    backgroundColor: Colors.primary
  },
  itemPressed: {
    transform: [{ scale: 0.95 }]
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurfaceVariant,
    marginTop: 4
  },
  labelActive: {
    color: Colors.onPrimary
  }
});
