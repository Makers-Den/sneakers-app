import { Feed, FeedBlog, FeedProduct } from "@/lib/shopify";
import { FeedBlogPostCard } from "./FeedBlogPostCard";
import { FeedShoesCard } from "./FeedShoesCard";
import { ShopifyMetaObjectType } from "@/types/shopify";

export type FeedCardProps = {
  feed: Feed;
  onShoeCardPress: (product: FeedProduct) => void;
  onShoeCardButtonPress: (product: FeedProduct) => void;
  onBlogCardPress: (blog: FeedBlog) => void;
};

function isBlogPost(feed: Feed): feed is FeedBlog {
  return "type" in feed && feed.type === ShopifyMetaObjectType.blogPost;
}

export function FeedCard({
  onBlogCardPress,
  onShoeCardButtonPress,
  onShoeCardPress,
  feed,
}: FeedCardProps) {
  if (isBlogPost(feed)) {
    return (
      <FeedBlogPostCard
        image={feed.data.thumbnail}
        onPress={() => onBlogCardPress(feed)}
      />
    );
  }

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: feed?.price?.currencyCode,
  });
  return (
    <FeedShoesCard
      image={feed.previewImage}
      model={feed.model}
      modelVariant={feed.modelVariant}
      buttonText={
        feed.isUpcoming
          ? "Notify Me"
          : currencyFormatter.format(feed.price.amount)
      }
      onButtonPress={() => onShoeCardButtonPress(feed)}
      onPress={() => onShoeCardPress(feed)}
    />
  );
}
