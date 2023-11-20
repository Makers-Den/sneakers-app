import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { format, isThisWeek, isToday, isTomorrow } from "date-fns";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export const UPCOMING_SHOES_CARD_HEIGHT = 270;
export const UPCOMING_SHOES_IMAGE_WIDTH = 165;
export const UPCOMING_SHOES_IMAGE_HEIGHT = 110;

const formatDropsAt = (date: Date) => {
  if (isToday(date)) {
    return `Today ${format(date, "h:mm aaa")}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow ${format(date, "h:mm aaa")}`;
  }

  if (isThisWeek(date)) {
    return format(date, "eeee h:mm aaa");
  }

  return format(date, "dd.MM h:mm aaa");
};

export interface UpcomingShoesCardProps {
  model: string;
  sizeRange: { min: string; max: string } | null;
  modelVariant: string | null;
  dropsAt: Date | null;
  image: string | null;
  onPress: () => void;
  onButtonPress: () => void;
}

export function UpcomingShoesCard({
  model,
  modelVariant,
  dropsAt,
  sizeRange,
  image,
  onPress,
  onButtonPress,
}: UpcomingShoesCardProps) {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <Text style={styles.model}>
        {model}
        {modelVariant && ` "${modelVariant}"`}
      </Text>
      <Text style={styles.dropsAt}>
        {dropsAt ? formatDropsAt(dropsAt) : "Unknown"}
      </Text>
      <Text style={styles.sizeRange}>
        {sizeRange ? `${sizeRange.min} - ${sizeRange.max}` : "Unknown"}
      </Text>
      <View style={styles.imageWrapper}>
        {image && <Image style={[styles.image]} source={{ uri: image }} />}
      </View>
      <View style={styles.bottomWrapper}>
        <Button variant="outlined" text="Notify Me" onPress={onButtonPress} />
        <View />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: UPCOMING_SHOES_CARD_HEIGHT,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.gray[700],
  },
  model: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(0.25),
  },
  dropsAt: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[400],
    marginBottom: theme.spacing(0.25),
  },
  sizeRange: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[400],
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  image: {
    resizeMode: "contain",
    width: UPCOMING_SHOES_IMAGE_WIDTH,
    height: UPCOMING_SHOES_IMAGE_HEIGHT,
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
