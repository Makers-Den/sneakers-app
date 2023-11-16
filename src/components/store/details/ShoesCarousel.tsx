import { theme } from "@/lib/theme";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { ShoesCarouselPagination } from "./ShoesCarouselPagination";

export const SHOES_CAROUSEL_HEIGHT = 330;
export const SHOES_CAROUSEL_IMAGE_WIDTH = 325;
export const SHOES_CAROUSEL_IMAGE_HEIGHT = 160;

export interface ShoesCarouselProps {
  images: string[];
}

export function ShoesCarousel({ images }: ShoesCarouselProps) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const windowDimensions = useWindowDimensions();

  const handleProgressChange = useCallback(
    (_: unknown, absoluteProgress: number) =>
      setActiveItemIndex(Math.round(absoluteProgress)),
    [setActiveItemIndex]
  );

  return (
    <View style={styles.wrapper}>
      <Carousel
        loop={false}
        width={windowDimensions.width}
        windowSize={windowDimensions.width}
        height={SHOES_CAROUSEL_HEIGHT}
        data={images}
        renderItem={ShoesCarouselItem}
        onProgressChange={handleProgressChange}
      />

      <View style={styles.paginationWrapper}>
        <ShoesCarouselPagination
          activeItemIndex={activeItemIndex}
          itemCount={images.length}
        />
      </View>
    </View>
  );
}

function ShoesCarouselItem({ item: image }: CarouselRenderItemInfo<string>) {
  return (
    <View style={styles.imageWrapper}>
      <Image style={styles.image} source={{ uri: image }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.gray[700],
  },
  imageWrapper: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: SHOES_CAROUSEL_HEIGHT,
  },
  image: {
    resizeMode: "contain",
    width: SHOES_CAROUSEL_IMAGE_WIDTH,
    height: SHOES_CAROUSEL_IMAGE_HEIGHT,
    marginTop: theme.spacing(8),
  },
  paginationWrapper: {
    pointerEvents: "none",
    position: "absolute",
    bottom: theme.spacing(5),
    left: 0,
    right: 0,
  },
});
