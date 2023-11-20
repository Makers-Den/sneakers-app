import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, Screen } from "@/types/navigation";
import { ShoesListScreen } from "@/screens/ShoesListScreen";
import { ShoesDetailsScreen } from "@/screens/ShoesDetailsScreen";
import { ShoesSearchScreen } from "@/screens/ShoesSearchScreen";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { createNamedLogger } from "./lib/log";
import { notificationDataSchema } from "./lib/notification";

const logger = createNamedLogger("Navigation");

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Navigation() {
  return (
    <NavigationContainer>
      <NotificationNavigator />
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

export function NotificationNavigator() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
        navigation.navigate(Screen.ShoesDetails, {
          shoesId: parseNotificationDataResult.data.shoesId,
        });
        break;
    }
  }, [lastNotificationResponse]);

  return null;
}
