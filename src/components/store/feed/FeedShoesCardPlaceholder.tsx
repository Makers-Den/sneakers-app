import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { getFeedShoeCardDimensions } from "./FeedShoesCard";
import { theme } from "@/lib/theme";

export function FeedShoesCardPlaceholder() {
  const cardDimensions = getFeedShoeCardDimensions();
  return (
    <View
      style={[
        styles.wrapper,
        {
          height: cardDimensions.height,
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
