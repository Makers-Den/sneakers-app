import { theme } from "@/lib/theme";
import { FlashList } from "@shopify/flash-list";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export const CATEGORY_CARD_HEIGHT = 420;

export const CATEGORY_BLOG_CARD_HEIGHT = 300;
export const CATEGORY_BLOG_IMAGE_WIDTH = 200;
export const CATEGORY_BLOG_IMAGE_HEIGHT = 260;

function calculateListWidth(listItemCount: number) {
  return (
    CATEGORY_BLOG_IMAGE_WIDTH * listItemCount +
    Math.max(0, listItemCount - 1) * theme.spacing(2)
  );
}

export type Blog = {
  title: string;
  image: string;
};

export type CategoryCardProps<T extends Blog> = {
  blogs: T[];
  title: string;
  onMorePress: () => void;
  onBlogPress: (blog: T) => void;
};

export function CategoryCard<T extends Blog>({
  blogs,
  title,
  onMorePress,
  onBlogPress,
}: CategoryCardProps<T>) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onMorePress}>
          <Text style={styles.viewMore}>View More</Text>
        </Pressable>
      </View>

      <FlashList
        horizontal
        data={blogs}
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={CATEGORY_BLOG_IMAGE_WIDTH}
        estimatedListSize={{
          width: calculateListWidth(blogs.length),
          height: CATEGORY_BLOG_CARD_HEIGHT,
        }}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Pressable
            style={styles.blogWrapper}
            onPress={() => onBlogPress(item)}
          >
            <View style={styles.blogImageWrapper}>
              {item.image && (
                <Image
                  style={styles.blogImage}
                  source={{ uri: item.image, scale: 1 }}
                />
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
    </View>
  );
}

export function CategoryCardPlaceholder() {
  return <View style={styles.placeholder}></View>;
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: CATEGORY_CARD_HEIGHT,
    position: "relative",
    paddingVertical: theme.spacing(4),
  },
  placeholder: {
    width: "100%",
    height: CATEGORY_CARD_HEIGHT,
    backgroundColor: theme.palette.gray[400],
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(2),
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.palette.gray[100],
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeight.bold,
  },

  viewMore: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },

  blogWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: CATEGORY_BLOG_IMAGE_WIDTH,
    height: CATEGORY_BLOG_CARD_HEIGHT,
    marginHorizontal: theme.spacing(2),
  },

  blogImageWrapper: {
    position: "relative",
    width: CATEGORY_BLOG_IMAGE_WIDTH,
    height: CATEGORY_BLOG_IMAGE_HEIGHT,
  },

  blogImage: {
    resizeMode: "cover",
    width: CATEGORY_BLOG_IMAGE_WIDTH,
    height: CATEGORY_BLOG_IMAGE_HEIGHT,
    borderRadius: theme.spacing(1),
  },

  blogTitle: {
    marginTop: theme.spacing(0.5),
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
