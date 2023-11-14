import { Button, Text, View, TextInput } from "react-native";
import { useQuery } from "react-query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, Screen } from "@/types/navigation";
import { searchShoes } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";

export function ShoesSearchScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, Screen.ShoesSearch>) {
  // @TODO Add debounce
  const [query, setQuery] = useState("");
  const searchShoesQuery = useQuery({
    queryFn: ({ signal }) =>
      searchShoes({
        query,
        signal,
      }),
    queryKey: queryKeys.shoes.search({
      query,
    }),
    enabled: query.trim() !== "",
  });

  return (
    <SafeAreaView>
      <View>
        <TextInput
          style={{
            borderColor: "black",
            borderWidth: 1,
            width: 200,
          }}
          onChangeText={setQuery}
          value={query}
        />

        <Text>Results:</Text>
        {searchShoesQuery.data?.map((shoes) => (
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

        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}
