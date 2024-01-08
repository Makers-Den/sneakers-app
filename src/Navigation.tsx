import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  MainTabParamList,
  MainScreen,
  ShoppingScreen,
  ShoppingStackParamList,
  RootStackParamList,
  RootScreen,
} from '@/types/navigation';
import { ShoesListScreen } from '@/screens/ShoesListScreen';
import { ShoesDetailsScreen } from '@/screens/ShoesDetailsScreen';
import { ShoesSearchScreen } from '@/screens/ShoesSearchScreen';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { createNamedLogger } from './lib/log';
import { notificationDataSchema } from './lib/notification';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from './lib/theme';
import { MemoDiscoverScreen } from './screens/DiscoverScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlogPostScreen } from './screens/BlogPostScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { StoriesScreen } from './screens/StoriesScreen';

const logger = createNamedLogger('Navigation');

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={RootScreen.Main}>
        <RootStack.Screen
          name={RootScreen.Main}
          component={MainNavigation}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name={RootScreen.Story}
          component={StoriesScreen}
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigation() {
  const ScreensWithoutNavigation = [
    MainScreen.BlogPostScreen,
    MainScreen.CategoryScreen,
  ];
  return (
    <>
      <NotificationNavigator />

      <Tab.Navigator
        initialRouteName={MainScreen.ShoppingScreens}
        sceneContainerStyle={{ backgroundColor: theme.palette.gray[900] }}
        backBehavior="history"
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: theme.palette.gray[900],
            zIndex: 100,
          },
          tabBarItemStyle: {
            display: ScreensWithoutNavigation.includes(route.name)
              ? 'none'
              : 'flex',
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === MainScreen.ShoppingScreens) {
              return (
                <Ionicons name={'home-outline'} size={size} color={color} />
              );
            } else if (route.name === MainScreen.DiscoverScreen) {
              return (
                <Ionicons name={'compass-outline'} size={size} color={color} />
              );
            }
          },
        })}
      >
        <Tab.Screen
          name={MainScreen.ShoppingScreens}
          options={{ headerShown: false }}
          component={ShoppingNavigation}
        />
        <Tab.Screen
          name={MainScreen.DiscoverScreen}
          options={{ headerShown: false }}
          component={MemoDiscoverScreen}
        />
        <Tab.Screen
          name={MainScreen.BlogPostScreen}
          options={{ headerShown: false }}
          component={BlogPostScreen}
        />
        <Tab.Screen
          name={MainScreen.CategoryScreen}
          options={{ headerShown: false }}
          component={CategoryScreen}
        />
      </Tab.Navigator>
    </>
  );
}

const Stack = createNativeStackNavigator<ShoppingStackParamList>();

function ShoppingNavigation() {
  return (
    <Stack.Navigator initialRouteName={ShoppingScreen.ShoesList}>
      <Stack.Screen
        component={ShoesListScreen}
        name={ShoppingScreen.ShoesList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ShoppingScreen.ShoesDetails}
        component={ShoesDetailsScreen}
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={ShoppingScreen.ShoesSearch}
        component={ShoesSearchScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}

export function NotificationNavigator() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const navigation =
    useNavigation<NavigationProp<MainTabParamList & ShoppingStackParamList>>();

  useEffect(() => {
    if (!lastNotificationResponse) {
      return;
    }

    const parseNotificationDataResult = notificationDataSchema.safeParse(
      lastNotificationResponse.notification.request.content.data
    );

    if (!parseNotificationDataResult.success) {
      logger.error(
        'Parse notification data failed',
        parseNotificationDataResult.error
      );

      return;
    }

    switch (parseNotificationDataResult.data.type) {
      case 'ShoesDropped':
        navigation.navigate(ShoppingScreen.ShoesDetails, {
          shoesId: parseNotificationDataResult.data.shoesId,
        });
        break;
    }
  }, [lastNotificationResponse]);

  return null;
}
