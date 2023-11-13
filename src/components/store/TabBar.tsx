import { theme } from "@/lib/theme";
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
        indicatorStyle={styles.tabIndicator}
        activeColor={theme.palette.gray[100]}
        pressColor="transparent"
        inactiveColor={theme.palette.gray[400]}
        gap={theme.spacing(3)}
        renderLabel={({ route, color }) => (
          <Text style={[styles.tabLabel, { color }]}>{route.title}</Text>
        )}
      />

      <View style={styles.searchWrapper}>
        <Text style={styles.searchText}>Search</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.gray[800],
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 1,
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
  tabIndicator: {
    backgroundColor: theme.palette.green[400],
  },
  tab: {
    width: "auto",
    padding: 0,
  },
  tabLabel: {
    fontSize: theme.typography.fontSize.base,
  },
  searchWrapper: {
    flexGrow: 0,
    flexShrink: 1,
  },
  searchText: {
    color: theme.palette.gray[100],
  },
});
