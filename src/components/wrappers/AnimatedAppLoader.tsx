import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeOut, ZoomOut } from 'react-native-reanimated';

export function AnimatedAppLoader({
  children,
  image,
}: {
  children: ReactNode;
  image: { uri: string };
}) {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Asset.fromURI(image.uri).downloadAsync();

      setSplashReady(true);
    }

    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: ReactNode;
  image: { uri: string };
}) {
  const [isAppReady, setAppReady] = useState(false);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all([]);
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isAppReady && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                Constants?.expoConfig?.splash?.backgroundColor || '#fff',
            },
          ]}
          exiting={FadeOut.delay(1000).duration(500).easing(Easing.ease)}
        >
          <Animated.Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode:
                Constants?.expoConfig?.splash?.resizeMode || 'contain',
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            exiting={ZoomOut.delay(1000).duration(500).easing(Easing.ease)}
          />
        </Animated.View>
      )}
    </View>
  );
}
