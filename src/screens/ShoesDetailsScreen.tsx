import {
  Button,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import RenderHtml from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, Screen } from "@/types/navigation";
import { useQuery } from "react-query";
import { getShoesById } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";

export function ShoesDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, Screen.ShoesDetails>) {
  const { width } = useWindowDimensions();
  const { shoesId } = route.params;
  const shoesQuery = useQuery({
    queryFn: ({ signal }) => getShoesById({ shoesId, signal }),
    queryKey: queryKeys.shoes.detail({ shoesId }),
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Product Details Screen</Text>

          {shoesQuery.data && (
            <View>
              <Text>{shoesQuery.data.model}</Text>

              <RenderHtml
                contentWidth={width}
                source={{ html: shoesQuery.data.descriptionHtml }}
              />
            </View>
          )}

          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
