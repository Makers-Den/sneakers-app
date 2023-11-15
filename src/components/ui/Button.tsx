import { theme } from "@/lib/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface ButtonProps {
  text: string;
  variant?: "contained" | "outlined";
  onPress?: () => void;
}

export function Button({ text, variant = "contained", onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "contained"
          ? styles.buttonContained
          : styles.buttonOutlined,
      ]}
      activeOpacity={theme.opacity.sm}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          variant === "contained" ? styles.textContained : styles.textOutlined,
        ]}
      >
        {text}
      </Text>
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
  },
  buttonContained: {
    backgroundColor: theme.palette.gray[100],
  },
  buttonOutlined: {
    borderWidth: 1,
    borderColor: theme.palette.gray[400],
    backgroundColor: "transparent",
  },
  text: {
    fontWeight: "500",
  },
  textContained: {
    color: theme.palette.gray[900],
  },
  textOutlined: {
    color: theme.palette.gray[100],
  },
});
