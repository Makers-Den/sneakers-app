import React from "react";
import { StyleSheet, View } from "react-native";
import { UPCOMING_SHOES_CARD_HEIGHT } from "./UpcomingShoesCard";
import { theme } from "@/lib/theme";

export function UpcomingShoesCardPlaceholder() {
  return <View style={styles.wrapper} />;
}

const styles = StyleSheet.create({
  wrapper: {
    height: UPCOMING_SHOES_CARD_HEIGHT,
    backgroundColor: theme.palette.gray[700],
  },
});
