import { theme } from "@/lib/theme";
import { FlashList } from "@shopify/flash-list";
import { BLOG_CARD_HEIGHT, BLOG_IMAGE_WIDTH, BlogCard } from "./BlogCard";

function calculateListWidth(listItemCount: number) {
  return (
    BLOG_IMAGE_WIDTH * listItemCount +
    Math.max(0, listItemCount - 1) * theme.spacing(1)
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
        <BlogCard
          title={item.title}
          key={item.id}
          image={item.image}
          onPress={() => onBlogPress(item)}
        />
      )}
    />
  );
}
