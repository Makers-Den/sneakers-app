import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const FEED_IMAGE_ASPECT_RATIO = 1.05;

export function getFeedShoeCardDimensions() {
  const windowDimensions = Dimensions.get("window");
  const imageWidth = windowDimensions.width - theme.spacing(2) * 2;
  const imageHeight = imageWidth * FEED_IMAGE_ASPECT_RATIO;
  return {
    height: imageHeight + 160,
    image: {
      width: imageWidth,
      height: imageHeight,
    },
  };
}

export interface FeedShoesCardProps {
  model: string;
  modelVariant: string | null;
  image: string | null;
  buttonText: string;
  onButtonPress: () => void;
  onPress: () => void;
}

export function FeedShoesCard({
  image,
  model,
  modelVariant,
  buttonText,
  onPress,
  onButtonPress,
}: FeedShoesCardProps) {
  const cardDimensions = getFeedShoeCardDimensions();
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
        <View>
          <Text style={styles.modelText}>{model}</Text>
          <Text style={styles.modelVariantText}>{modelVariant}</Text>
        </View>

        <View
          style={[
            styles.imageWrapper,
            { height: cardDimensions.image.height + 20 },
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

        <View style={styles.bottomWrapper}>
          <View />
          <Button text={buttonText} onPress={onButtonPress} />
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
    lineHeight:
      theme.typography.fontSize["2xl"] * theme.typography.lineHeight.normal,
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
