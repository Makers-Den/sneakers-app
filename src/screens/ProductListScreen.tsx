import { Button, Text, View } from "react-native";
import { BaseScreenProps, Screen } from "../types/navigation";

export function ProductListScreen({ navigation }: BaseScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Product List Screen</Text>

      <Button
        title="Go to Details"
        onPress={() => navigation.navigate(Screen.ProductDetails)}
      />
    </View>
  );
}
