import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { useInfiniteQuery } from "react-query";
import { Feed, getFeed, getShoesByCollectionId } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";
import {
  Navigation,
  MainScreen,
  ShoppingScreen,
  ShoppingScreensProps,
  RootScreen,
} from "@/types/navigation";
import { memo, useCallback, useContext, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { FeedShoesCardPlaceholder } from "./FeedShoesCardPlaceholder";
import {
  SHOES_LIST_ITEM_SEPARATOR_HEIGHT,
  ShoesListItemSeparator,
} from "../ShoesListItemSeparator";
import { useCheckoutProcess } from "@/hooks/useCheckoutProcess";
import { Checkout } from "../checkout/Checkout";
import { NotificationModal } from "../notification/NotificationModal";
import { useNotificationModal } from "@/hooks/useNotificationModal";
import { theme } from "@/lib/theme";
import { getImageSize } from "@/lib/image";
import {
  FeedCard,
  getFeedCardDimension,
  getFeedCardImageDimensions,
} from "./FeedCard";
import { ShopifyMetaObjectType } from "@/types/shopify";

const SHOES_PLACEHOLDERS_TO_DISPLAY = 5;

function estimateListHeight(listItemCount: number, cardHeight: number) {
  return (
    cardHeight * listItemCount +
    Math.max(0, listItemCount - 1) * SHOES_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

type FeedShoes = NonNullable<
  Awaited<ReturnType<typeof getShoesByCollectionId>>
>[number];

export function FeedShoesView({
  navigation,
}: Pick<ShoppingScreensProps<ShoppingScreen.ShoesList>, "navigation">) {
  const notificationModal = useNotificationModal();
  const checkoutProcess = useCheckoutProcess();

  const feedShoeImage = useMemo(() => {
    return getImageSize(getFeedCardImageDimensions());
  }, []);

  const feedShoesQuery = useInfiniteQuery({
    queryFn: ({ pageParam, signal }) => {
      return getFeed({
        maxImageHeight: feedShoeImage.height,
        maxImageWidth: feedShoeImage.width,
        perPage: SHOES_PLACEHOLDERS_TO_DISPLAY,
        cursor: pageParam,
        signal,
      });
    },
    queryKey: queryKeys.feed.list({
      maxImageHeight: feedShoeImage.height,
      maxImageWidth: feedShoeImage.width,
    }),

    getNextPageParam: (lastPage, pages) =>
      lastPage?.[0] && lastPage[0].pageInfo.hasNextPage
        ? lastPage[0].pageInfo.endCursor
        : undefined,
  });

  const feedContent: Feed[] | null = useMemo(() => {
    if (!feedShoesQuery.data?.pages) {
      return null;
    }

    return feedShoesQuery.data.pages.flat().filter((page) => page) as Feed[];
  }, [feedShoesQuery.data?.pages]);

  const feedCardDimensions = useMemo(() => {
    return getFeedCardDimension();
  }, [feedContent]);

  const dimensions = Dimensions.get("window");

  const handleEndReached = useCallback(() => {
    if (!feedShoesQuery.hasNextPage) {
      return;
    }
    feedShoesQuery.fetchNextPage();
  }, [feedShoesQuery]);

  const handleButtonPress = useCallback(
    (shoes: FeedShoes) => {
      if (shoes.isUpcoming) {
        notificationModal.open({
          id: shoes.id,
          model: shoes.model,
        });

        return;
      }

      checkoutProcess.startCheckoutProcess({
        model: shoes.model,
        modelVariant: shoes.modelVariant,
        priceAmount: shoes.price.amount,
        priceCurrencyCode: shoes.price.currencyCode,
        sizes: shoes.sizes,
      });
    },
    [checkoutProcess]
  );

  return (
    <View style={styles.wrapper}>
      {feedShoesQuery.isLoading || !feedContent ? (
        <FlashList
          data={new Array(SHOES_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          estimatedItemSize={feedCardDimensions.height}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(
              SHOES_PLACEHOLDERS_TO_DISPLAY,
              dimensions.width
            ),
          }}
          renderItem={FeedShoesCardPlaceholder}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      ) : (
        <FlashList
          data={feedContent}
          estimatedItemSize={feedCardDimensions.height}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(
              feedContent.length,
              feedCardDimensions.height
            ),
          }}
          renderItem={({ item }) => {
            return (
              <FeedCard
                feed={item}
                onBlogCardPress={(content) => {
                  if (content.type === ShopifyMetaObjectType.blogPost) {
                    navigation.navigate(MainScreen.BlogPostScreen, {
                      blogPostId: content.id,
                    });
                  }

                  if (content.type === ShopifyMetaObjectType.stories) {
                    navigation.navigate(RootScreen.Story, { id: item.id });
                  }
                }}
                onShoeCardButtonPress={handleButtonPress}
                onShoeCardPress={(shoe) => {
                  navigation.navigate(ShoppingScreen.ShoesDetails, {
                    shoesId: shoe.id,
                  });
                }}
              />
            );
          }}
          ItemSeparatorComponent={ShoesListItemSeparator}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            feedShoesQuery.isFetchingNextPage ? (
              <ActivityIndicator
                size="large"
                color={theme.palette.green[400]}
                style={{ marginVertical: 10 }}
              />
            ) : null
          }
        />
      )}

      <Checkout {...checkoutProcess.checkoutProps} />
      <NotificationModal {...notificationModal.props} />
    </View>
  );
}

export const MemoFeedShoesView = memo(FeedShoesView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
