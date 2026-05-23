import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Slot, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../src/lib/firebase";
import { useAuthStore } from "../src/store/authStore";

export default function RootLayout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isOnboarded = useAuthStore((state) => state.isOnboarded);
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      router.replace("/(auth)/welcome");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, setUser]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/(auth)/welcome");
      return;
    }

    if (!isOnboarded) {
      router.replace("/(auth)/onboarding");
    }
  }, [isOnboarded, loading, router, user]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#e94560" size="large" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    alignItems: "center",
    justifyContent: "center"
  }
});
