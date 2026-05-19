import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Radii, Spacing } from "../theme/tokens";

const NAV_ITEMS = [
  { key: "sos", label: "SOS", icon: "warning", route: "Home" },
  { key: "assist", label: "Assist", icon: "support-agent", route: "RoadAssist" },
  { key: "map", label: "Map", icon: "map", route: "Map" },
  { key: "profile", label: "Profile", icon: "person", route: "TouristEmergencyCard" }
];

export default function BottomNav({ state, navigation }) {
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        {NAV_ITEMS.map((item) => {
          const active = activeRouteName === item.route;
          const route = state.routes.find((navRoute) => navRoute.name === item.route);
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route?.key,
                  canPreventDefault: true
                });

                if (!active && !event.defaultPrevented) {
                  navigation.navigate(item.route);
                }
              }}
              onLongPress={() =>
                navigation.emit({
                  type: "tabLongPress",
                  target: route?.key
                })
              }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.surface
  },
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
