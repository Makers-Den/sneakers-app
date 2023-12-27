import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const SHOES_LIST_ITEM_SEPARATOR_HEIGHT = theme.spacing(0.1);

export function ShoesListItemSeparator() {
  return <View style={styles.wrapper} />;
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.palette.gray[900],
    height: SHOES_LIST_ITEM_SEPARATOR_HEIGHT,
  },
});
