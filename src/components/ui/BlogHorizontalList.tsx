import { theme } from "@/lib/theme";
import { FlashList } from "@shopify/flash-list";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export const BLOG_CARD_HEIGHT = 300;
export const BLOG_IMAGE_WIDTH = 200;
export const BLOG_IMAGE_HEIGHT = 260;

function calculateListWidth(listItemCount: number) {
  return (
    BLOG_IMAGE_WIDTH * listItemCount +
    Math.max(0, listItemCount - 1) * theme.spacing(2)
  );
}

export type Blog = {
  id: string;
  title: string;
  image: string;
};

export type OnBlogPress<T extends Blog> = (blog: T) => void;

export type CategoryCardProps<T extends Blog> = {
  blogs: T[];
  onBlogPress: OnBlogPress<T>;
};

export function BlogHorizontalList<T extends Blog>({
  onBlogPress,
  blogs,
}: CategoryCardProps<T>) {
  return (
    <FlashList
      horizontal
      data={blogs}
      showsHorizontalScrollIndicator={false}
      estimatedItemSize={BLOG_IMAGE_WIDTH}
      estimatedListSize={{
        width: calculateListWidth(blogs.length),
        height: BLOG_CARD_HEIGHT,
      }}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <Pressable style={styles.blogWrapper} onPress={() => onBlogPress(item)}>
          <View style={styles.blogImageWrapper}>
            {item.image && (
              <Image style={styles.blogImage} source={{ uri: item.image }} />
            )}
          </View>
          <View>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.blogTitle}
            >
              {item.title}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  blogWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    marginTop: theme.spacing(0.5),
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
