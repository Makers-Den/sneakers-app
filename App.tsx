import { QueryClientProvider } from "react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigation } from "@/Navigation";
import { queryClient } from "@/lib/query";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/lib/theme";
import * as Notifications from "expo-notifications";
import { createNamedLogger } from "@/lib/log";
import { registerForPushNotificationsAsync } from "@/lib/notification";
import ErrorBoundary from "react-native-error-boundary";
import { FallbackView } from "@/components/ui/FallbackView";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { AnimatedAppLoader } from "@/components/wrappers/AnimatedAppLoader";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const logger = createNamedLogger("App");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  return (
    <AnimatedAppLoader
      image={{
        uri: "https://cdn.shopify.com/s/files/1/0631/7998/1000/files/7fea281dfb9cbdca9b637094e64a9471.png?v=1703161758",
      }}
    >
      <MainScreen />
    </AnimatedAppLoader>
  );
}

function MainScreen() {
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
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootNavigation />
            <StatusBar
              style="light"
              backgroundColor={theme.palette.gray[800]}
            />
          </GestureHandlerRootView>
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
