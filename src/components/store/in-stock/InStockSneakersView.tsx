import { Dimensions, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { getSneakersByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo } from "react";
import { FlashList } from "@shopify/flash-list";
import {
  IN_STOCK_SNEAKERS_CARD_HEIGHT,
  IN_STOCK_SNEAKERS_IMAGE_HEIGHT,
  IN_STOCK_SNEAKERS_IMAGE_WIDTH,
  InStockSneakersCard,
} from "./InStockSneakersCard";
import {
  IN_STOCK_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT,
  InStockSneakersListItemSeparator,
} from "./InStockSneakersListItemSeparator";
import { InStockSneakersCardPlaceholder } from "./InStockSneakersCardPlaceholder";
import { InStockSneakersCardWrapper } from "./InStockSneakersCardWrapper";

const SNEAKERS_PLACEHOLDERS_TO_DISPLAY = 20;
const SNEAKERS_LIST_NUM_OF_COLUMNS = 2;

function estimateListHeight(listItemCount: number) {
  const listRowCount = Math.floor(listItemCount / SNEAKERS_LIST_NUM_OF_COLUMNS);

  return (
    IN_STOCK_SNEAKERS_CARD_HEIGHT * listRowCount +
    Math.max(0, listRowCount - 1) * IN_STOCK_SNEAKERS_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

export interface InStockSneakersViewProps {
  navigation: Navigation;
}

export function InStockSneakersView({ navigation }: InStockSneakersViewProps) {
  const inStockSneakersQuery = useQuery({
    queryFn: ({ signal }) =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.inStock,
        maxImageHeight: IN_STOCK_SNEAKERS_IMAGE_HEIGHT,
        maxImageWidth: IN_STOCK_SNEAKERS_IMAGE_WIDTH,
        signal,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.inStock,
      maxImageHeight: IN_STOCK_SNEAKERS_IMAGE_HEIGHT,
      maxImageWidth: IN_STOCK_SNEAKERS_IMAGE_WIDTH,
    }),
  });

  const dimensions = Dimensions.get("window");

  return (
    <View style={styles.wrapper}>
      {inStockSneakersQuery.isLoading || !inStockSneakersQuery.data ? (
        <FlashList
          data={new Array(SNEAKERS_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          numColumns={SNEAKERS_LIST_NUM_OF_COLUMNS}
          estimatedItemSize={IN_STOCK_SNEAKERS_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(SNEAKERS_PLACEHOLDERS_TO_DISPLAY),
          }}
          renderItem={({ index }) => (
            <InStockSneakersCardWrapper isLeftColumn={index % 2 === 0}>
              <InStockSneakersCardPlaceholder />
            </InStockSneakersCardWrapper>
          )}
          ItemSeparatorComponent={InStockSneakersListItemSeparator}
        />
      ) : (
        <FlashList
          data={inStockSneakersQuery.data}
          numColumns={SNEAKERS_LIST_NUM_OF_COLUMNS}
          estimatedItemSize={IN_STOCK_SNEAKERS_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(inStockSneakersQuery.data.length),
          }}
          renderItem={({ item: sneakers, index }) => (
            <InStockSneakersCardWrapper isLeftColumn={index % 2 === 0}>
              <InStockSneakersCard
                image={sneakers.previewImage}
                onPress={() => {
                  navigation.navigate(Screen.SneakersDetails, {
                    sneakersId: sneakers.id,
                  });
                }}
              />
            </InStockSneakersCardWrapper>
          )}
          ItemSeparatorComponent={InStockSneakersListItemSeparator}
        />
      )}
    </View>
  );
}

export const MemoInStockSneakersView = memo(InStockSneakersView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
