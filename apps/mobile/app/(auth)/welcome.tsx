import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput
} from "react-native";
import { useRouter } from "expo-router";

import { signInWithEmail, signUpWithEmail } from "../../src/lib/firebase/auth";

export default function WelcomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<"signIn" | "signUp" | null>(null);
  const [error, setError] = useState("");

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password required.");
      return;
    }

    setLoadingAction("signIn");
    setError("");

    try {
      await signInWithEmail(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password required.");
      return;
    }

    setLoadingAction("signUp");
    setError("");

    try {
      await signUpWithEmail(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.logo}>ROADSOS</Text>
        <Text style={styles.tagline}>Every second counts. Every border too.</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleEmailSignIn}
            disabled={loadingAction !== null}
          >
            {loadingAction === "signIn" ? (
              <ActivityIndicator color="#0a0a1a" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonPressed]}
            onPress={handleEmailSignUp}
            disabled={loadingAction !== null}
          >
            {loadingAction === "signUp" ? (
              <ActivityIndicator color="#e94560" />
            ) : (
              <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Create Account</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonSecondary, pressed && styles.buttonPressed]}
            onPress={() => router.push("/(auth)/phone")}
            disabled={loadingAction !== null}
          >
            <Text style={[styles.buttonText, styles.buttonSecondaryText]}>Continue with Phone</Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
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
    fontSize: 36,
    fontWeight: "800",
    color: "#e94560",
    letterSpacing: 2
  },
  tagline: {
    marginTop: 12,
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center"
  },
  actions: {
    marginTop: 28,
    width: "100%",
    gap: 12
  },
  form: {
    marginTop: 28,
    width: "100%",
    gap: 16
  },
  field: {
    gap: 8
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  input: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#2a2a3e",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f3f4ff",
    fontSize: 16
  },
  button: {
    backgroundColor: "#e94560",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonSecondary: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#2a2a3e"
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: "#0a0a1a",
    fontSize: 16,
    fontWeight: "700"
  },
  buttonSecondaryText: {
    color: "#f3f4ff"
  },
  errorText: {
    marginTop: 16,
    color: "#f87171",
    textAlign: "center"
  }
});
