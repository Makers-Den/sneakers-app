import { theme } from "@/lib/theme";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { ShoesCarouselPagination } from "./ShoesCarouselPagination";

export const SHOES_CAROUSEL_IMAGE_ASPECT_RATIO = 1.05;

export function getShoesCarouselDimensions() {
  const windowDimensions = Dimensions.get("window");
  const imageWidth = windowDimensions.width - theme.spacing(2) * 2;
  const imageHeight = imageWidth * SHOES_CAROUSEL_IMAGE_ASPECT_RATIO;
  return {
    height: imageHeight + 40,
    image: {
      width: imageWidth,
      height: imageHeight,
    },
  };
}

export interface ShoesCarouselProps {
  images: string[];
}

export function ShoesCarousel({ images }: ShoesCarouselProps) {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const windowDimensions = useWindowDimensions();

  const shoeCarouselDimensions = useMemo(
    () => getShoesCarouselDimensions(),
    []
  );

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
        height={shoeCarouselDimensions.height}
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
  const shoeCarouselDimensions = useMemo(
    () => getShoesCarouselDimensions(),
    []
  );
  return (
    <View style={styles.imageWrapper}>
      <Image
        style={[
          styles.image,
          {
            width: shoeCarouselDimensions.image.width,
            height: shoeCarouselDimensions.image.height,
          },
        ]}
        source={{ uri: image }}
      />
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
  },
  image: {
    resizeMode: "contain",
    marginTop: theme.spacing(2),
  },
  paginationWrapper: {
    pointerEvents: "none",
    position: "absolute",
    bottom: theme.spacing(2),
    left: 0,
    right: 0,
  },
});
