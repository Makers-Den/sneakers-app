import { theme } from "@/lib/theme";
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";

export const IN_STOCK_SNEAKERS_CARD_HEIGHT = 215;
export const IN_STOCK_SNEAKERS_IMAGE_MAX_WIDTH = 150;
export const IN_STOCK_SNEAKERS_IMAGE_MAX_HEIGHT = 85;

export interface InStockSneakersCardProps {
  image: string | null;
  onPress: () => void;
}

export function InStockSneakersCard({
  image,
  onPress,
}: InStockSneakersCardProps) {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      {image && <Image style={[styles.image]} source={{ uri: image }} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: IN_STOCK_SNEAKERS_CARD_HEIGHT,
    position: "relative",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.gray[700],
  },
  image: {
    resizeMode: "contain",
    width: IN_STOCK_SNEAKERS_IMAGE_MAX_WIDTH,
    height: IN_STOCK_SNEAKERS_IMAGE_MAX_HEIGHT,
  },
});
