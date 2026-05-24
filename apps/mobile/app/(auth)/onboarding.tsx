import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../../src/lib/firebase/config";
import { useAuthStore } from "../../src/store/authStore";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const ALLERGY_OPTIONS = ["None", "Penicillin", "NSAIDs", "Latex", "Aspirin"];
const CONDITION_OPTIONS = ["None", "Asthmatic", "Diabetic", "Hypertensive"];
const VEHICLE_TYPES = [
  { key: "motorcycle", label: "Motorcycle", icon: "🏍️" },
  { key: "car", label: "Car", icon: "🚗" },
  { key: "truck", label: "Truck", icon: "🚛" }
];

export default function OnboardingScreen() {
  const uid = useAuthStore((state) => state.uid);
  const setOnboarded = useAuthStore((state) => state.setOnboarded);

  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState<string[]>(["None"]);
  const [conditions, setConditions] = useState<string[]>(["None"]);
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = useMemo(() => {
    return Boolean(
      name &&
        bloodType &&
        emergencyContactName &&
        emergencyContactPhone &&
        vehicleType &&
        (!vehicleType || vehicleBrand)
    );
  }, [
    name,
    bloodType,
    emergencyContactName,
    emergencyContactPhone,
    vehicleType,
    vehicleBrand
  ]);

  const toggleMulti = (
    value: string,
    current: string[],
    setValue: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
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
  };

  const handleSave = async () => {
    if (!uid) {
      setError("Sign in required to continue.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        name,
        bloodType,
        allergies,
        conditions,
        emergencyContactName,
        emergencyContactPhone,
        vehicleType,
        vehicleBrand,
        onboardingComplete: true,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, "users", uid), payload);
      setOnboarded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>We use this to help responders act faster.</Text>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Blood Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
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
        </ScrollView>
      </View>

      <View style={styles.fieldBlock}>
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

      <View style={styles.fieldBlock}>
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

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Emergency Contact Name</Text>
        <TextInput value={emergencyContactName} onChangeText={setEmergencyContactName} style={styles.input} />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Emergency Contact Phone</Text>
        <TextInput
          value={emergencyContactPhone}
          onChangeText={setEmergencyContactPhone}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.vehicleRow}>
          {VEHICLE_TYPES.map((vehicle) => {
            const active = vehicleType === vehicle.key;
            return (
              <Pressable
                key={vehicle.key}
                style={[styles.vehicleCard, active && styles.vehicleCardActive]}
                onPress={() => setVehicleType(vehicle.key)}
              >
                <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                <Text style={[styles.vehicleText, active && styles.vehicleTextActive]}>
                  {vehicle.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {vehicleType ? (
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Vehicle Brand</Text>
          <TextInput value={vehicleBrand} onChangeText={setVehicleBrand} style={styles.input} />
        </View>
      ) : null}

        <Pressable
          style={({ pressed }) => [styles.saveButton, pressed && styles.savePressed]}
          onPress={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? (
            <ActivityIndicator color="#0a0a1a" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0a1a"
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    gap: 18
  },
  title: {
    color: "#f3f4ff",
    fontSize: 24,
    fontWeight: "700"
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14
  },
  fieldBlock: {
    gap: 10
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6
  },
  input: {
    backgroundColor: "#1a1a2e",
    borderColor: "#2a2a3e",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f3f4ff",
    fontSize: 16
  },
  pillRow: {
    gap: 10
  },
  pill: {
    backgroundColor: "#1a1a2e",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2a2a3e",
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  pillActive: {
    backgroundColor: "#e94560",
    borderColor: "#e94560"
  },
  pillText: {
    color: "#f3f4ff",
    fontWeight: "700"
  },
  pillTextActive: {
    color: "#0a0a1a"
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2a2a3e",
    backgroundColor: "#1a1a2e"
  },
  chipActive: {
    backgroundColor: "#e94560",
    borderColor: "#e94560"
  },
  chipText: {
    color: "#f3f4ff",
    fontSize: 13,
    fontWeight: "600"
  },
  chipTextActive: {
    color: "#0a0a1a"
  },
  vehicleRow: {
    flexDirection: "row",
    gap: 12
  },
  vehicleCard: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderColor: "#2a2a3e",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8
  },
  vehicleCardActive: {
    borderColor: "#e94560"
  },
  vehicleIcon: {
    fontSize: 22
  },
  vehicleText: {
    color: "#f3f4ff",
    fontWeight: "700"
  },
  vehicleTextActive: {
    color: "#e94560"
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#e94560",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  savePressed: {
    transform: [{ scale: 0.98 }]
  },
  saveText: {
    color: "#0a0a1a",
    fontSize: 16,
    fontWeight: "700"
  },
  errorText: {
    color: "#e94560",
    fontWeight: "600"
  }
});
