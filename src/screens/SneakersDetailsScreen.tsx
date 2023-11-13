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
import { getSneakersById } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";

export function SneakersDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, Screen.SneakersDetails>) {
  const { width } = useWindowDimensions();
  const { sneakersId } = route.params;
  const sneakersQuery = useQuery({
    queryFn: ({ signal }) => getSneakersById({ sneakersId, signal }),
    queryKey: queryKeys.sneakers.detail({ sneakersId }),
  });

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Product Details Screen</Text>

          {sneakersQuery.data && (
            <View>
              <Text>{sneakersQuery.data.model}</Text>

              <RenderHtml
                contentWidth={width}
                source={{ html: sneakersQuery.data.descriptionHtml }}
              />
            </View>
          )}

          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
