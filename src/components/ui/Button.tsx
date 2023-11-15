import { theme } from "@/lib/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface ButtonProps {
  text: string;
  variant?: "contained" | "outlined";
  size?: "md" | "lg";
  onPress?: () => void;
}

export function Button({
  text,
  variant = "contained",
  size = "md",
  onPress,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "contained"
          ? styles.buttonContained
          : styles.buttonOutlined,
        size === "md" ? styles.buttonMd : styles.buttonLg,
      ]}
      activeOpacity={theme.opacity.sm}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          variant === "contained" ? styles.textContained : styles.textOutlined,
          size === "md" ? styles.textMd : styles.textLg,
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
  buttonMd: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  buttonLg: {
    fontSize: theme.typography.fontSize.lg,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
  },
  text: {
    textAlign: "center",
    fontWeight: "500",
  },
  textMd: {
    fontSize: theme.typography.fontSize.base,
  },
  textLg: {
    fontSize: theme.typography.fontSize.base,
  },
  textContained: {
    color: theme.palette.gray[900],
  },
  textOutlined: {
    color: theme.palette.gray[100],
  },
});
