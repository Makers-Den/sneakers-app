import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/lib/theme";
import { PlaceholderLoading } from "./PlaceholderLoading";

export const BLOG_CARD_HEIGHT = 300;
export const BLOG_IMAGE_WIDTH = 180;
export const BLOG_IMAGE_HEIGHT = 240;

export type BlogCardProps = {
  onPress: () => void;
  image: string;
  title: string;
};

export function BlogCard({ onPress, image, title }: BlogCardProps) {
  return (
    <Pressable style={styles.blogWrapper} onPress={onPress}>
      <View style={styles.blogImageWrapper}>
        {image && <Image style={styles.blogImage} source={{ uri: image }} />}
      </View>
      <View>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.blogTitle}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

export function BlogCardPlaceholder() {
  return (
    <PlaceholderLoading width={BLOG_IMAGE_WIDTH} height={BLOG_IMAGE_HEIGHT} />
  );
}

const styles = StyleSheet.create({
  blogWrapper: {
    display: "flex",
    flexDirection: "column",
    width: BLOG_IMAGE_WIDTH,
    height: BLOG_CARD_HEIGHT,
    marginHorizontal: theme.spacing(2),
  },

  blogImageWrapper: {
    position: "relative",
    width: BLOG_IMAGE_WIDTH,
    height: BLOG_IMAGE_HEIGHT,
  },

  blogImage: {
    resizeMode: "cover",
    width: BLOG_IMAGE_WIDTH,
    height: BLOG_IMAGE_HEIGHT,
    borderRadius: theme.spacing(1),
  },

  blogTitle: {
    marginTop: theme.spacing(1),
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
