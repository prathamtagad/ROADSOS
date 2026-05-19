import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Radii, Spacing } from "../theme/tokens";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ROADSOS Error Boundary:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <MaterialIcons name="warning" size={64} color={Colors.emergencyRed} />
          <Text style={styles.title}>ROADSOS ERROR</Text>
          <Text style={styles.message}>
            Something went wrong. The app encountered an unexpected error.
          </Text>
          <Text style={styles.detail}>
            {this.state.error?.message || "Unknown error"}
          </Text>
          <Pressable
            onPress={this.handleRetry}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryPressed]}
          >
            <MaterialIcons name="refresh" size={20} color={Colors.onPrimary} />
            <Text style={styles.retryText}>RETRY</Text>
          </Pressable>
          <Text style={styles.hint}>
            Emergency numbers are still available. Dial your local emergency line directly.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.onSurface,
    marginTop: Spacing.lg
  },
  message: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: Spacing.md
  },
  detail: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: Spacing.sm,
    fontStyle: "italic"
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 2,
    borderColor: Colors.onSurface,
    marginTop: Spacing.xl
  },
  retryPressed: {
    transform: [{ scale: 0.96 }]
  },
  retryText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.onPrimary
  },
  hint: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: Spacing.lg
  }
});
