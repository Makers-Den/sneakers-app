import { theme } from "@/lib/theme";
import { FlashList } from "@shopify/flash-list";
import { BlogCard, getBlogCardDimensions } from "./BlogCard";
import { ShopifyMetaObjectType } from "@/types/shopify";

const blogCardDimensions = getBlogCardDimensions();

function calculateListWidth(listItemCount: number) {
  return (
    blogCardDimensions.width * listItemCount +
    Math.max(0, listItemCount - 1) * theme.spacing(1)
  );
}

export type Blog = {
  id: string;
  title: string;
  image: string;
  type: ShopifyMetaObjectType.blogPost | ShopifyMetaObjectType.stories;
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
      estimatedItemSize={blogCardDimensions.width}
      estimatedListSize={{
        width: calculateListWidth(blogs.length),
        height: blogCardDimensions.height,
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
