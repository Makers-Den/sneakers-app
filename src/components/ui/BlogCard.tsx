import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/lib/theme";
import { PlaceholderLoading } from "./PlaceholderLoading";

export const BLOG_CARD_IMAGE_ASPECT_RATIO = 0.75;

export function getBlogCardDimensions() {
  const windowDimensions = Dimensions.get("window");

  const imageWidth = (windowDimensions.width - theme.spacing(6)) / 2;

  const imageHeight = imageWidth / BLOG_CARD_IMAGE_ASPECT_RATIO;

  return {
    height: imageHeight + 60,
    width: imageWidth,
    image: {
      width: imageWidth,
      height: imageHeight,
    },
  };
}

const blogCardDimensions = getBlogCardDimensions();

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
    <PlaceholderLoading
      width={blogCardDimensions.height}
      height={blogCardDimensions.width}
    />
  );
}

const styles = StyleSheet.create({
  blogWrapper: {
    display: "flex",
    flexDirection: "column",
    width: blogCardDimensions.width,
    height: blogCardDimensions.height,
    marginHorizontal: theme.spacing(1),
  },

  blogImageWrapper: {
    position: "relative",
    width: blogCardDimensions.image.width,
    height: blogCardDimensions.image.height,
  },

  blogImage: {
    resizeMode: "cover",
    width: blogCardDimensions.image.width,
    height: blogCardDimensions.image.height,
    borderRadius: theme.spacing(1),
  },

  blogTitle: {
    marginTop: theme.spacing(1),
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
