import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export const FEED_SNEAKERS_CARD_HEIGHT = 500;
export const FEED_SNEAKERS_IMAGE_MAX_WIDTH = 352;
export const FEED_SNEAKERS_IMAGE_MAX_HEIGHT = 340;

export interface FeedSneakersCardProps {
  model: string;
  modelVariant: string | null;
  image: string | null;
  buttonText: string;
  onPress: () => void;
}

export function FeedSneakersCard({
  image,
  model,
  modelVariant,
  buttonText,
  onPress,
}: FeedSneakersCardProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.modelText}>{model}</Text>
          <Text style={styles.modelVariantText}>{modelVariant}</Text>
        </View>

        <View style={styles.imageWrapper}>
          {image && <Image style={[styles.image]} source={{ uri: image }} />}
        </View>

        <View style={styles.bottomWrapper}>
          <View />
          <Button
            text={buttonText}
            onPress={() => {
              // @TODO Add on press
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: FEED_SNEAKERS_CARD_HEIGHT,
    position: "relative",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.gray[700],
  },
  modelText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(0.5),
  },
  modelVariantText: {
    fontSize: theme.typography.fontSize["2xl"],
    lineHeight: theme.typography.fontSize["2xl"] * 1.41,
    color: theme.palette.gray[100],
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    padding: theme.spacing(2),
    height: 360,
  },
  image: {
    resizeMode: "contain",
    width: FEED_SNEAKERS_IMAGE_MAX_WIDTH,
    height: FEED_SNEAKERS_IMAGE_MAX_HEIGHT,
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
