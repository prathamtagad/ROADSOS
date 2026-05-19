import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import TopAppBar from "../components/TopAppBar";
import { Colors, Radii, Shadows, Spacing } from "../theme/tokens";
import { useAppStore } from "../store/useAppStore";
import { COUNTRY_NAME_MAP } from "../constants/hardcoded";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDOsxRgzC6Z5ggrsAMy3d-XiV3-WTr80Hep4zxc_os59tDJe1EC2zJoixcGI5ViG37uvclwQNjql0kt-zdMqGH5y4o3AtjQr_Hzo4efwHuABUqKaPacyJAV8l_I3tRPFcRSbralLsMZlEi7s5UFs7AfE9dLir9NoAeyFvOhWHxT7kWtxd0418KrmE50CjVxtWuLfwNgiPNIV9m4TZt0dMLyIRP1xuTKCm7bYHvs2D2HYgkOvH5vRppE9X0jlh6ucMtt6XozU7ca_j7T";

export default function TouristEmergencyCardScreen() {
  const [showOnLockScreen, setShowOnLockScreen] = useState(true);
  const currentCountry = useAppStore((state) => state.currentCountry);
  const countryName = COUNTRY_NAME_MAP[currentCountry] || "BIMSTEC";

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.safeTop}>
        <TopAppBar title={`${countryName} Status: Clear`} />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialIcons name="medical-services" size={22} color={Colors.onPrimary} />
              <Text style={styles.cardHeaderText}>EMERGENCY MEDICAL ID | ฉุกเฉิน</Text>
            </View>
            <View style={styles.bloodBadge}>
              <Text style={styles.bloodBadgeText}>A+</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.profileRow}>
              <Image source={{ uri: PROFILE_IMAGE }} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={styles.sectionLabel}>NAME / ชื่อ</Text>
                <Text style={styles.profileName}>Sarah Mitchell</Text>
                <View style={styles.profileGrid}>
                  <View style={styles.profileCell}>
                    <Text style={styles.sectionLabel}>BLOOD TYPE / หมู่เลือด</Text>
                    <Text style={styles.profileValueRed}>A Rh Positive</Text>
                  </View>
                  <View style={styles.profileCellAlert}>
                    <Text style={styles.sectionLabelAlert}>ALLERGIES / การแพ้</Text>
                    <Text style={styles.profileValueAlert}>Penicillin, Peanuts</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.bentoGrid}>
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <MaterialIcons name="contacts" size={18} color={Colors.assistanceOrange} />
                  <Text style={styles.infoTitle}>EMERGENCY CONTACTS / ผู้ติดต่อ</Text>
                </View>
                <View style={styles.infoRow}>
                  <View>
                    <Text style={styles.infoName}>James Mitchell (UK)</Text>
                    <Text style={styles.infoMeta}>+44 7700 900123</Text>
                  </View>
                  <MaterialIcons name="call" size={18} color={Colors.primary} />
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <MaterialIcons name="verified-user" size={18} color={Colors.infoBlue} />
                  <Text style={styles.infoTitle}>INSURANCE / ประกันภัย</Text>
                </View>
                <View style={styles.infoRowBlock}>
                  <Text style={styles.infoName}>AXA International Travel</Text>
                  <Text style={styles.infoMeta}>Policy: #AX92831-2024</Text>
                  <View style={styles.infoSupportRow}>
                    <MaterialIcons name="support-agent" size={16} color={Colors.infoBlue} />
                    <Text style={styles.infoSupportText}>24/7 Hotline: +44 20 1234 5678</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <MaterialIcons name="account-balance" size={18} color={Colors.tertiary} />
                  <Text style={styles.infoTitle}>LOCAL EMBASSY / สถานทูต</Text>
                </View>
                <View style={styles.infoRowBlock}>
                  <Text style={styles.infoName}>British Embassy Bangkok</Text>
                  <Text style={styles.infoMeta}>AIA Sathorn Tower, Level 10</Text>
                  <Text style={styles.infoMetaStrong}>+66 (0) 2 305 8333</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <MaterialIcons name="assignment" size={18} color={Colors.primary} />
                  <Text style={styles.infoTitle}>MEDICAL NOTES / หมายเหตุ</Text>
                </View>
                <View style={styles.noteRow}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.onSurfaceVariant} />
                  <Text style={styles.infoMeta}>Asthmatic (Inhaler in backpack)</Text>
                </View>
                <View style={styles.noteRow}>
                  <MaterialIcons name="check-circle" size={16} color={Colors.onSurfaceVariant} />
                  <Text style={styles.infoMeta}>Organ Donor: YES</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.switchRow}>
              <Switch
                value={showOnLockScreen}
                onValueChange={setShowOnLockScreen}
                trackColor={{ true: Colors.safeGreen, false: Colors.onSurfaceVariant }}
                thumbColor={Colors.surfaceWhite}
              />
              <Text style={styles.footerText}>Show on Lock Screen</Text>
            </View>
            <Pressable style={styles.downloadButton}>
              <MaterialIcons name="file-download" size={18} color={Colors.surface} />
              <Text style={styles.downloadText}>Download PDF Card</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.secondaryGrid}>
          <View style={styles.secondaryCardYellow}>
            <View style={styles.secondaryHeader}>
              <MaterialIcons name="warning" size={26} color={Colors.onSurface} />
              <Text style={styles.secondaryTitle}>Local Emergency</Text>
            </View>
            <Text style={styles.secondaryBody}>
              In Thailand, dial 1669 for medical emergencies or 1155 for Tourist Police.
            </Text>
            <View style={styles.buttonRow}>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Call 1669</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Call 1155</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.secondaryCardWhite}>
            <Text style={styles.sectionLabel}>VERIFIED TRAVELER STATUS</Text>
            <View style={styles.verifiedRow}>
              <View style={styles.verifiedBadge}>
                  <MaterialIcons name="check-circle" size={32} color={Colors.safeGreen} />
              </View>
              <View>
                <Text style={styles.infoName}>BIMSTEC Directory</Text>
                <Text style={styles.infoMeta}>Profile: Active and Verified</Text>
              </View>
            </View>
          </View>
        </View>
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
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxl
  },
  card: {
    backgroundColor: Colors.surfaceWhite,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    overflow: "hidden",
    ...Shadows.hardLg
  },
  cardHeader: {
    backgroundColor: Colors.emergencyRed,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: Colors.onSurface
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  cardHeaderText: {
    color: Colors.onPrimary,
    fontWeight: "800",
    fontSize: 12
  },
  bloodBadge: {
    backgroundColor: Colors.surfaceWhite,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.sm
  },
  bloodBadgeText: {
    color: Colors.emergencyRed,
    fontWeight: "900",
    fontSize: 16
  },
  cardBody: {
    padding: Spacing.lg
  },
  profileRow: {
    flexDirection: "row",
    gap: Spacing.lg
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.outlineVariant
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.sm
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurfaceVariant
  },
  profileName: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.onSurface,
    textTransform: "uppercase"
  },
  profileGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm
  },
  profileCell: {
    flex: 1,
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.md
  },
  profileCellAlert: {
    flex: 1,
    backgroundColor: Colors.errorContainer,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.emergencyRed,
    borderRadius: Radii.md
  },
  profileValueRed: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.emergencyRed,
    marginTop: 4
  },
  sectionLabelAlert: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.emergencyRed
  },
  profileValueAlert: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.emergencyRed,
    marginTop: 4
  },
  bentoGrid: {
    marginTop: Spacing.lg,
    gap: Spacing.md
  },
  infoCard: {
    borderWidth: 2,
    borderColor: Colors.onSurface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.sm
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.onSurface
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radii.md
  },
  infoRowBlock: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: Radii.md
  },
  infoName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.onSurface
  },
  infoMeta: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 2
  },
  infoMetaStrong: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.onSurface,
    marginTop: 6
  },
  infoSupportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: 6
  },
  infoSupportText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.infoBlue
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  cardFooter: {
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.onSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  footerText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.onSurface
  },
  downloadButton: {
    backgroundColor: Colors.onSurface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm
  },
  downloadText: {
    color: Colors.surface,
    fontWeight: "800"
  },
  secondaryGrid: {
    marginTop: Spacing.lg,
    gap: Spacing.md
  },
  secondaryCardYellow: {
    backgroundColor: Colors.warningYellow,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.onSurface
  },
  secondaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm
  },
  secondaryTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.onSurface
  },
  secondaryBody: {
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: Spacing.md
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.sm
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.onSurface,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.md,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: Colors.surface,
    fontWeight: "800"
  },
  secondaryCardWhite: {
    backgroundColor: Colors.surfaceWhite,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.onSurface
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.sm
  },
  verifiedBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(22, 163, 74, 0.2)",
    alignItems: "center",
    justifyContent: "center"
  }
});
