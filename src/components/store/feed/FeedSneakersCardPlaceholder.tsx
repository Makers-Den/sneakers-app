import React from "react";
import { StyleSheet, View } from "react-native";
import { FEED_SNEAKERS_CARD_HEIGHT } from "./FeedSneakersCard";
import { theme } from "@/lib/theme";

export function FeedSneakersCardPlaceholder() {
  return <View style={styles.wrapper}/>;
}

const styles = StyleSheet.create({
  wrapper: {
    height: FEED_SNEAKERS_CARD_HEIGHT,
    backgroundColor: theme.palette.gray[700],
  },
});
