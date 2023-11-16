import { theme } from "@/lib/theme";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export const SHOES_CAROUSEL_HEIGHT = 330;
export const SHOES_CAROUSEL_IMAGE_WIDTH = 325;
export const SHOES_CAROUSEL_IMAGE_HEIGHT = 160;

export interface ShoesCarouselProps {
  images: string[];
}

export function ShoesCarousel({ images }: ShoesCarouselProps) {
  return (
    <View style={styles.wrapper}>
      {images.length > 0 && (
        <Image style={styles.image} source={{ uri: images[0] }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: SHOES_CAROUSEL_HEIGHT,
    backgroundColor: theme.palette.gray[700],
  },
  image: {
    resizeMode: "contain",
    width: SHOES_CAROUSEL_IMAGE_WIDTH,
    height: SHOES_CAROUSEL_IMAGE_HEIGHT,
    marginTop: theme.spacing(8),
  },
});
