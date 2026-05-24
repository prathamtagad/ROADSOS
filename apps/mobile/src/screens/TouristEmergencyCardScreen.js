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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [successMessage, setSuccessMessage] = useState("");
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
  const [isEditing, setIsEditing] = useState(false);
  const unsubscribeRef = useRef(null);

  const loadProfile = useCallback(async () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    const currentUser = auth?.currentUser || null;
    if (!currentUser || !firestore) {
      // Guest mode - load from AsyncStorage
      try {
        const localDataStr = await AsyncStorage.getItem("@roadsos_local_profile");
        if (localDataStr) {
          const data = JSON.parse(localDataStr);
          const hasName = typeof data.name === "string" && data.name.trim().length > 0;
          setName(hasName ? data.name : "");
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
          
          if (!hasName) {
            setIsEditing(true);
          } else {
            setIsEditing(false);
          }
        } else {
          setIsEditing(true);
        }
      } catch (e) {
        console.error("Failed to load local profile", e);
        setIsEditing(true);
      }
      setRequiresSignIn(true);
      setLoading(false);
      return;
    }

    setUserId(currentUser.uid);
    const profileRef = doc(firestore, "users", currentUser.uid);
    unsubscribeRef.current = onSnapshot(profileRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() || {};
        const hasName = typeof data.name === "string" && data.name.trim().length > 0;
        setName(hasName ? data.name : "");
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
        
        if (!hasName) {
          setIsEditing(true);
        } else {
          setIsEditing(false);
        }
      } else {
        // Fallback to local profile if Firestore profile is empty
        try {
          const localDataStr = await AsyncStorage.getItem("@roadsos_local_profile");
          if (localDataStr) {
            const data = JSON.parse(localDataStr);
            const hasName = typeof data.name === "string" && data.name.trim().length > 0;
            setName(hasName ? data.name : "");
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
            
            if (!hasName) {
              setIsEditing(true);
            } else {
              setIsEditing(false);
            }
          } else {
            setIsEditing(true);
          }
        } catch (e) {
          console.error("Failed to load local profile fallback", e);
          setIsEditing(true);
        }
      }
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
    if (!name || !name.trim()) {
      setError("Please enter your name to save your profile.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    const payload = {
      name,
      bloodType,
      allergies: allergies.length ? allergies : ["None"],
      conditions: conditions.length ? conditions : ["None"],
      emergencyContactName,
      emergencyContactPhone,
      vehicleType,
      vehicleBrand,
      updatedAt: new Date().toISOString()
    };

    try {
      // Save locally so guest users can still use it and details are kept
      await AsyncStorage.setItem("@roadsos_local_profile", JSON.stringify(payload));

      const currentUser = auth?.currentUser || null;
      if (currentUser && firestore) {
        // Save to Firestore if signed in
        const profileRef = doc(firestore, "users", currentUser.uid);
        await setDoc(profileRef, {
          ...payload,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false); // Switch back to View mode and refresh page details
      
      // Automatically clear success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
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
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Share details to help responders act faster.</Text>
            </View>
            {name && name.trim().length > 0 ? (
              <Pressable
                style={[styles.editButton, isEditing && styles.editButtonActive]}
                onPress={() => {
                  if (isEditing) {
                    // Cancel editing - reload original data
                    void loadProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                <Text style={[styles.editButtonText, isEditing && styles.editButtonTextActive]}>
                  {isEditing ? "Cancel" : "Edit Details"}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {successMessage ? (
          <View style={styles.successCard}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {requiresSignIn && !isEditing ? (
          <View style={styles.signInContainer}>
            <Text style={styles.signInLabel}>Sign in to sync your profile to the cloud:</Text>
            <Pressable style={styles.signInButton} onPress={handleGoogleSignIn}>
              {signingIn ? (
                <ActivityIndicator color={Colors.onSurface} />
              ) : (
                <Text style={styles.signInText}>Sign in with Google</Text>
              )}
            </Pressable>
          </View>
        ) : null}

        {!isEditing ? (
          // View Mode (Default / Read-only details)
          <View style={styles.viewContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.viewLabel}>Full Name</Text>
              <Text style={styles.viewValue}>{name || "Not specified"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.viewLabel}>Blood Type</Text>
              {bloodType ? (
                <View style={[styles.pill, styles.pillActiveReadOnly]}>
                  <Text style={styles.pillTextActive}>{bloodType}</Text>
                </View>
              ) : (
                <Text style={styles.viewValue}>Not specified</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.viewLabel}>Allergies</Text>
              <View style={styles.chipRow}>
                {allergies.map((option) => (
                  <View key={option} style={[styles.chip, styles.chipActiveReadOnly]}>
                    <Text style={styles.chipTextActive}>{option}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.viewLabel}>Conditions</Text>
              <View style={styles.chipRow}>
                {conditions.map((option) => (
                  <View key={option} style={[styles.chip, styles.chipActiveReadOnly]}>
                    <Text style={styles.chipTextActive}>{option}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.viewLabel}>Emergency Contact</Text>
              <Text style={styles.viewValue}>
                {emergencyContactName || "Not specified"}
                {emergencyContactPhone ? ` (${emergencyContactPhone})` : ""}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.viewLabel}>Vehicle Details</Text>
              <Text style={styles.viewValue}>
                {vehicleType && vehicleBrand
                  ? `${vehicleBrand} (${vehicleType})`
                  : vehicleType || vehicleBrand || "Not specified"}
              </Text>
            </View>
          </View>
        ) : (
          // Edit Mode
          <View>
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
                pressed && styles.savePressed
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Text style={styles.saveText}>Save Profile</Text>
              )}
            </Pressable>
          </View>
        )}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm
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
  editButton: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.hard
  },
  editButtonActive: {
    backgroundColor: Colors.emergencyRed,
    borderColor: Colors.onSurface
  },
  editButtonText: {
    color: Colors.onSurface,
    fontWeight: "800",
    fontSize: 12
  },
  editButtonTextActive: {
    color: Colors.onPrimary
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
  successCard: {
    marginTop: Spacing.lg,
    backgroundColor: "#e6f4ea",
    borderWidth: 2,
    borderColor: Colors.safeGreen,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadows.hard
  },
  successText: {
    color: Colors.safeGreen,
    fontWeight: "800",
    textAlign: "center",
    fontSize: 16
  },
  signInContainer: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    ...Shadows.hard
  },
  signInLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.xs
  },
  viewContainer: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.hard
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainer,
    paddingBottom: Spacing.sm,
    gap: 4
  },
  viewLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  viewValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface
  },
  pillActiveReadOnly: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    alignSelf: "flex-start"
  },
  chipActiveReadOnly: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    alignSelf: "flex-start"
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
  savePressed: {
    transform: [{ scale: 0.98 }]
  },
  saveText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: "800"
  },
  signInButton: {
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
