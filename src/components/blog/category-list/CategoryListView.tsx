import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { useInfiniteQuery, useQuery } from "react-query";
import {
  Shoe,
  getContentCategories,
  getShoesByCollectionId,
} from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import {
  Navigation,
  RootTabParamList,
  Screen,
  ShoppingScreen,
} from "@/types/navigation";
import { memo, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { theme } from "@/lib/theme";
import {
  CATEGORY_BLOG_IMAGE_HEIGHT,
  CATEGORY_BLOG_IMAGE_WIDTH,
  CATEGORY_CARD_HEIGHT,
  CategoryCard,
  CategoryCardPlaceholder,
} from "./CategoryCard";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { ca } from "date-fns/locale";
import { getImageSize } from "@/lib/image";

export const CATEGORY_LIST_ITEM_SEPARATOR_HEIGHT = theme.spacing(0.5);

export const PLACEHOLDERS_TO_DISPLAY = 3;

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

const categoryImage = getImageSize({
  height: CATEGORY_BLOG_IMAGE_HEIGHT,
  width: CATEGORY_BLOG_IMAGE_WIDTH,
});

export function CategoryListView({ navigation }: CategoryListViewProps) {
  const dimensions = Dimensions.get("window");

  const categoryContentQuery = useQuery({
    queryFn: ({ signal }) => {
      return getContentCategories({
        signal,
        image: {
          maxWidth: categoryImage.width,
          maxHeight: categoryImage.height,
        },
      });
    },
    queryKey: queryKeys.contentCategories.all(),
  });

  const categoryList = useMemo(() => {
    if (categoryContentQuery.data) {
      return categoryContentQuery.data.map((category) => {
        return {
          title: category.data.title,
          blogs: category.content.map((blog) => {
            return {
              title: blog.data.title,
              image: blog.data.thumbnail,
            };
          }),
        };
      });
    }
    return [];
  }, [categoryContentQuery.data]);

  return (
    <View style={styles.wrapper}>
      {categoryContentQuery.isLoading || !categoryList ? (
        <FlashList
          data={new Array(PLACEHOLDERS_TO_DISPLAY).fill(null)}
          estimatedItemSize={CATEGORY_CARD_HEIGHT}
          estimatedListSize={{
            width: dimensions.width,
            height: estimateListHeight(categoryList.length),
          }}
          ItemSeparatorComponent={CategoryListItemSeparator}
          renderItem={CategoryCardPlaceholder}
        />
      ) : (
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
      )}
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
