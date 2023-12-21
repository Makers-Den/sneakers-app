import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { format, isThisWeek, isToday, isTomorrow } from "date-fns";
import React, { useMemo } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const UPCOMING_SHOES_IMAGE_ASPECT_RATIO = 1;

export function getUpcomingShoesCardDimensions() {
  const windowDimensions = Dimensions.get("window");
  const imageWidth = windowDimensions.width - theme.spacing(8) * 2;

  const imageHeight = imageWidth * UPCOMING_SHOES_IMAGE_ASPECT_RATIO;
  return {
    height: imageHeight + 160,
    image: {
      width: imageWidth,
      height: imageHeight,
    },
  };
}

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
  const upcomingShoesCardDimensions = useMemo(
    () => getUpcomingShoesCardDimensions(),
    []
  );
  return (
    <Pressable
      style={[
        styles.wrapper,
        {
          minHeight: upcomingShoesCardDimensions.height,
        },
      ]}
      onPress={onPress}
    >
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
        {image && (
          <Image
            style={[
              styles.image,
              {
                width: upcomingShoesCardDimensions.image.width,
                height: upcomingShoesCardDimensions.image.height,
              },
            ]}
            source={{ uri: image }}
          />
        )}
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
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
