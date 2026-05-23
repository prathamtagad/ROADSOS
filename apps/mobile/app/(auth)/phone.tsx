import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import type { ConfirmationResult } from "firebase/auth";
import { useCountryStore } from "../../src/store/countryStore";
import { signInWithPhone, verifyOTP } from "../../src/lib/firebase/auth";

const COUNTRY_DIAL_CODES: Record<string, string> = {
  TH: "+66",
  MM: "+95",
  LK: "+94",
  NP: "+977",
  BD: "+880",
  BT: "+975"
};

export default function PhoneScreen() {
  const currentCountry = useCountryStore((state) => state.currentCountry());
  const dialCode = COUNTRY_DIAL_CODES[currentCountry.code] || "+66";
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const canResend = countdown <= 0;
  const fullPhone = useMemo(() => `${dialCode}${phone}`, [dialCode, phone]);

  const triggerShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true })
    ]).start();
  }, [shakeAnim]);

  useEffect(() => {
    if (!confirmation) {
      return;
    }

    inputRefs.current[0]?.focus();
  }, [confirmation]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!confirmation || verifying) {
      return;
    }

    const complete = otpDigits.every((digit) => digit.length === 1);
    if (complete) {
      void handleVerify(otpDigits.join(""));
    }
  }, [confirmation, otpDigits, verifying]);

  const handleSendOtp = useCallback(async () => {
    if (!phone.trim()) {
      setError("Enter your phone number.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const result = await signInWithPhone(fullPhone);
      setConfirmation(result);
      setOtpDigits(["", "", "", "", "", ""]);
      setCountdown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setSending(false);
    }
  }, [fullPhone, phone]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (!confirmation) {
        return;
      }

      setVerifying(true);
      setError("");

      try {
        await verifyOTP(confirmation, code);
      } catch (err) {
        setError("Invalid OTP. Try again.");
        triggerShake();
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } finally {
        setVerifying(false);
      }
    },
    [confirmation, triggerShake]
  );

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });

      if (digit && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    []
  );

  const handleOtpKeyPress = useCallback(
    (index: number, key: string) => {
      if (key === "Backspace" && !otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otpDigits]
  );

  const handleResend = useCallback(async () => {
    if (!canResend) {
      return;
    }

    await handleSendOtp();
  }, [canResend, handleSendOtp]);

  const shakeStyle = {
    transform: [
      {
        translateX: shakeAnim.interpolate({
          inputRange: [-1, 1],
          outputRange: [-8, 8]
        })
      }
    ]
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify your phone</Text>
        <Text style={styles.subtitle}>We will send a 6-digit code to continue.</Text>

        <View style={styles.phoneRow}>
          <View style={styles.countryPill}>
            <Text style={styles.flag}>{currentCountry.flag}</Text>
            <Text style={styles.dialCode}>{dialCode}</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={setPhone}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSendOtp}
          disabled={sending}
        >
          <Text style={styles.buttonText}>{sending ? "Sending..." : "Send OTP"}</Text>
        </Pressable>

        {confirmation && (
          <View style={styles.otpSection}>
            <Text style={styles.sectionLabel}>Enter the code</Text>
            <Animated.View style={[styles.otpRow, shakeStyle]}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={`otp-${index}`}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </Animated.View>

            <Pressable onPress={handleResend} disabled={!canResend}>
              <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
                {canResend ? "Resend OTP" : `Resend in ${countdown}s`}
              </Text>
            </Pressable>
          </View>
        )}

        {verifying ? <Text style={styles.helperText}>Verifying...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    paddingHorizontal: 24,
    paddingTop: 64
  },
  content: {
    gap: 16
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f3f4ff"
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  countryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a1a2e",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#2a2a3e"
  },
  flag: {
    fontSize: 18
  },
  dialCode: {
    color: "#f3f4ff",
    fontSize: 14,
    fontWeight: "700"
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a3e",
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
  buttonPressed: {
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: "#0a0a1a",
    fontSize: 16,
    fontWeight: "700"
  },
  otpSection: {
    marginTop: 12,
    gap: 12
  },
  sectionLabel: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "600"
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  otpInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#1a1a2e",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a3e",
    color: "#f3f4ff",
    fontSize: 18,
    fontWeight: "700"
  },
  resendText: {
    color: "#e94560",
    fontWeight: "600"
  },
  resendDisabled: {
    color: "#6b7280"
  },
  helperText: {
    color: "#9ca3af"
  },
  errorText: {
    color: "#f87171",
    fontWeight: "600"
  }
});
