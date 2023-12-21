import React from "react";
import { StyleSheet, View } from "react-native";
import { getInStockCardDimensions } from "./InStockShoesCard";
import { theme } from "@/lib/theme";

export function InStockShoesCardPlaceholder() {
  const inStockCardDimensions = getInStockCardDimensions();
  return (
    <View
      style={[
        styles.wrapper,
        {
          height: inStockCardDimensions.height,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.palette.gray[700],
  },
});
