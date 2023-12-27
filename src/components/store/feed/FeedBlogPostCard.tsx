import { theme } from "@/lib/theme";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

export const FEED_IMAGE_ASPECT_RATIO = 1;

export function getFeedBlogPostCardDimensions() {
  const windowDimensions = Dimensions.get("window");
  const imageWidth = windowDimensions.width;
  const imageHeight = imageWidth * FEED_IMAGE_ASPECT_RATIO;
  return {
    height: imageHeight,
    image: {
      width: imageWidth,
      height: imageHeight,
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
    resizeMode: "contain",
  },
});
