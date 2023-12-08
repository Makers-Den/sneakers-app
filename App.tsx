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
import { registerForPushNotificationsAsync } from "@/lib/notification";
import ErrorBoundary from "react-native-error-boundary";
import { FallbackView } from "@/components/ui/FallbackView";

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
    registerForPushNotificationsAsync().catch((error) =>
      logger.error("Register push notifications failed", error)
    );
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch((error) =>
      logger.error("Hide splash screen failed", error)
    );
  }, [lastNotificationResponse]);

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <ErrorBoundary
        FallbackComponent={FallbackView}
        onError={(e) => {
          logger.error("Error Boundary ", e, "Stack ", e.stack);
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Navigation />
          <StatusBar style="light" backgroundColor={theme.palette.gray[800]} />
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    backgroundColor: theme.palette.gray[900],
  },
});
