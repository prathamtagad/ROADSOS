import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import EmergencyModeScreen from "../screens/EmergencyModeScreen";
import RoadAssistScreen from "../screens/RoadAssistScreen";
import MapScreen from "../screens/MapScreen";
import TouristEmergencyCardScreen from "../screens/TouristEmergencyCardScreen";
import BottomNav from "../components/BottomNav";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, lazy: false }}
      tabBar={(props) => <BottomNav {...props} />}
      backBehavior="history"
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="RoadAssist" component={RoadAssistScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="TouristEmergencyCard" component={TouristEmergencyCardScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="EmergencyMode" component={EmergencyModeScreen} />
    </Stack.Navigator>
  );
}
