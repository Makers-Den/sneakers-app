import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { useInfiniteQuery, useQuery } from "react-query";
import { Shoe, getShoesByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import {
  Navigation,
  RootTabParamList,
  Screen,
  ShoppingScreen,
} from "@/types/navigation";
import { memo } from "react";
import { FlashList } from "@shopify/flash-list";
import { theme } from "@/lib/theme";
import { CATEGORY_CARD_HEIGHT, CategoryCard } from "./CategoryCard";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export const CATEGORY_LIST_ITEM_SEPARATOR_HEIGHT = theme.spacing(0.5);

export function CategoryListItemSeparator() {
  return <View style={styles.itemSeparator} />;
}

function estimateListHeight(listItemCount: number) {
  return (
    CATEGORY_CARD_HEIGHT * listItemCount +
    Math.max(0, listItemCount - 1) * CATEGORY_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

export interface CategoryListViewProps {
  navigation: BottomTabScreenProps<
    RootTabParamList,
    Screen.DiscoverScreens
  >["navigation"];
}

export function CategoryListView({ navigation }: CategoryListViewProps) {
  const dimensions = Dimensions.get("window");

  const categoryList = [
    {
      title: "First Category",
      blogs: [
        {
          title: "First Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "2 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "3 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "4 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "5 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
      ],
    },
    {
      title: "Second Category",
      blogs: [
        {
          title: "First Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "2 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "3 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "4 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
        {
          title: "5 Blog",
          image: "https://legacy.reactjs.org/logo-og.png",
        },
      ],
    },
  ];

  return (
    <View style={styles.wrapper}>
      <FlashList
        data={categoryList}
        estimatedItemSize={CATEGORY_CARD_HEIGHT}
        estimatedListSize={{
          width: dimensions.width,
          height: estimateListHeight(categoryList.length),
        }}
        ItemSeparatorComponent={CategoryListItemSeparator}
        renderItem={({ item: category }) => {
          return (
            <CategoryCard
              {...category}
              onBlogPress={() => {}}
              onMorePress={() => {}}
            />
          );
        }}
      />
    </View>
  );
}

export const MemoCategoryListView = memo(CategoryListView);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  itemSeparator: {
    backgroundColor: theme.palette.gray[900],
    height: CATEGORY_LIST_ITEM_SEPARATOR_HEIGHT,
  },
});
