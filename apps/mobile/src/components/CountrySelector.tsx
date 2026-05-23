import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { BIMSTEC_COUNTRIES } from "../constants/countries";
import { useCountryStore } from "../store/countryStore";

export default function CountrySelector() {
  const [visible, setVisible] = useState(false);
  const currentCountry = useCountryStore((state) => state.currentCountry());
  const currentCountryCode = useCountryStore(
    (state) => state.currentCountryCode
  );
  const isManualOverride = useCountryStore((state) => state.isManualOverride);
  const setCountry = useCountryStore((state) => state.setCountry);
  const resetToAuto = useCountryStore((state) => state.resetToAuto);

  const handleSelect = (code: string) => {
    setTimeout(() => {
      setCountry(code);
      setVisible(false);
    }, 150);
  };

  return (
    <>
      <Pressable style={styles.pill} onPress={() => setVisible(true)}>
        <View style={styles.pillLeft}>
          <Text style={styles.flag}>{currentCountry.flag}</Text>
          <Text style={styles.pillText}>{currentCountry.name}</Text>
        </View>
        <View style={styles.pillRight}>
          {!isManualOverride && <View style={styles.autoDot} />}
          <Text style={styles.chevron}>›</Text>
        </View>
      </Pressable>

      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setVisible(false)}
          />
          <View style={styles.sheet}>
            <Pressable
              style={styles.autoRow}
              onPress={() => {
                resetToAuto();
                setVisible(false);
              }}
            >
              <Text style={styles.autoText}>📡 Auto GPS</Text>
            </Pressable>

            {BIMSTEC_COUNTRIES.map((country) => {
              const selected = country.code === currentCountryCode;
              return (
                <Pressable
                  key={country.code}
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => handleSelect(country.code)}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.flag}>{country.flag}</Text>
                    <Text style={styles.rowName}>{country.name}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.lang}>
                      {country.language.toUpperCase()}
                    </Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#1a1a2e",
    borderColor: "#2a2a3e",
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pillLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillText: {
    color: "#f3f4ff",
    fontSize: 14,
    fontWeight: "600",
  },
  flag: {
    fontSize: 18,
  },
  chevron: {
    color: "#f3f4ff",
    fontSize: 18,
    marginTop: -1,
  },
  autoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#27d17f",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  sheet: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#2a2a3e",
  },
  autoRow: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  autoText: {
    color: "#f3f4ff",
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  rowSelected: {
    backgroundColor: "#2a2a3e",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowName: {
    color: "#f3f4ff",
    fontSize: 15,
    fontWeight: "600",
  },
  lang: {
    color: "#b9b9d6",
    fontSize: 12,
    letterSpacing: 1,
  },
  check: {
    color: "#e94560",
    fontSize: 16,
    fontWeight: "700",
  },
});
