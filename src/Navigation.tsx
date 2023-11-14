import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, Screen } from "@/types/navigation";
import { ShoesListScreen } from "@/screens/ShoesListScreen";
import { ShoesDetailsScreen } from "@/screens/ShoesDetailsScreen";
import { ShoesSearchScreen } from "@/screens/ShoesSearchScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Screen.ShoesList}>
        <Stack.Screen
          name={Screen.ShoesList}
          component={ShoesListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Screen.ShoesDetails}
          component={ShoesDetailsScreen}
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name={Screen.ShoesSearch}
          component={ShoesSearchScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
