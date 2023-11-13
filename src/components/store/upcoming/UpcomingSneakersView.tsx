import { Button, Text, View } from "react-native";
import { useQuery } from "react-query";
import { getSneakersByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo } from "react";

export interface UpcomingSneakersViewProps {
  navigation: Navigation;
}

export function UpcomingSneakersView({
  navigation,
}: UpcomingSneakersViewProps) {
  const upcomingSneakersQuery = useQuery({
    queryFn: ({ signal }) =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.upcoming,
        signal,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.upcoming,
    }),
  });

  return (
    <View>
      <Text>Feed sneakers view!</Text>
      {upcomingSneakersQuery.data?.map((sneakers) => (
        <View key={sneakers.id}>
          <Text>{sneakers.model}</Text>
          <Button
            title="Go to Details"
            onPress={() => {
              navigation.navigate(Screen.SneakersDetails, {
                sneakersId: sneakers.id,
              });
            }}
          />
        </View>
      ))}
    </View>
  );
}

export const MemoUpcomingSneakersView = memo(UpcomingSneakersView);
