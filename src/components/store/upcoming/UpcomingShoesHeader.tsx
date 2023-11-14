import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { isToday, isTomorrow, format } from "date-fns";

export const UPCOMING_SHOES_HEADER_HEIGHT = 56;

const formatDate = (date: Date) => {
  if (isToday(date)) {
    return "Today's Drops";
  }

  if (isTomorrow(date)) {
    return "Drops Tomorrow";
  }

  return format(date, "dd.MM");
};

export interface UpcomingShoesHeaderProps {
  dropsAt: Date;
}

export function UpcomingShoesHeader({ dropsAt }: UpcomingShoesHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{formatDate(dropsAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.gray[800],
    minHeight: UPCOMING_SHOES_HEADER_HEIGHT,
  },
  text: {
    color: theme.palette.gray[100],
    fontSize: theme.typography.fontSize.lg,
  },
});
