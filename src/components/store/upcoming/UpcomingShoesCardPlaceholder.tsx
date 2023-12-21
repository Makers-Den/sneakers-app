import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { getUpcomingShoesCardDimensions } from "./UpcomingShoesCard";
import { theme } from "@/lib/theme";

export function UpcomingShoesCardPlaceholder() {
  const upcomingShoesCardDimensions = useMemo(
    () => getUpcomingShoesCardDimensions(),
    []
  );
  return (
    <View
      style={[
        styles.wrapper,
        {
          height: upcomingShoesCardDimensions.height,
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
