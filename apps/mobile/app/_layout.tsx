import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Slot, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../src/lib/firebase/config";
import { subscribeToAuth } from "../src/lib/firebase/auth";
import { useAuthStore } from "../src/store/authStore";

export default function RootLayout() {
  const router = useRouter();
  const isLoading = useAuthStore((state) => state.isLoading);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);

  useEffect(() => {
    let isActive = true;
    setLoading(true);

    const unsubscribe = subscribeToAuth(async (uid) => {
      if (!isActive) {
        return;
      }

      if (!uid) {
        setUser(null);
        setOnboarded(false);
        setLoading(false);
        router.replace("/(auth)/welcome");
        return;
      }

      const currentUser = auth.currentUser;
      setUser({
        uid,
        displayName: currentUser?.displayName ?? null,
        email: currentUser?.email ?? null
      });

      try {
        const userRef = doc(db, "users", uid);
        const snapshot = await getDoc(userRef);
        const onboardingComplete = Boolean(snapshot.data()?.onboardingComplete);
        setOnboarded(onboardingComplete);
        router.replace(onboardingComplete ? "/(tabs)" : "/(auth)/onboarding");
      } catch (error) {
        setOnboarded(false);
        router.replace("/(auth)/welcome");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [router, setLoading, setOnboarded, setUser]);

  if (isLoading) {
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
