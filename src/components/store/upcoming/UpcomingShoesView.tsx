import { Button, Text, View } from "react-native";
import { useQuery } from "react-query";
import { getShoesByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo } from "react";

const SHOES_IMAGE_MAX_WIDTH = 352;
const SHOES_IMAGE_MAX_HEIGHT = 340;

export interface UpcomingShoesViewProps {
  navigation: Navigation;
}

export function UpcomingShoesView({ navigation }: UpcomingShoesViewProps) {
  const upcomingShoesQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesByCollectionId({
        collectionId: envVariables.shopify.collectionId.upcoming,
        maxImageHeight: SHOES_IMAGE_MAX_WIDTH,
        maxImageWidth: SHOES_IMAGE_MAX_HEIGHT,
        signal,
      }),
    queryKey: queryKeys.shoes.list({
      collectionId: envVariables.shopify.collectionId.upcoming,
      maxImageHeight: SHOES_IMAGE_MAX_WIDTH,
      maxImageWidth: SHOES_IMAGE_MAX_HEIGHT,
    }),
  });

  return (
    <View>
      <Text>Feed shoes view!</Text>
      {upcomingShoesQuery.data?.map((shoes) => (
        <View key={shoes.id}>
          <Text>{shoes.model}</Text>
          <Button
            title="Go to Details"
            onPress={() => {
              navigation.navigate(Screen.ShoesDetails, {
                shoesId: shoes.id,
              });
            }}
          />
        </View>
      ))}
    </View>
  );
}

export const MemoUpcomingShoesView = memo(UpcomingShoesView);
