import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "@/lib/theme";
import { FlashList } from "@shopify/flash-list";

const SEARCH_RECENT_ITEM_HEIGHT = 44;

export interface SearchRecentProps {
  recentSearches: string[];
  onClear: () => void;
  onRecentSearchPress: (recentSearch: string) => void;
}

export function SearchRecent({
  recentSearches,
  onClear,
  onRecentSearchPress,
}: SearchRecentProps) {
  const windowDimensions = useWindowDimensions();

  return (
    <FlashList
      data={recentSearches}
      estimatedItemSize={SEARCH_RECENT_ITEM_HEIGHT}
      estimatedListSize={{
        width: windowDimensions.width,
        height: recentSearches.length * (SEARCH_RECENT_ITEM_HEIGHT + 1),
      }}
      ListHeaderComponent={<SearchRecentHeader onClear={onClear} />}
      renderItem={({ item: recentSearch }) => (
        <SearchRecentItem
          recentSearch={recentSearch}
          onPress={() => onRecentSearchPress(recentSearch)}
        />
      )}
    />
  );
}

interface SearchRecentHeaderProps {
  onClear: () => void;
}

function SearchRecentHeader({ onClear }: SearchRecentHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.heading}>Recent Searches</Text>
      <TouchableOpacity activeOpacity={theme.opacity.sm} onPress={onClear}>
        <Ionicons
          name="close-circle-sharp"
          size={theme.spacing(2.5)}
          color={theme.palette.gray[100]}
        />
      </TouchableOpacity>
    </View>
  );
}

interface SearchRecentItemProps {
  recentSearch: string;
  onPress: () => void;
}

function SearchRecentItem({ recentSearch, onPress }: SearchRecentItemProps) {
  return (
    <TouchableOpacity
      style={styles.listItem}
      activeOpacity={theme.opacity.sm}
      onPress={onPress}
    >
      <Text style={styles.listText}>{recentSearch}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
    fontWeight: "500",
  },
  listItem: {
    minHeight: SEARCH_RECENT_ITEM_HEIGHT,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  listText: {
    fontSize: theme.typography.fontSize.base,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    color: theme.palette.gray[400],
  },
});
