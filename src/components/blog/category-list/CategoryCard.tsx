import {
  Blog,
  BlogHorizontalList,
  OnBlogPress,
} from "@/components/ui/BlogHorizontalList";
import { PlaceholderLoading } from "@/components/ui/PlaceholderLoading";
import { theme } from "@/lib/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const CATEGORY_CARD_HEIGHT = 420;

export type CategoryCardProps<T extends Blog> = {
  blogs: T[];
  title: string;
  onMorePress: () => void;
  onBlogPress: OnBlogPress<T>;
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

      <BlogHorizontalList blogs={blogs} onBlogPress={onBlogPress} />
    </View>
  );
}

export function CategoryCardPlaceholder() {
  return <PlaceholderLoading width={"100%"} height={CATEGORY_CARD_HEIGHT} />;
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
});
