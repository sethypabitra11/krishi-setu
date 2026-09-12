import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreenContainer({
  children,
  style,
}) {
  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});