import { Button, Text, View } from "react-native";
import { RootStackParamList, Screen } from "../types/navigation";
import { useQuery } from "react-query";
import { getSneakersByCollectionId } from "../lib/shopify";
import { queryKeys } from "../lib/query";
import { envVariables } from "../lib/env";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export function SneakersListScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, Screen.SneakersList>) {
  const feedSneakersQuery = useQuery({
    queryFn: () =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.feed,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.feed,
    }),
  });

  const inStockSneakersQuery = useQuery({
    queryFn: () =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.inStock,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.inStock,
    }),
  });

  const upcomingSneakersQuery = useQuery({
    queryFn: () =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.upcoming,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.upcoming,
    }),
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Feed:</Text>
      {feedSneakersQuery.data?.map((sneakers) => (
        <View>
          <Text key={sneakers.id}>{sneakers.model}</Text>
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

      <Text>In Stock:</Text>
      {inStockSneakersQuery.data?.map((sneakers) => (
        <View>
          <Text key={sneakers.id}>{sneakers.model}</Text>
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

      <Text>Upcoming:</Text>
      {upcomingSneakersQuery.data?.map((sneakers) => (
        <View>
          <Text key={sneakers.id}>{sneakers.model}</Text>
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
