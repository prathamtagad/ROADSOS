import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { initializeOfflineDb } from "./src/services/offlineDb";
import { logError } from "./src/lib/errors";

export default function App() {
  useEffect(() => {
    initializeOfflineDb().catch((error) => {
      logError("offline_db_init", error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
