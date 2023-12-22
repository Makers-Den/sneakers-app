import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  RootTabParamList,
  Screen,
  ShoppingScreen,
  ShoppingStackParamList,
} from "@/types/navigation";
import { ShoesListScreen } from "@/screens/ShoesListScreen";
import { ShoesDetailsScreen } from "@/screens/ShoesDetailsScreen";
import { ShoesSearchScreen } from "@/screens/ShoesSearchScreen";
import * as Notifications from "expo-notifications";
import { createContext, useEffect } from "react";
import { createNamedLogger } from "./lib/log";
import { notificationDataSchema } from "./lib/notification";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { theme } from "./lib/theme";
import { MemoDiscoverScreen } from "./screens/DiscoverScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlogPostScreen } from "./screens/BlogPostScreen";
import { de } from "date-fns/locale";

const logger = createNamedLogger("Navigation");

const Stack = createNativeStackNavigator<ShoppingStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <NotificationNavigator />

      <Tab.Navigator
        initialRouteName={Screen.ShoppingScreens}
        sceneContainerStyle={{ backgroundColor: theme.palette.gray[900] }}
        backBehavior="history"
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: theme.palette.gray[900],
          },

          tabBarIcon: ({ color, size }) => {
            if (route.name === Screen.ShoppingScreens) {
              return (
                <Ionicons name={"home-outline"} size={size} color={color} />
              );
            } else if (route.name === Screen.DiscoverScreens) {
              return (
                <Ionicons name={"compass-outline"} size={size} color={color} />
              );
            }
          },
        })}
      >
        <Tab.Screen
          name={Screen.ShoppingScreens}
          options={{ headerShown: false }}
          component={ShoppingNavigation}
        />
        <Tab.Screen
          name={Screen.DiscoverScreens}
          options={{ headerShown: false }}
          component={MemoDiscoverScreen}
        />
        <Tab.Screen
          name={Screen.BlogPostScreens}
          options={{ headerShown: false }}
          component={BlogPostScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const defaultContext = {} as Pick<
  BottomTabScreenProps<RootTabParamList, Screen.ShoppingScreens>,
  "navigation"
>;

export const ShoppingRootNavigationContext = createContext(defaultContext);

function ShoppingNavigation({
  navigation,
}: {
  navigation: BottomTabScreenProps<
    RootTabParamList,
    Screen.ShoppingScreens
  >["navigation"];
}) {
  return (
    <ShoppingRootNavigationContext.Provider value={{ navigation }}>
      <Stack.Navigator initialRouteName={ShoppingScreen.ShoesList}>
        <Stack.Screen
          component={ShoesListScreen}
          name={ShoppingScreen.ShoesList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ShoppingScreen.ShoesDetails}
          component={ShoesDetailsScreen}
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name={ShoppingScreen.ShoesSearch}
          component={ShoesSearchScreen}
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
      </Stack.Navigator>
    </ShoppingRootNavigationContext.Provider>
  );
}

export function NotificationNavigator() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const navigation =
    useNavigation<NavigationProp<RootTabParamList & ShoppingStackParamList>>();

  useEffect(() => {
    if (!lastNotificationResponse) {
      return;
    }

    const parseNotificationDataResult = notificationDataSchema.safeParse(
      lastNotificationResponse.notification.request.content.data
    );

    if (!parseNotificationDataResult.success) {
      logger.error(
        "Parse notification data failed",
        parseNotificationDataResult.error
      );

      return;
    }

    switch (parseNotificationDataResult.data.type) {
      case "ShoesDropped":
        navigation.navigate(ShoppingScreen.ShoesDetails, {
          shoesId: parseNotificationDataResult.data.shoesId,
        });
        break;
    }
  }, [lastNotificationResponse]);

  return null;
}
