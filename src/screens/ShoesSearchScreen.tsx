import {
  View,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootScreen, RootScreensProps } from "@/types/navigation";
import { searchShoes } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";
import { theme } from "@/lib/theme";
import { SearchHeader } from "@/components/store/search/SearchHeader";
import { FlashList } from "@shopify/flash-list";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SEARCH_SHOES_CARD_HEIGHT,
  SEARCH_SHOES_IMAGE_HEIGHT,
  SEARCH_SHOES_IMAGE_WIDTH,
  SearchShoesCard,
} from "@/components/store/search/SearchShoesCard";
import {
  SHOES_LIST_ITEM_SEPARATOR_HEIGHT,
  ShoesListItemSeparator,
} from "@/components/store/ShoesListItemSeparator";
import { SearchNoResults } from "@/components/store/search/SearchNoResults";
import { SearchRecent } from "@/components/store/search/SearchRecent";
import {
  appendRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from "@/lib/storage";

function estimateListHeight(listItemCount: number) {
  return (
    SEARCH_SHOES_CARD_HEIGHT * listItemCount +
    Math.max(0, listItemCount - 1) * SHOES_LIST_ITEM_SEPARATOR_HEIGHT
  );
}

export function ShoesSearchScreen({
  navigation,
}: RootScreensProps<RootScreen.ShoesSearch>) {
  const queryClient = useQueryClient();
  const windowDimensions = useWindowDimensions();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const isDebouncedQueryEmpty = debouncedQuery.trim() === "";

  const searchShoesQuery = useQuery({
    queryFn: ({ signal }) =>
      searchShoes({
        query: debouncedQuery,
        maxImageWidth: SEARCH_SHOES_IMAGE_WIDTH,
        maxImageHeight: SEARCH_SHOES_IMAGE_HEIGHT,
        signal,
      }),
    queryKey: queryKeys.shoes.search({
      query: debouncedQuery,
      maxImageWidth: SEARCH_SHOES_IMAGE_WIDTH,
      maxImageHeight: SEARCH_SHOES_IMAGE_HEIGHT,
    }),
    enabled: !isDebouncedQueryEmpty,
  });

  const recentSearchesQuery = useQuery({
    queryFn: getRecentSearches,
    queryKey: queryKeys.shoes.recentSearches(),
  });

  const appendRecentSearchMutation = useMutation({
    mutationFn: appendRecentSearch,
    onSuccess: () =>
      queryClient.invalidateQueries(queryKeys.shoes.recentSearches()),
  });

  const clearRecentSearchesMutation = useMutation({
    mutationFn: clearRecentSearches,
    onSuccess: () =>
      queryClient.invalidateQueries(queryKeys.shoes.recentSearches()),
  });

  const reversedRecentSearches = useMemo(
    () =>
      recentSearchesQuery.data ? [...recentSearchesQuery.data].reverse() : [],
    [recentSearchesQuery.data]
  );

  useEffect(() => {
    if (isDebouncedQueryEmpty) {
      return;
    }

    appendRecentSearchMutation.mutate({ recentSearch: debouncedQuery });
  }, [
    debouncedQuery,
    isDebouncedQueryEmpty,
    appendRecentSearchMutation.mutate,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchHeader
        query={query}
        onCancel={navigation.goBack}
        onClear={() => setQuery("")}
        onQueryChange={(query) => setQuery(query)}
      />

      {searchShoesQuery.isLoading && (
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={theme.palette.gray[400]} />
        </View>
      )}

      {!isDebouncedQueryEmpty &&
        !searchShoesQuery.isLoading &&
        (!searchShoesQuery.data || searchShoesQuery.data?.length === 0) && (
          <View style={styles.noResultsWrapper}>
            <SearchNoResults />
          </View>
        )}

      {isDebouncedQueryEmpty && reversedRecentSearches.length > 0 && (
        <SearchRecent
          recentSearches={reversedRecentSearches}
          onClear={clearRecentSearchesMutation.mutate}
          onRecentSearchPress={(recentSearch) => setQuery(recentSearch)}
        />
      )}

      {searchShoesQuery.data && searchShoesQuery.data.length > 0 && (
        <FlashList
          data={searchShoesQuery.data}
          estimatedItemSize={SEARCH_SHOES_CARD_HEIGHT}
          estimatedListSize={{
            width: windowDimensions.width,
            height: estimateListHeight(searchShoesQuery.data.length),
          }}
          renderItem={({ item: shoes }) => (
            <SearchShoesCard
              image={shoes.previewImage}
              model={shoes.model}
              modelVariant={shoes.modelVariant}
              onPress={() =>
                navigation.navigate(RootScreen.ShoesDetails, {
                  shoesId: shoes.id,
                })
              }
            />
          )}
          ItemSeparatorComponent={ShoesListItemSeparator}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.gray[800],
  },
  activityIndicatorWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  noResultsWrapper: {
    flex: 1,
    justifyContent: "center",
  },
});
