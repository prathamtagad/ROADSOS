import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  BIMSTEC_COUNTRIES,
  OTHER_COUNTRIES,
  type Country,
} from "../constants/countries";
import { useCountryStore } from "../store/countryStore";

export default function CountrySelector() {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const currentCountry = useCountryStore((state) => state.currentCountry());
  const currentCountryCode = useCountryStore(
    (state) => state.currentCountryCode
  );
  const isManualOverride = useCountryStore((state) => state.isManualOverride);
  const setCountry = useCountryStore((state) => state.setCountry);
  const resetToAuto = useCountryStore((state) => state.resetToAuto);

  const query = search.trim().toLowerCase();

  const filteredBimstec = useMemo(
    () =>
      BIMSTEC_COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.dialCode.includes(query)
      ),
    [query]
  );

  const filteredOther = useMemo(
    () =>
      OTHER_COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.code.toLowerCase().includes(query) ||
          c.dialCode.includes(query)
      ),
    [query]
  );

  const handleSelect = (code: string) => {
    setTimeout(() => {
      setCountry(code);
      setVisible(false);
      setSearch("");
    }, 150);
  };

  const handleClose = () => {
    setVisible(false);
    setSearch("");
  };

  const renderRow = (country: Country) => {
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
          <Text style={styles.dialCode}>{country.dialCode}</Text>
        </View>
        <View style={styles.rowRight}>
          {selected && <Text style={styles.check}>✓</Text>}
        </View>
      </Pressable>
    );
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
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />
          <View style={styles.sheet}>
            {/* Search bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                placeholderTextColor="#6a6a8e"
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <ScrollView
              style={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Auto GPS row */}
              <Pressable
                style={styles.autoRow}
                onPress={() => {
                  resetToAuto();
                  handleClose();
                }}
              >
                <Text style={styles.autoText}>📡 Auto GPS</Text>
              </Pressable>

              {/* BIMSTEC Region */}
              {filteredBimstec.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>BIMSTEC Region</Text>
                  {filteredBimstec.map(renderRow)}
                </>
              )}

              {/* Other Countries */}
              {filteredOther.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>Other Countries</Text>
                  {filteredOther.map(renderRow)}
                </>
              )}

              {filteredBimstec.length === 0 && filteredOther.length === 0 && (
                <Text style={styles.noResults}>No countries found</Text>
              )}
            </ScrollView>
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
    maxHeight: "75%",
  },
  searchContainer: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: "#0a0a1a",
    borderColor: "#2a2a3e",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#f3f4ff",
    fontSize: 15,
  },
  scrollArea: {
    flexGrow: 0,
  },
  sectionHeader: {
    color: "#6a6a8e",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    paddingHorizontal: 8,
    paddingTop: 14,
    paddingBottom: 6,
  },
  autoRow: {
    height: 50,
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
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 2,
  },
  rowSelected: {
    backgroundColor: "#2a2a3e",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
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
  dialCode: {
    color: "#6a6a8e",
    fontSize: 13,
    fontWeight: "400",
  },
  check: {
    color: "#e94560",
    fontSize: 16,
    fontWeight: "700",
  },
  noResults: {
    color: "#6a6a8e",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 24,
  },
});
