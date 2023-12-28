import { Dimensions, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { getShoesByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, ShoppingScreen } from "@/types/navigation";
import { memo, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { InStockShoesCard, getInStockCardDimensions } from "./InStockShoesCard";
import { InStockShoesCardPlaceholder } from "./InStockShoesCardPlaceholder";
import {
  SHOES_LIST_ITEM_SEPARATOR_HEIGHT,
  ShoesListItemSeparator,
} from "../ShoesListItemSeparator";
import { getImageSize } from "@/lib/image";
import { TwoColumnCardWrapper } from "@/components/ui/TwoColumnsCardWrapper";

const SHOES_PLACEHOLDERS_TO_DISPLAY = 20;
const SHOES_LIST_NUM_OF_COLUMNS = 2;

function estimateListHeight(listItemCount: number, cardHeight: number) {
  const listRowCount = Math.floor(listItemCount / SHOES_LIST_NUM_OF_COLUMNS);

  return (
    cardHeight * listRowCount +
    Math.max(0, listRowCount - 1) * SHOES_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

export interface InStockShoesViewProps {
  navigation: Navigation;
  isLazy: boolean;
}

export function InStockShoesView({
  navigation,
  isLazy,
}: InStockShoesViewProps) {
  const inStockShoesCardDimensions = useMemo(() => {
    return getInStockCardDimensions();
  }, []);

  const inStockShoeImage = useMemo(() => {
    return getImageSize(inStockShoesCardDimensions.image);
  }, [inStockShoesCardDimensions.image]);

  const inStockShoesQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesByCollectionId({
        collectionId: envVariables.shopify.collectionId.inStock,
        maxImageHeight: inStockShoeImage.height,
        maxImageWidth: inStockShoeImage.width,
        signal,
      }),
    queryKey: queryKeys.shoes.list({
      collectionId: envVariables.shopify.collectionId.inStock,
      maxImageHeight: inStockShoeImage.height,
      maxImageWidth: inStockShoeImage.width,
    }),
    enabled: !isLazy,
  });

  const dimensions = Dimensions.get("window");

  return (
    <View style={styles.wrapper}>
      {inStockShoesQuery.isLoading || !inStockShoesQuery.data ? (
        <FlashList
          data={new Array(SHOES_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          numColumns={SHOES_LIST_NUM_OF_COLUMNS}
          estimatedItemSize={inStockShoesCardDimensions.height}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(
              SHOES_PLACEHOLDERS_TO_DISPLAY,
              inStockShoesCardDimensions.height
            ),
          }}
          renderItem={({ index }) => (
            <TwoColumnCardWrapper
              padding={SHOES_LIST_ITEM_SEPARATOR_HEIGHT / 2}
              isLeftColumn={index % 2 === 0}
            >
              <InStockShoesCardPlaceholder />
            </TwoColumnCardWrapper>
          )}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      ) : (
        <FlashList
          data={inStockShoesQuery.data}
          numColumns={SHOES_LIST_NUM_OF_COLUMNS}
          estimatedItemSize={inStockShoesCardDimensions.height}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(
              inStockShoesQuery.data.length,
              inStockShoesCardDimensions.height
            ),
          }}
          renderItem={({ item: shoes, index }) => (
            <TwoColumnCardWrapper
              padding={SHOES_LIST_ITEM_SEPARATOR_HEIGHT / 2}
              isLeftColumn={index % 2 === 0}
            >
              <InStockShoesCard
                image={shoes.previewImage}
                onPress={() => {
                  navigation.navigate(ShoppingScreen.ShoesDetails, {
                    shoesId: shoes.id,
                  });
                }}
              />
            </TwoColumnCardWrapper>
          )}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      )}
    </View>
  );
}

export const MemoInStockShoesView = memo(InStockShoesView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
