import { theme } from "@/lib/theme";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet } from "react-native";
import { SHOES_LIST_ITEM_SEPARATOR_HEIGHT } from "../ShoesListItemSeparator";

export const IN_STOCK_SHOES_IMAGE_ASPECT_RATIO = 1;

export function getInStockCardDimensions() {
  const windowDimensions = Dimensions.get("window");
  const imageWidth =
    windowDimensions.width / 2 -
    theme.spacing(5) * 2 -
    SHOES_LIST_ITEM_SEPARATOR_HEIGHT;
  const imageHeight = imageWidth * IN_STOCK_SHOES_IMAGE_ASPECT_RATIO;
  return {
    height: imageHeight + 100,
    image: {
      width: imageWidth,
      height: imageHeight,
    },
  };
}

export interface InStockShoesCardProps {
  image: string | null;
  onPress: () => void;
}

export function InStockShoesCard({ image, onPress }: InStockShoesCardProps) {
  const inStockCardDimensions = getInStockCardDimensions();
  return (
    <Pressable
      style={[styles.wrapper, { height: inStockCardDimensions.height }]}
      onPress={onPress}
    >
      {image && (
        <Image
          style={[
            styles.image,
            {
              width: inStockCardDimensions.image.width,
              height: inStockCardDimensions.image.height,
            },
          ]}
          source={{ uri: image }}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.gray[700],
  },
  image: {
    resizeMode: "contain",
  },
});
