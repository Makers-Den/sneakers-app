import React from "react";
import { StyleSheet, View } from "react-native";
import { FEED_SHOES_CARD_HEIGHT } from "./FeedShoesCard";
import { theme } from "@/lib/theme";

export function FeedShoesCardPlaceholder() {
  return <View style={styles.wrapper}/>;
}

const styles = StyleSheet.create({
  wrapper: {
    height: FEED_SHOES_CARD_HEIGHT,
    backgroundColor: theme.palette.gray[700],
  },
});
