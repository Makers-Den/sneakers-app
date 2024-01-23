import { Stories } from "@/components/blog/stories/Stories";
import { queryKeys } from "@/lib/query";
import { getStoryQuery } from "@/lib/shopify";
import { theme } from "@/lib/theme";
import { RootScreen, RootScreensProps } from "@/types/navigation";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useQuery } from "react-query";

export function StoriesScreen({
  route,
  navigation,
}: RootScreensProps<RootScreen.Story>) {
  const storiesQuery = useQuery({
    queryFn: ({ signal }) =>
      getStoryQuery({
        id: route.params.id,
        signal,
      }),
    queryKey: queryKeys.stories.detail({
      id: route.params.id,
    }),
  });

  const stories = useMemo(() => {
    if (!storiesQuery.data) {
      return [];
    }

    return storiesQuery.data.videos;
  }, [storiesQuery.data]);

  return (
    <>
      {storiesQuery.isLoading ? (
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={theme.palette.gray[400]} />
        </View>
      ) : (
        <Stories stories={stories} navigation={navigation} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    backgroundColor: theme.palette.gray[900],
    flex: 1,
    justifyContent: "center",
  },
});
