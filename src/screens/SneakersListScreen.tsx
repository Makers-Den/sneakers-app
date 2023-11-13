import { useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import { RootStackParamList, Screen } from "@/types/navigation";
import { MemoFeedSneakersView } from "@/components/store/feed/FeedSneakersView";
import { MemoInStockSneakersView } from "@/components/store/in-stock/InStockSneakersView";
import { MemoUpcomingSneakersView } from "@/components/store/upcoming/UpcomingSneakersView";
import { TabBar } from "@/components/store/TabBar";
import { theme } from "@/lib/theme";

enum SneakersListScreenTab {
  FEED = "Feed",
  IN_STOCK = "InStock",
  UPCOMING = "Upcoming",
}

const routes = [
  { key: SneakersListScreenTab.FEED, title: "Feed" },
  { key: SneakersListScreenTab.IN_STOCK, title: "In Stock" },
  { key: SneakersListScreenTab.UPCOMING, title: "Upcoming" },
];

export function SneakersListScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, Screen.SneakersList>) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = useMemo(() => {
    return ({ route }: { route: { key: SneakersListScreenTab } }) => {
      switch (route.key) {
        case SneakersListScreenTab.FEED:
          return <MemoFeedSneakersView navigation={navigation} />;
        case SneakersListScreenTab.IN_STOCK:
          return <MemoInStockSneakersView navigation={navigation} />;
        case SneakersListScreenTab.UPCOMING:
          return <MemoUpcomingSneakersView navigation={navigation} />;
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
    backgroundColor: theme.palette.gray[900]
  },
});
