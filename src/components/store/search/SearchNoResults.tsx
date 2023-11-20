import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function SearchNoResults() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>No results</Text>
      <Text style={styles.description}>
        There are no products that match your search.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.spacing(2),
  },
  heading: {
    textAlign: "center",
    fontSize: theme.typography.fontSize.lg,
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(1),
  },
  description: {
    textAlign: "center",
    fontSize: theme.typography.fontSize.base,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    color: theme.palette.gray[400],
  },
});
