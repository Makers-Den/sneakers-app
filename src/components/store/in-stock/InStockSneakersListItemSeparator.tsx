import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const IN_STOCK_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT = theme.spacing(0.5);

export function InStockSneakersListItemSeparator() {
  return <View style={styles.wrapper} />;
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.palette.gray[900],
    height: IN_STOCK_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT,
  },
});
