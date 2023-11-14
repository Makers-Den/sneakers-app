import React from "react";
import { StyleSheet, View } from "react-native";
import { IN_STOCK_SNEAKERS_CARD_HEIGHT } from "./InStockSneakersCard";
import { theme } from "@/lib/theme";

export function InStockSneakersCardPlaceholder() {
  return <View style={styles.wrapper} />;
}

const styles = StyleSheet.create({
  wrapper: {
    height: IN_STOCK_SNEAKERS_CARD_HEIGHT,
    backgroundColor: theme.palette.gray[700],
  },
});
