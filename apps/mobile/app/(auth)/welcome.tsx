import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signInWithGoogle } from "../../src/lib/firebase/auth";

export default function WelcomeScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.logo}>ROADSOS</Text>
        <Text style={styles.tagline}>Every second counts. Every border too.</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0a0a1a" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  content: {
    width: "100%",
    alignItems: "center"
  },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    color: "#e94560",
    letterSpacing: 2
  },
  tagline: {
    marginTop: 12,
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginBottom: 48
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    width: "100%"
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: "#0a0a1a",
    fontSize: 16,
    fontWeight: "700"
  },
  errorText: {
    marginTop: 16,
    color: "#e94560",
    textAlign: "center"
  }
});
