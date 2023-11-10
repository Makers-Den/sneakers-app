import { Button, Text, View } from "react-native";
import { BaseScreenProps, Screen } from "../types/navigation";
import { useQuery } from "react-query";
import { getSneakersByCollectionId } from "../lib/shopify";
import { queryKeys } from "../lib/query";
import { envVariables } from "../lib/env";

export function ProductListScreen({ navigation }: BaseScreenProps) {
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
        <Text key={sneakers.id}>{sneakers.model}</Text>
      ))}

      <Text>In Stock:</Text>
      {inStockSneakersQuery.data?.map((sneakers) => (
        <Text key={sneakers.id}>{sneakers.model}</Text>
      ))}

      <Text>Upcoming:</Text>
      {upcomingSneakersQuery.data?.map((sneakers) => (
        <Text key={sneakers.id}>{sneakers.model}</Text>
      ))}

      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate(Screen.ProductDetails);
        }}
      />
    </View>
  );
}
