import { theme } from "@/lib/theme";
import { StyleSheet, View, Text } from "react-native";

export function BlogHeader() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    backgroundColor: theme.palette.gray[700],
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    color: theme.palette.gray[100],
  },
});
