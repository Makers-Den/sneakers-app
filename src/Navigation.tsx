import { NavigationContainer } from "@react-navigation/native";
import { Screen } from "./types/navigation";
import { ProductListScreen } from "./screens/ProductListScreen";
import { ProductDetailsScreen } from "./screens/ProductDetailsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Screen.ProductList}>
        <Stack.Screen
          name={Screen.ProductList}
          component={ProductListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Screen.ProductDetails}
          component={ProductDetailsScreen}
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
