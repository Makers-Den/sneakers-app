import { theme } from "@/lib/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  TabBar as BaseTabBar,
  Route,
  TabBarProps as BaseTabBarProps,
} from "react-native-tab-view";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface TabBarProps<T extends Route> extends BaseTabBarProps<T> {
  onSearchPress: () => void;
}

export function TabBar<T extends Route>({
  onSearchPress,
  ...tabBarProps
}: TabBarProps<T>) {
  return (
    <View style={styles.wrapper}>
      <BaseTabBar
        {...tabBarProps}
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

      <TouchableOpacity
        style={styles.searchWrapper}
        activeOpacity={theme.opacity.sm}
        onPress={onSearchPress}
      >
        <Ionicons
          name="search-outline"
          size={theme.spacing(2.5)}
          color={theme.palette.gray[100]}
        />
      </TouchableOpacity>
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
