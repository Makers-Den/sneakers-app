import { theme } from "@/lib/theme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface ShoesActionBarProps {
  onClose: () => void;
}

export function ShoesActionBar({ onClose }: ShoesActionBarProps) {
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
    backgroundColor: theme.palette.gray[700],
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
