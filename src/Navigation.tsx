import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, Screen } from "./types/navigation";
import { SneakersListScreen } from "./screens/SneakersListScreen";
import { SneakersDetailsScreen } from "./screens/SneakersDetailsScreen";
import { SneakersSeachScreen } from "./screens/SneakersSearchScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Screen.SneakersList}>
        <Stack.Screen
          name={Screen.SneakersList}
          component={SneakersListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={Screen.SneakersDetails}
          component={SneakersDetailsScreen}
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name={Screen.SneakersSearch}
          component={SneakersSeachScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
