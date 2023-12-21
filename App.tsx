import { QueryClientProvider } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from '@/Navigation';
import { queryClient } from '@/lib/query';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/lib/theme';
import * as Notifications from 'expo-notifications';
import { createNamedLogger } from '@/lib/log';
import { registerForPushNotificationsAsync } from '@/lib/notification';
import ErrorBoundary from 'react-native-error-boundary';
import { FallbackView } from '@/components/ui/FallbackView';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedAppLoader } from '@/components/wrappers/AnimatedAppLoader';

const logger = createNamedLogger('App');

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
        uri: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/splash.png?raw=true',
      }}
    >
      <MainScreen />
    </AnimatedAppLoader>
  );
}

function MainScreen() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    registerForPushNotificationsAsync().catch(error =>
      logger.error('Register push notifications failed', error)
    );
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync().catch(error =>
      logger.error('Hide splash screen failed', error)
    );
  }, [lastNotificationResponse]);

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <ErrorBoundary
        FallbackComponent={FallbackView}
        onError={e => {
          logger.error('Error Boundary ', e, 'Stack ', e.stack);
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
