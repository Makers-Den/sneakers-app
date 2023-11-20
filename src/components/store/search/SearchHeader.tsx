import { theme } from "@/lib/theme";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const SEARCH_HEADER_HEIGHT = 40;

export interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  onCancel: () => void;
}

export function SearchHeader({
  query,
  onQueryChange,
  onClear,
  onCancel,
}: SearchHeaderProps) {
  const isQueryEmpty = query === "";

  return (
    <View style={styles.wrapper}>
      <Ionicons
        name="search-outline"
        size={theme.spacing(2.5)}
        color={theme.palette.gray[100]}
      />

      <TextInput
        style={styles.textInput}
        placeholderTextColor={theme.palette.gray[400]}
        onChangeText={onQueryChange}
        value={query}
        placeholder="Search"
        autoFocus
      />

      <TouchableOpacity
        activeOpacity={theme.opacity.sm}
        disabled={isQueryEmpty}
        onPress={onClear}
      >
        <Ionicons
          name="close-circle-sharp"
          size={theme.spacing(2.5)}
          color={
            isQueryEmpty ? theme.palette.gray[800] : theme.palette.gray[400]
          }
        />
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={theme.opacity.sm} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: SEARCH_HEADER_HEIGHT,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.gray[800],
    gap: theme.spacing(2),
  },
  textInput: {
    flexGrow: 1,
    color: theme.palette.gray[100],
  },
  cancelText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
