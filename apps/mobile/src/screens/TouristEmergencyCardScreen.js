import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import TopAppBar from "../components/TopAppBar";
import { Colors, Radii, Shadows, Spacing } from "../theme/tokens";
import { useCountryStore } from "../store/countryStore";
import { auth, firestore } from "../lib/firebase";
import { signInWithGoogle } from "../lib/firebase/auth";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const ALLERGY_OPTIONS = ["None", "Penicillin", "NSAIDs", "Latex", "Aspirin"];
const CONDITION_OPTIONS = ["None", "Asthmatic", "Diabetic", "Hypertensive"];
const VEHICLE_TYPES = ["Motorcycle", "Car", "Truck"];

export default function TouristEmergencyCardScreen() {
  const currentCountry = useCountryStore((state) => state.currentCountry());
  const countryName = currentCountry?.name || "BIMSTEC";
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState(["None"]);
  const [conditions, setConditions] = useState(["None"]);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [requiresSignIn, setRequiresSignIn] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const unsubscribeRef = useRef(null);

  const canSave = useMemo(() => {
    return Boolean(
      name &&
        bloodType &&
        emergencyContactName &&
        emergencyContactPhone &&
        vehicleType &&
        vehicleBrand
    );
  }, [
    name,
    bloodType,
    emergencyContactName,
    emergencyContactPhone,
    vehicleType,
    vehicleBrand
  ]);

  const loadProfile = useCallback(async () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setLoading(true);
    setError("");

    const currentUser = auth?.currentUser || null;
    if (!currentUser || !firestore) {
      setError("Sign in required to load your profile.");
      setRequiresSignIn(true);
      setLoading(false);
      return;
    }

    setUserId(currentUser.uid);
    const profileRef = doc(firestore, "users", currentUser.uid);
    unsubscribeRef.current = onSnapshot(profileRef, (snapshot) => {
      const data = snapshot.data() || {};
      setName(typeof data.name === "string" ? data.name : "");
      setBloodType(typeof data.bloodType === "string" ? data.bloodType : "");
      setAllergies(
        Array.isArray(data.allergies) && data.allergies.length ? data.allergies : ["None"]
      );
      setConditions(
        Array.isArray(data.conditions) && data.conditions.length ? data.conditions : ["None"]
      );
      setEmergencyContactName(
        typeof data.emergencyContactName === "string" ? data.emergencyContactName : ""
      );
      setEmergencyContactPhone(
        typeof data.emergencyContactPhone === "string" ? data.emergencyContactPhone : ""
      );
      setVehicleType(typeof data.vehicleType === "string" ? data.vehicleType : "");
      setVehicleBrand(typeof data.vehicleBrand === "string" ? data.vehicleBrand : "");
      setRequiresSignIn(false);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const authUnsub = auth ? onAuthStateChanged(auth, () => void loadProfile()) : null;
    void loadProfile();

    return () => {
      if (authUnsub) {
        authUnsub();
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [loadProfile]);

  const toggleMulti = useCallback((value, current, setValue) => {
    if (value === "None") {
      setValue(current.includes("None") ? [] : ["None"]);
      return;
    }

    const next = current.filter((item) => item !== "None");
    if (next.includes(value)) {
      setValue(next.filter((item) => item !== value));
      return;
    }

    setValue([...next, value]);
  }, []);

  const handleSave = useCallback(async () => {
    if (!userId || !firestore) {
      setError("Sign in required to save your profile.");
      setRequiresSignIn(true);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name,
        bloodType,
        allergies: allergies.length ? allergies : ["None"],
        conditions: conditions.length ? conditions : ["None"],
        emergencyContactName,
        emergencyContactPhone,
        vehicleType,
        vehicleBrand,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(firestore, "users", userId), payload, { merge: true });
      setRequiresSignIn(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }, [
    allergies,
    bloodType,
    conditions,
    emergencyContactName,
    emergencyContactPhone,
    name,
    userId,
    vehicleBrand,
    vehicleType
  ]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setSigningIn(true);
      setError("");
      await signInWithGoogle();
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Google sign-in failed.");
    } finally {
      setSigningIn(false);
    }
  }, []);

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <TopAppBar title={`${countryName} Status: Clear`} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Share details to help responders act faster.</Text>
        </View>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {requiresSignIn ? (
          <Pressable style={styles.signInButton} onPress={handleGoogleSignIn}>
            {signingIn ? (
              <ActivityIndicator color={Colors.onSurface} />
            ) : (
              <Text style={styles.signInText}>Sign in with Google</Text>
            )}
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Blood Type</Text>
          <View style={styles.pillRow}>
            {BLOOD_TYPES.map((type) => {
              const active = bloodType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setBloodType(type)}
                  style={[styles.pill, active && styles.pillActive]}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{type}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Allergies</Text>
          <View style={styles.chipRow}>
            {ALLERGY_OPTIONS.map((option) => {
              const active = allergies.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => toggleMulti(option, allergies, setAllergies)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Conditions</Text>
          <View style={styles.chipRow}>
            {CONDITION_OPTIONS.map((option) => {
              const active = conditions.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => toggleMulti(option, conditions, setConditions)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Emergency Contact Name</Text>
          <TextInput
            value={emergencyContactName}
            onChangeText={setEmergencyContactName}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Emergency Contact Phone</Text>
          <TextInput
            value={emergencyContactPhone}
            onChangeText={setEmergencyContactPhone}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.vehicleRow}>
            {VEHICLE_TYPES.map((type) => {
              const active = vehicleType === type;
              return (
                <Pressable
                  key={type}
                  style={[styles.vehicleCard, active && styles.vehicleCardActive]}
                  onPress={() => setVehicleType(type)}
                >
                  <Text style={[styles.vehicleText, active && styles.vehicleTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Vehicle Brand</Text>
          <TextInput value={vehicleBrand} onChangeText={setVehicleBrand} style={styles.input} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            !canSave && styles.saveDisabled,
            pressed && styles.savePressed
          ]}
          onPress={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? (
            <ActivityIndicator color={Colors.onPrimary} />
          ) : (
            <Text style={styles.saveText}>Save Profile</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surface
  },
  safeTop: {
    backgroundColor: Colors.surface
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.lg
  },
  headerCard: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    ...Shadows.hard
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.onSurface
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: Colors.onSurfaceVariant
  },
  loadingRow: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  loadingText: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "700"
  },
  errorText: {
    marginTop: Spacing.md,
    color: Colors.emergencyRed,
    fontWeight: "700"
  },
  section: {
    marginTop: Spacing.lg,
    gap: Spacing.sm
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.6
  },
  input: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.onSurface,
    fontSize: 16
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm
  },
  pill: {
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceWhite
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  pillText: {
    color: Colors.onSurface,
    fontWeight: "800"
  },
  pillTextActive: {
    color: Colors.onPrimary
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm
  },
  chip: {
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.surfaceWhite
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  chipText: {
    color: Colors.onSurface,
    fontSize: 12,
    fontWeight: "800"
  },
  chipTextActive: {
    color: Colors.onPrimary
  },
  vehicleRow: {
    flexDirection: "row",
    gap: Spacing.sm
  },
  vehicleCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceWhite,
    alignItems: "center"
  },
  vehicleCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  vehicleText: {
    color: Colors.onSurface,
    fontWeight: "800"
  },
  vehicleTextActive: {
    color: Colors.onPrimary
  },
  saveButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.onSurface
  },
  saveDisabled: {
    opacity: 0.6
  },
  savePressed: {
    transform: [{ scale: 0.98 }]
  },
  saveText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: "800"
  },
  signInButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceWhite,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.onSurface
  },
  signInText: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "800"
  }
});
