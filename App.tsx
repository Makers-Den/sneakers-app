import { QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "@/Navigation";
import { queryClient } from "@/lib/query";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/lib/theme";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { createNamedLogger } from "@/lib/log";
import { StyleSheet } from "react-native";

const logger = createNamedLogger("App");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    SplashScreen.hideAsync().catch((error) =>
      logger.error("Hide splash screen failed", error)
    );
  }, [lastNotificationResponse]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={styles.safeAreaProvider}>
        <Navigation />
      </SafeAreaProvider>

      <StatusBar style="light" backgroundColor={theme.palette.gray[800]} />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    backgroundColor: theme.palette.gray[900],
  },
});
