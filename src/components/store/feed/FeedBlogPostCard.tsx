import { theme } from "@/lib/theme";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { getFeedShoeCardDimensions } from "./FeedShoesCard";

export const FEED_IMAGE_ASPECT_RATIO = 1;

export function getFeedBlogPostCardDimensions() {
  const windowDimensions = Dimensions.get("window");
  const shoeCard = getFeedShoeCardDimensions();
  return {
    height: shoeCard.height,
    image: {
      width: windowDimensions.width,
      height: shoeCard.height,
    },
  };
}

export interface FeedBlogPostCardProps {
  image: string | null;
  onPress: () => void;
}

export function FeedBlogPostCard({ image, onPress }: FeedBlogPostCardProps) {
  const cardDimensions = getFeedBlogPostCardDimensions();
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.wrapper,
          {
            height: cardDimensions.height,
          },
        ]}
      >
        {image && (
          <Image
            style={[
              styles.image,
              {
                width: cardDimensions.image.width,
                height: cardDimensions.image.height,
              },
            ]}
            source={{ uri: image }}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.gray[700],
  },
  image: {
    resizeMode: "cover",
  },
});
