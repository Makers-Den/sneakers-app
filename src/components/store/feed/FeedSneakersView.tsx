import { Dimensions, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { getSneakersByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo } from "react";
import {
  FEED_SNEAKERS_CARD_HEIGHT,
  FeedSneakersCard,
} from "./FeedSneakersCard";
import { FlashList } from "@shopify/flash-list";
import {
  FEED_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT,
  FeedSneakersListItemSeparator,
} from "./FeedSneakersListItemSeparator";
import { FeedSneakersCardPlaceholder } from "./FeedSneakersCardPlaceholder";

const SNEAKERS_IMAGE_MAX_WIDTH = 352;
const SNEAKERS_IMAGE_MAX_HEIGHT = 340;
const SNEAKERS_IMAGE_ASPECT_RATIO =
  SNEAKERS_IMAGE_MAX_WIDTH / SNEAKERS_IMAGE_MAX_HEIGHT;
const SNEAKERS_PLACEHOLDERS_TO_DISPLAY = 10;

function estimateListHeight(listItemCount: number) {
  return (
    FEED_SNEAKERS_CARD_HEIGHT * listItemCount +
    Math.max(0, listItemCount - 1) * FEED_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

export interface FeedSneakersViewProps {
  navigation: Navigation;
}

export function FeedSneakersView({ navigation }: FeedSneakersViewProps) {
  const feedSneakersQuery = useQuery({
    queryFn: ({ signal }) =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.feed,
        maxImageHeight: SNEAKERS_IMAGE_MAX_WIDTH,
        maxImageWidth: SNEAKERS_IMAGE_MAX_HEIGHT,
        signal,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.feed,
      maxImageHeight: SNEAKERS_IMAGE_MAX_WIDTH,
      maxImageWidth: SNEAKERS_IMAGE_MAX_HEIGHT,
    }),
  });

  const dimensions = Dimensions.get("window");

  return (
    <View style={styles.wrapper}>
      {feedSneakersQuery.isLoading || !feedSneakersQuery.data ? (
        <FlashList
          data={new Array(SNEAKERS_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          estimatedItemSize={FEED_SNEAKERS_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(SNEAKERS_PLACEHOLDERS_TO_DISPLAY),
          }}
          renderItem={FeedSneakersCardPlaceholder}
          ItemSeparatorComponent={FeedSneakersListItemSeparator}
        />
      ) : (
        <FlashList
          data={feedSneakersQuery.data}
          estimatedItemSize={FEED_SNEAKERS_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(feedSneakersQuery.data.length),
          }}
          renderItem={({ item: sneakers }) => {
            const currencyFormatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: sneakers.price.currencyCode,
            });

            return (
              <FeedSneakersCard
                image={sneakers.previewImage}
                imageAspectRatio={SNEAKERS_IMAGE_ASPECT_RATIO}
                model={sneakers.model}
                modelVariant={sneakers.modelVariant}
                buttonText={
                  sneakers.isUpcoming
                    ? "Notify Me"
                    : currencyFormatter.format(
                        parseFloat(sneakers.price.amount)
                      )
                }
                onPress={() => {
                  // @TODO Handle press
                }}
              />
            );
          }}
          ItemSeparatorComponent={FeedSneakersListItemSeparator}
        />
      )}
    </View>
  );
}

export const MemoFeedSneakersView = memo(FeedSneakersView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
