import { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Route, TabBarProps, TabView } from "react-native-tab-view";
import { RootStackParamList, Screen } from "@/types/navigation";
import { MemoFeedShoesView } from "@/components/store/feed/FeedShoesView";
import { MemoInStockShoesView } from "@/components/store/in-stock/InStockShoesView";
import { MemoUpcomingShoesView } from "@/components/store/upcoming/UpcomingShoesView";
import { TabBar } from "@/components/store/TabBar";
import { theme } from "@/lib/theme";

enum ShoesListScreenTab {
  FEED = "Feed",
  IN_STOCK = "InStock",
  UPCOMING = "Upcoming",
}

const routes = [
  { key: ShoesListScreenTab.FEED, title: "Feed" },
  { key: ShoesListScreenTab.IN_STOCK, title: "In Stock" },
  { key: ShoesListScreenTab.UPCOMING, title: "Upcoming" },
];

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
      <TabView
        lazy={({ route }) => route.key !== ShoesListScreenTab.FEED}
        navigationState={{ index, routes }}
        renderLazyPlaceholder={renderLazyPlaceholder}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
  },
});
