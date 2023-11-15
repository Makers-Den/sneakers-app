import { Dimensions, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { getShoesByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo } from "react";
import {
  FEED_SHOES_CARD_HEIGHT,
  FEED_SHOES_IMAGE_HEIGHT,
  FEED_SHOES_IMAGE_WIDTH,
  FeedShoesCard,
} from "./FeedShoesCard";
import { FlashList } from "@shopify/flash-list";
import { FeedShoesCardPlaceholder } from "./FeedShoesCardPlaceholder";
import { SHOES_LIST_ITEM_SEPARATOR_HEIGHT, ShoesListItemSeparator } from "../ShoesListItemSeparator";

const SHOES_PLACEHOLDERS_TO_DISPLAY = 10;

function estimateListHeight(listItemCount: number) {
  return (
    FEED_SHOES_CARD_HEIGHT * listItemCount +
    Math.max(0, listItemCount - 1) * SHOES_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

export interface FeedShoesViewProps {
  navigation: Navigation;
}

export function FeedShoesView({ navigation }: FeedShoesViewProps) {
  const feedShoesQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesByCollectionId({
        collectionId: envVariables.shopify.collectionId.feed,
        maxImageHeight: FEED_SHOES_IMAGE_HEIGHT,
        maxImageWidth: FEED_SHOES_IMAGE_WIDTH,
        signal,
      }),
    queryKey: queryKeys.shoes.list({
      collectionId: envVariables.shopify.collectionId.feed,
      maxImageHeight: FEED_SHOES_IMAGE_HEIGHT,
      maxImageWidth: FEED_SHOES_IMAGE_WIDTH,
    }),
  });

  const dimensions = Dimensions.get("window");

  return (
    <View style={styles.wrapper}>
      {feedShoesQuery.isLoading || !feedShoesQuery.data ? (
        <FlashList
          data={new Array(SHOES_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          estimatedItemSize={FEED_SHOES_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(SHOES_PLACEHOLDERS_TO_DISPLAY),
          }}
          renderItem={FeedShoesCardPlaceholder}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      ) : (
        <FlashList
          data={feedShoesQuery.data}
          estimatedItemSize={FEED_SHOES_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(feedShoesQuery.data.length),
          }}
          renderItem={({ item: shoes }) => {
            const currencyFormatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: shoes.price.currencyCode,
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
                onPress={() => {
                  navigation.navigate(Screen.ShoesDetails, {
                    shoesId: shoes.id,
                  });
                }}
              />
            );
          }}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      )}
    </View>
  );
}

export const MemoFeedShoesView = memo(FeedShoesView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});