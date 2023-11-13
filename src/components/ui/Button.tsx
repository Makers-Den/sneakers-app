import { theme } from "@/lib/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface ButtonProps {
  text: string;
  onPress?: () => void;
}

export function Button({ text, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={theme.opacity.sm}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.spacing(8),
    fontSize: theme.typography.fontSize.base,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.gray[100],
  },
  text: {
    color: theme.palette.gray[900],
    fontWeight: "500"
  },
});
