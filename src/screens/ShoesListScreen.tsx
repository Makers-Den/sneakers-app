import React, { useMemo, useState } from 'react';
import { StyleSheet, useWindowDimensions, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Route, TabBarProps, TabView } from 'react-native-tab-view';
import { RootStackParamList, Screen } from '@/types/navigation';
import { MemoFeedShoesView } from '@/components/store/feed/FeedShoesView';
import { MemoInStockShoesView } from '@/components/store/in-stock/InStockShoesView';
import { MemoUpcomingShoesView } from '@/components/store/upcoming/UpcomingShoesView';
import { TabBar } from '@/components/store/TabBar';
import { theme } from '@/lib/theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

enum ShoesListScreenTab {
  FEED = 'Feed',
  IN_STOCK = 'InStock',
  UPCOMING = 'Upcoming',
}

const routes = [
  { key: ShoesListScreenTab.FEED, title: 'Feed' },
  { key: ShoesListScreenTab.IN_STOCK, title: 'In Stock' },
  { key: ShoesListScreenTab.UPCOMING, title: 'Upcoming' },
];

const Tab = createBottomTabNavigator();

export function ShoesListScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, Screen.ShoesList>) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderLazyPlaceholder = useMemo(() => {
    return ({ route }: { route: { key: ShoesListScreenTab } }) => {
      switch (route.key) {
        case ShoesListScreenTab.IN_STOCK:
          return <MemoInStockShoesView isLazy navigation={navigation} />;
        case ShoesListScreenTab.UPCOMING:
          return <MemoUpcomingShoesView isLazy navigation={navigation} />;
        default:
          return null;
      }
    };
  }, [navigation]);

  const renderScene = useMemo(() => {
    return ({ route }: { route: { key: ShoesListScreenTab } }) => {
      switch (route.key) {
        case ShoesListScreenTab.FEED:
          return <MemoFeedShoesView navigation={navigation} />;
        case ShoesListScreenTab.IN_STOCK:
          return (
            <MemoInStockShoesView isLazy={false} navigation={navigation} />
          );
        case ShoesListScreenTab.UPCOMING:
          return (
            <MemoUpcomingShoesView isLazy={false} navigation={navigation} />
          );
        default:
          return null;
      }
    };
  }, [navigation]);

  const renderTabBar = useMemo(() => {
    return (props: TabBarProps<Route>) => (
      <TabBar
        onSearchPress={() => navigation.navigate(Screen.ShoesSearch)}
        {...props}
      />
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: theme.palette.gray[900],
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return (
                <Ionicons name={'home-outline'} size={size} color={color} />
              );
            } else if (route.name === 'Discovery') {
              return (
                <Ionicons name={'compass-outline'} size={size} color={color} />
              );
            }
          },
        })}
      >
        <Tab.Screen name="Home" options={{ headerShown: false }}>
          {() => (
            <TabView
              lazy={({ route }) => route.key !== ShoesListScreenTab.FEED}
              navigationState={{ index, routes }}
              renderLazyPlaceholder={renderLazyPlaceholder}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderTabBar={renderTabBar}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Discovery" options={{ headerShown: false }}>
          {() => <Text>SHhhYeah!</Text>}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
  },
});
