import { Stories } from "@/components/blog/stories/Stories";
import { PlaceholderLoading } from "@/components/ui/PlaceholderLoading";
import { queryKeys } from "@/lib/query";
import { getStoryQuery } from "@/lib/shopify";
import { RootScreen, RootScreensProps } from "@/types/navigation";
import { useMemo } from "react";
import { Dimensions } from "react-native";
import { useQuery } from "react-query";

const windowDimensions = Dimensions.get("window");

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
        <PlaceholderLoading
          height={windowDimensions.height}
          width={windowDimensions.width}
        />
      ) : (
        <Stories stories={stories} navigation={navigation} />
      )}
    </>
  );
}
