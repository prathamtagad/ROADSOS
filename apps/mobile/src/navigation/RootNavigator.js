import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import EmergencyModeScreen from "../screens/EmergencyModeScreen";
import RoadAssistScreen from "../screens/RoadAssistScreen";
import MapScreen from "../screens/MapScreen";
import TouristEmergencyCardScreen from "../screens/TouristEmergencyCardScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EmergencyMode" component={EmergencyModeScreen} />
      <Stack.Screen name="RoadAssist" component={RoadAssistScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="TouristEmergencyCard" component={TouristEmergencyCardScreen} />
    </Stack.Navigator>
  );
}
