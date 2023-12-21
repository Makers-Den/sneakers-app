import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useInfiniteQuery } from "react-query";
import { Shoe, getShoesByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, ShoppingScreen } from "@/types/navigation";
import { memo, useCallback, useMemo } from "react";
import { FeedShoesCard, getFeedCardDimensions } from "./FeedShoesCard";
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

export interface FeedShoesViewProps {
  navigation: Navigation;
}

export function FeedShoesView({ navigation }: FeedShoesViewProps) {
  const notificationModal = useNotificationModal();
  const checkoutProcess = useCheckoutProcess();

  const feedCardDimensions = useMemo(() => {
    return getFeedCardDimensions();
  }, []);

  const feedShoeImage = useMemo(() => {
    return getImageSize(feedCardDimensions.image);
  }, [feedCardDimensions]);

  const feedShoesQuery = useInfiniteQuery({
    queryFn: ({ pageParam, signal }) => {
      return getShoesByCollectionId({
        collectionId: envVariables.shopify.collectionId.feed,
        maxImageHeight: feedShoeImage.height,
        maxImageWidth: feedShoeImage.width,
        perPage: SHOES_PLACEHOLDERS_TO_DISPLAY,
        cursor: pageParam,
        signal,
      });
    },
    queryKey: queryKeys.shoes.list({
      collectionId: envVariables.shopify.collectionId.feed,
      maxImageHeight: feedShoeImage.height,
      maxImageWidth: feedShoeImage.width,
    }),

    getNextPageParam: (lastPage, pages) =>
      lastPage?.[0] && lastPage[0].pageInfo.hasNextPage
        ? lastPage[0].pageInfo.endCursor
        : undefined,
  });

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

  const shoeList: Shoe[] | null = useMemo(() => {
    if (!feedShoesQuery.data?.pages) {
      return null;
    }

    return feedShoesQuery.data.pages.flat().filter((page) => page) as Shoe[];
  }, [feedShoesQuery.data?.pages]);

  return (
    <View style={styles.wrapper}>
      {feedShoesQuery.isLoading || !shoeList ? (
        <FlashList
          data={new Array(SHOES_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          estimatedItemSize={feedCardDimensions.height}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(
              SHOES_PLACEHOLDERS_TO_DISPLAY,
              feedCardDimensions.height
            ),
          }}
          renderItem={FeedShoesCardPlaceholder}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      ) : (
        <FlashList
          data={shoeList}
          estimatedItemSize={feedCardDimensions.height}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(
              shoeList.length,
              feedCardDimensions.height
            ),
          }}
          renderItem={({ item: shoes }) => {
            const currencyFormatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: shoes?.price?.currencyCode,
            });

            return (
              <FeedShoesCard
                image={shoes.previewImage}
                model={shoes.model}
                modelVariant={shoes.modelVariant}
                buttonText={
                  shoes.isUpcoming
                    ? "Notify Me"
                    : currencyFormatter.format(shoes.price.amount)
                }
                onButtonPress={() => handleButtonPress(shoes)}
                onPress={() => {
                  navigation.navigate(ShoppingScreen.ShoesDetails, {
                    shoesId: shoes.id,
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
