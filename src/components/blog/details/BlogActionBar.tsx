import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface BlogActionBarProps {
  onClose: () => void;
}

export function BlogActionBar({ onClose }: BlogActionBarProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={theme.opacity.sm}
        onPress={onClose}
      >
        <Ionicons
          name="close"
          size={theme.spacing(2.5)}
          color={theme.palette.gray[900]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "flex-end",
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
  },
  button: {
    backgroundColor: theme.palette.gray[300],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: theme.spacing(4),
  },
});
