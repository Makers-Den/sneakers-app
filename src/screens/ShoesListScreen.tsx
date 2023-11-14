import { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
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

  const renderScene = useMemo(() => {
    return ({ route }: { route: { key: ShoesListScreenTab } }) => {
      switch (route.key) {
        case ShoesListScreenTab.FEED:
          return <MemoFeedShoesView navigation={navigation} />;
        case ShoesListScreenTab.IN_STOCK:
          return <MemoInStockShoesView navigation={navigation} />;
        case ShoesListScreenTab.UPCOMING:
          return <MemoUpcomingShoesView navigation={navigation} />;
        default:
          return null;
      }
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={TabBar}
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
