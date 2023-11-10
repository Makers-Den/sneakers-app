import { Button, Text, View, TextInput } from "react-native";
import { RootStackParamList, Screen } from "../types/navigation";
import { useQuery } from "react-query";
import { searchSneakers } from "../lib/shopify";
import { queryKeys } from "../lib/query";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function SneakersSeachScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, Screen.SneakersSearch>) {
  // @TODO Add debounce
  const [query, setQuery] = useState("");
  const searchSneakersQuery = useQuery({
    queryFn: ({ signal }) =>
      searchSneakers({
        query,
        signal,
      }),
    queryKey: queryKeys.sneakers.search({
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
        {searchSneakersQuery.data?.map((sneakers) => (
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

        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}
