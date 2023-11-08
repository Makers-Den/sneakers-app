import { Button, View, Text } from "react-native";
import { BaseScreenProps, Screen } from "../types/navigation";

export function ProductDetailsScreen({ navigation }: BaseScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Product List Screen</Text>

      <Button
        title="Go Back"
        onPress={() => navigation.navigate(Screen.ProductList)}
      />
    </View>
  );
}
