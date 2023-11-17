import { theme } from "@/lib/theme";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export const SEARCH_SHOES_CARD_HEIGHT = 100;
export const SEARCH_SHOES_IMAGE_WIDTH = 75;
export const SEARCH_SHOES_IMAGE_HEIGHT = 45;

export interface SearchShoesCardProps {
  model: string;
  modelVariant: string | null;
  image: string | null;
  onPress: () => void;
}

export function SearchShoesCard({
  image,
  model,
  modelVariant,
  onPress,
}: SearchShoesCardProps) {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={styles.innerWrapper}>
        <View style={styles.imageWrapper}>
          {image && <Image style={styles.image} source={{ uri: image }} />}
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.modelText}>{model}</Text>
          {modelVariant && (
            <Text style={styles.modelVariantText}>{modelVariant}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    height: SEARCH_SHOES_CARD_HEIGHT,
    backgroundColor: theme.palette.gray[700],
    padding: theme.spacing(2),
  },
  innerWrapper: {
    flexDirection: "row",
    gap: theme.spacing(4),
  },
  imageWrapper: {
    width: SEARCH_SHOES_IMAGE_WIDTH,
    height: SEARCH_SHOES_IMAGE_HEIGHT,
  },
  image: {
    resizeMode: "contain",
    width: SEARCH_SHOES_IMAGE_WIDTH,
    height: SEARCH_SHOES_IMAGE_HEIGHT,
  },
  textWrapper: {
    flexGrow: 1,
    flexShrink: 1,
  },
  modelText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
    fontWeight: "500",
  },
  modelVariantText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
