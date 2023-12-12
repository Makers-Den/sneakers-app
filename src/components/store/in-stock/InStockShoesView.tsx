import { Dimensions, StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';
import { getShoesByCollectionId } from '@/lib/shopify';
import { envVariables } from '@/lib/env';
import { queryKeys } from '@/lib/query';
import { Navigation, Screen, ShoppingScreen } from '@/types/navigation';
import { memo } from 'react';
import { FlashList } from '@shopify/flash-list';
import {
  IN_STOCK_SHOES_CARD_HEIGHT,
  IN_STOCK_SHOES_IMAGE_HEIGHT,
  IN_STOCK_SHOES_IMAGE_WIDTH,
  InStockShoesCard,
} from './InStockShoesCard';
import { InStockShoesCardPlaceholder } from './InStockShoesCardPlaceholder';
import { InStockShoesCardWrapper } from './InStockShoesCardWrapper';
import {
  SHOES_LIST_ITEM_SEPARATOR_HEIGHT,
  ShoesListItemSeparator,
} from '../ShoesListItemSeparator';

const SHOES_PLACEHOLDERS_TO_DISPLAY = 20;
const SHOES_LIST_NUM_OF_COLUMNS = 2;

function estimateListHeight(listItemCount: number) {
  const listRowCount = Math.floor(listItemCount / SHOES_LIST_NUM_OF_COLUMNS);

  return (
    IN_STOCK_SHOES_CARD_HEIGHT * listRowCount +
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
  const inStockShoesQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesByCollectionId({
        collectionId: envVariables.shopify.collectionId.inStock,
        maxImageHeight: IN_STOCK_SHOES_IMAGE_HEIGHT,
        maxImageWidth: IN_STOCK_SHOES_IMAGE_WIDTH,
        signal,
      }),
    queryKey: queryKeys.shoes.list({
      collectionId: envVariables.shopify.collectionId.inStock,
      maxImageHeight: IN_STOCK_SHOES_IMAGE_HEIGHT,
      maxImageWidth: IN_STOCK_SHOES_IMAGE_WIDTH,
    }),
    enabled: !isLazy,
  });

  const dimensions = Dimensions.get('window');

  return (
    <View style={styles.wrapper}>
      {inStockShoesQuery.isLoading || !inStockShoesQuery.data ? (
        <FlashList
          data={new Array(SHOES_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          numColumns={SHOES_LIST_NUM_OF_COLUMNS}
          estimatedItemSize={IN_STOCK_SHOES_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(SHOES_PLACEHOLDERS_TO_DISPLAY),
          }}
          renderItem={({ index }) => (
            <InStockShoesCardWrapper isLeftColumn={index % 2 === 0}>
              <InStockShoesCardPlaceholder />
            </InStockShoesCardWrapper>
          )}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      ) : (
        <FlashList
          data={inStockShoesQuery.data}
          numColumns={SHOES_LIST_NUM_OF_COLUMNS}
          estimatedItemSize={IN_STOCK_SHOES_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(inStockShoesQuery.data.length),
          }}
          renderItem={({ item: shoes, index }) => (
            <InStockShoesCardWrapper isLeftColumn={index % 2 === 0}>
              <InStockShoesCard
                image={shoes.previewImage}
                onPress={() => {
                  navigation.navigate(ShoppingScreen.ShoesDetails, {
                    shoesId: shoes.id,
                  });
                }}
              />
            </InStockShoesCardWrapper>
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
