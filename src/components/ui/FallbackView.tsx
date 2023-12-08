import { theme } from "@/lib/theme";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "./Button";
import { SafeAreaView } from "react-native-safe-area-context";

export const FallbackView = (props: {
  error: Error;
  resetError: () => void;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>Something went wrong</Text>
        <Button onPress={props.resetError} text="Try again" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(3),
    height: "100%",
  },
  wrapper: {
    display: "flex",
    height: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: theme.typography.fontSize["2xl"],
    color: theme.palette.gray[400],
    marginBottom: theme.spacing(2),
  },
});
