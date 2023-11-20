import { Dimensions, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";
import { getShoesByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo, useMemo, useState } from "react";
import {
  UPCOMING_SHOES_CARD_HEIGHT,
  UPCOMING_SHOES_IMAGE_HEIGHT,
  UPCOMING_SHOES_IMAGE_WIDTH,
  UpcomingShoesCard,
} from "./UpcomingShoesCard";
import { FlashList } from "@shopify/flash-list";
import { UpcomingShoesCardPlaceholder } from "./UpcomingShoesCardPlaceholder";
import {
  SHOES_LIST_ITEM_SEPARATOR_HEIGHT,
  ShoesListItemSeparator,
} from "../ShoesListItemSeparator";
import {
  UPCOMING_SHOES_HEADER_HEIGHT,
  UpcomingShoesHeader,
} from "./UpcomingShoesHeader";
import { NotificationModal } from "../notification/NotificationModal";
import { useNotificationModal } from "@/hooks/useNotificationModal";

const SHOES_PLACEHOLDERS_TO_DISPLAY = 10;

enum ListItemType {
  Header,
  Card,
}

type ListItem =
  | { type: ListItemType.Header; dropsAt: Date }
  | {
      type: ListItemType.Card;
      hasSeparator: boolean;
      shoes: NonNullable<
        Awaited<ReturnType<typeof getShoesByCollectionId>>
      >[number];
    };

export interface UpcomingShoesViewProps {
  navigation: Navigation;
  isLazy: boolean;
}

export function UpcomingShoesView({
  navigation,
  isLazy,
}: UpcomingShoesViewProps) {
  const notificationModal = useNotificationModal();
  const listItemsQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesByCollectionId({
        collectionId: envVariables.shopify.collectionId.upcoming,
        maxImageHeight: UPCOMING_SHOES_IMAGE_HEIGHT,
        maxImageWidth: UPCOMING_SHOES_IMAGE_WIDTH,
        signal,
      }).then((shoes) => {
        if (!shoes) {
          return shoes;
        }

        const shoesWithDropDates = shoes.filter((shoes) => shoes.dropsAt);
        const rawShoesDropDates = new Set<number>(
          shoesWithDropDates
            .map((shoes) => (shoes.dropsAt as Date).getTime())
            .sort((a, b) => a - b)
        );

        const listItems: ListItem[] = [];
        rawShoesDropDates.forEach((rawShoesDropDate) => {
          const dropsAt = new Date(rawShoesDropDate);
          listItems.push({ type: ListItemType.Header, dropsAt });

          shoesWithDropDates
            .filter((shoes) => shoes.dropsAt?.getTime() === rawShoesDropDate)
            .forEach((shoes, index, all) =>
              listItems.push({
                type: ListItemType.Card,
                shoes,
                hasSeparator: index + 1 !== all.length,
              })
            );
        });

        return listItems;
      }),
    queryKey: queryKeys.shoes.list({
      collectionId: envVariables.shopify.collectionId.upcoming,
      maxImageHeight: UPCOMING_SHOES_IMAGE_HEIGHT,
      maxImageWidth: UPCOMING_SHOES_IMAGE_WIDTH,
    }),
    enabled: !isLazy,
  });

  const dimensions = Dimensions.get("window");

  const estimatedListHeight = useMemo(
    () =>
      (listItemsQuery.data || []).reduce(
        (sum, item) =>
          sum + item.type === ListItemType.Card
            ? UPCOMING_SHOES_CARD_HEIGHT + SHOES_LIST_ITEM_SEPARATOR_HEIGHT
            : UPCOMING_SHOES_HEADER_HEIGHT,
        0
      ),
    [listItemsQuery]
  );

  return (
    <View style={styles.wrapper}>
      {listItemsQuery.isLoading || !listItemsQuery.data ? (
        <FlashList
          data={new Array(SHOES_PLACEHOLDERS_TO_DISPLAY).fill(null)}
          estimatedItemSize={
            UPCOMING_SHOES_CARD_HEIGHT + SHOES_LIST_ITEM_SEPARATOR_HEIGHT
          }
          estimatedListSize={{
            width: dimensions.width,
            height:
              SHOES_PLACEHOLDERS_TO_DISPLAY *
              (UPCOMING_SHOES_CARD_HEIGHT + SHOES_LIST_ITEM_SEPARATOR_HEIGHT),
          }}
          renderItem={({ index }) => (
            <View>
              <UpcomingShoesCardPlaceholder />
              {index - 1 !== SHOES_PLACEHOLDERS_TO_DISPLAY && (
                <ShoesListItemSeparator />
              )}
            </View>
          )}
        />
      ) : (
        <FlashList
          data={listItemsQuery.data}
          estimatedItemSize={estimatedListHeight / listItemsQuery.data.length}
          estimatedListSize={{
            width: dimensions.width,
            height: estimatedListHeight,
          }}
          getItemType={(item) => item.type}
          renderItem={({ item }) => {
            switch (item.type) {
              case ListItemType.Header:
                return <UpcomingShoesHeader dropsAt={item.dropsAt} />;
              case ListItemType.Card:
                return (
                  <View>
                    <UpcomingShoesCard
                      model={item.shoes.model}
                      modelVariant={item.shoes.modelVariant}
                      image={item.shoes.previewImage}
                      dropsAt={item.shoes.dropsAt}
                      sizeRange={
                        item.shoes.sizeRange
                          ? {
                              min: item.shoes.sizeRange.min.label,
                              max: item.shoes.sizeRange.max.label,
                            }
                          : null
                      }
                      onPress={() => {
                        navigation.navigate(Screen.ShoesDetails, {
                          shoesId: item.shoes.id,
                        });
                      }}
                      onButtonPress={() =>
                        notificationModal.open({
                          id: item.shoes.id,
                          model: item.shoes.model,
                        })
                      }
                    />
                    {item.hasSeparator && <ShoesListItemSeparator />}
                  </View>
                );
            }
          }}
        />
      )}

      <NotificationModal {...notificationModal.props} />
    </View>
  );
}

export const MemoUpcomingShoesView = memo(UpcomingShoesView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
