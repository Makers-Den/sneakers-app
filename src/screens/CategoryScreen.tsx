import { BlogActionBar } from "@/components/blog/details/BlogActionBar";
import {
  BLOG_CARD_HEIGHT,
  BLOG_IMAGE_HEIGHT,
  BLOG_IMAGE_WIDTH,
  BlogCard,
  BlogCardPlaceholder,
} from "@/components/ui/BlogCard";
import { TwoColumnCardWrapper } from "@/components/ui/TwoColumnsCardWrapper";
import { getImageSize } from "@/lib/image";
import { queryKeys } from "@/lib/query";
import { getContentCategoryById } from "@/lib/shopify";
import { RootTabParamList, Screen } from "@/types/navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PlaceholderLoading } from "@/components/ui/PlaceholderLoading";
import { theme } from "@/lib/theme";

const BLOG_PLACEHOLDERS_TO_DISPLAY = 4;
const NUM_OF_COLUMNS = 2;
const ITEM_SEPARATOR_HEIGHT = 2;

function estimateListHeight(listItemCount: number, cardHeight: number) {
  const listRowCount = Math.floor(listItemCount / NUM_OF_COLUMNS);

  return (
    cardHeight * listRowCount +
    Math.max(0, listRowCount - 1) * ITEM_SEPARATOR_HEIGHT
  );
}

export function ItemSeparatorComponent() {
  return <View style={styles.separator} />;
}

export function CategoryScreen({
  navigation,
  route,
}: BottomTabScreenProps<RootTabParamList, Screen.CategoryScreens>) {
  const { categoryId } = route.params;
  const dimensions = Dimensions.get("window");

  const opacity = useSharedValue(0);

  const blogImage = useMemo(() => {
    return getImageSize({ height: BLOG_IMAGE_HEIGHT, width: BLOG_IMAGE_WIDTH });
  }, []);

  const categoryQuery = useQuery({
    queryFn: ({ signal }) =>
      getContentCategoryById({
        id: categoryId,
        image: {
          maxHeight: dimensions.width,
          maxWidth: dimensions.width,
        },
        blogImage: {
          maxHeight: blogImage.height,
          maxWidth: blogImage.width,
        },
        signal,
      }),
    queryKey: queryKeys.contentCategories.detail({
      id: categoryId,
      maxImageHeight: dimensions.height,
      maxImageWidth: dimensions.width,
    }),
  });

  const onImageLoadEnd = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
    });
  }, []);

  useLayoutEffect(() => {
    opacity.value = 0;
    return () => {
      opacity.value = 0;
    };
  }, [categoryId]);

  return (
    <SafeAreaView
      edges={{
        bottom: "off",
        top: "additive",
        left: "additive",
        right: "additive",
      }}
      style={styles.wrapper}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.wrapper}>
          <BlogActionBar onClose={navigation.goBack} />
          {categoryQuery.isLoading || !categoryQuery.data ? (
            <>
              <PlaceholderLoading
                width={dimensions.width}
                height={dimensions.height}
              />
              <View style={styles.list}>
                <FlashList
                  data={new Array(BLOG_PLACEHOLDERS_TO_DISPLAY).fill(null)}
                  numColumns={NUM_OF_COLUMNS}
                  estimatedItemSize={BLOG_CARD_HEIGHT}
                  estimatedListSize={{
                    width: dimensions.width,
                    height: estimateListHeight(
                      BLOG_PLACEHOLDERS_TO_DISPLAY,
                      BLOG_CARD_HEIGHT
                    ),
                  }}
                  renderItem={({ index }) => (
                    <TwoColumnCardWrapper
                      padding={ITEM_SEPARATOR_HEIGHT / 2}
                      isLeftColumn={index % 2 === 0}
                      key={index}
                    >
                      <BlogCardPlaceholder />
                    </TwoColumnCardWrapper>
                  )}
                  ItemSeparatorComponent={ItemSeparatorComponent}
                />
              </View>
            </>
          ) : (
            <>
              <Animated.Image
                source={{ uri: categoryQuery.data?.data.thumbnail }}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  opacity,
                }}
                onLoadEnd={onImageLoadEnd}
              />
              <View style={styles.list}>
                <Text style={styles.title}>
                  {categoryQuery.data.data.title}
                </Text>
                <Text style={styles.description}>
                  {categoryQuery.data.data.description}
                </Text>
                <FlashList
                  data={categoryQuery.data.content}
                  numColumns={NUM_OF_COLUMNS}
                  estimatedItemSize={BLOG_CARD_HEIGHT}
                  estimatedListSize={{
                    width: dimensions.width,
                    height: estimateListHeight(
                      BLOG_PLACEHOLDERS_TO_DISPLAY,
                      BLOG_CARD_HEIGHT
                    ),
                  }}
                  renderItem={({ item, index }) => (
                    <TwoColumnCardWrapper
                      padding={ITEM_SEPARATOR_HEIGHT / 2}
                      isLeftColumn={index % 2 === 0}
                      key={item.id}
                    >
                      <BlogCard
                        onPress={() => {
                          navigation.navigate(Screen.BlogPostScreens, {
                            blogPostId: item.id,
                          });
                        }}
                        image={item.data.thumbnail || ""}
                        title={item.data.title}
                      />
                    </TwoColumnCardWrapper>
                  )}
                  ItemSeparatorComponent={ItemSeparatorComponent}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  title: {
    color: theme.palette.gray[100],
    fontSize: theme.typography.fontSize["2xl"],
    marginBottom: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
  },
  description: {
    color: theme.palette.gray[100],
    fontSize: theme.typography.fontSize["base"],
    marginBottom: theme.spacing(4),
    paddingHorizontal: theme.spacing(2),
  },
  scrollView: {
    backgroundColor: theme.palette.gray[900],
  },
  list: {
    paddingVertical: theme.spacing(4),
  },
  separator: {
    height: ITEM_SEPARATOR_HEIGHT,
    width: "100%",
  },
});
