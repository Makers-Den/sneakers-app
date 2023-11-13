import { StyleSheet, Text, View } from "react-native";
import {
  TabBar as BaseTabBar,
  Route,
  TabBarProps as BaseTabBarProps,
} from "react-native-tab-view";

export function TabBar<T extends Route>(props: BaseTabBarProps<T>) {
  return (
    <View style={styles.wrapper}>
      <BaseTabBar
        {...props}
        style={styles.tabBar}
        tabStyle={styles.tab}
        indicatorStyle={styles.indicator}
        activeColor="red"
        pressColor="transparent"
        inactiveColor="black"
      />

      <View style={styles.searchWrapper}>
        <Text>Search</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tabBar: {
    flexGrow: 1,
    flexShrink: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    shadowColor: "transparent",
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 0,
  },
  indicator: {
    backgroundColor: "red",
  },
  tab: {
    width: "auto",
  },
  searchWrapper: {
    flexGrow: 0,
    flexShrink: 1,
  },
});
