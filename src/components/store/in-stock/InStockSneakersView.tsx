import { Button, Text, View } from "react-native";
import { useQuery } from "react-query";
import { getSneakersByCollectionId } from "@/lib/shopify";
import { envVariables } from "@/lib/env";
import { queryKeys } from "@/lib/query";
import { Navigation, Screen } from "@/types/navigation";
import { memo } from "react";

const SNEAKERS_IMAGE_MAX_WIDTH = 352;
const SNEAKERS_IMAGE_MAX_HEIGHT = 340;

export interface InStockSneakersViewProps {
  navigation: Navigation;
}

export function InStockSneakersView({ navigation }: InStockSneakersViewProps) {
  const inStockSneakersQuery = useQuery({
    queryFn: ({ signal }) =>
      getSneakersByCollectionId({
        collectionId: envVariables.shopify.collectionId.inStock,
        maxImageHeight: SNEAKERS_IMAGE_MAX_WIDTH,
        maxImageWidth: SNEAKERS_IMAGE_MAX_HEIGHT,
        signal,
      }),
    queryKey: queryKeys.sneakers.list({
      collectionId: envVariables.shopify.collectionId.inStock,
      maxImageHeight: SNEAKERS_IMAGE_MAX_WIDTH,
      maxImageWidth: SNEAKERS_IMAGE_MAX_HEIGHT,
    }),
  });

  return (
    <View>
      <Text>In stock sneakers view!</Text>
      {inStockSneakersQuery.data?.map((sneakers) => (
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

export const MemoInStockSneakersView = memo(InStockSneakersView);
