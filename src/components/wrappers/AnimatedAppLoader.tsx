import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { theme } from "@/lib/theme";
import WhiteSneaker from "../svg/WhiteSneaker";

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

const endOpacity = 1;

function AnimatedSplashScreen({
  children,
  image,
}: {
  children: ReactNode;
  image: { uri: string };
}) {
  const [isAppReady, setAppReady] = useState(false);

  const { width, height } = useWindowDimensions();

  const textOpacity = useSharedValue(0);

  const scale = useSharedValue(0);

  const onImageLoaded = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff

      scale.value = withTiming(100, {
        duration: 2000,
        easing: Easing.cubic,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      textOpacity.value = withTiming(endOpacity, {
        duration: 500,
        easing: Easing.cubic,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (e) {
      // handle errors
    } finally {
      setAppReady(true);
    }
  }, []);

  const wrapperStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: 10,
      width,
      height,
      transform: [{ scale: scale.value }],
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!isAppReady && (
        <Animated.View
          exiting={FadeOut}
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              width: "100%",
              height: "100%",
              backgroundColor:
                Constants?.expoConfig?.splash?.backgroundColor || "#fff",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              zIndex: 10,
            },
          ]}
        >
          <Animated.View style={[wrapperStyles]}>
            <WhiteSneaker
              width={"100%"}
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>
          <Animated.Image
            style={{
              width,
              height,
              resizeMode:
                Constants?.expoConfig?.splash?.resizeMode || "contain",
            }}
            source={image}
            onLoadEnd={onImageLoaded}
          />

          <Animated.Text
            style={{
              opacity: textOpacity,
              position: "absolute",
              zIndex: 20,
              fontSize: 40,
              color: theme.palette.gray[900],
              fontWeight: theme.typography.fontWeight.bold,
            }}
          >
            Sneakers
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
}

// const styles = StyleSheet.create({
//   wrapper: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: Constants?.expoConfig?.splash?.backgroundColor || "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: Constants?.expoConfig?.splash?.resizeMode || "contain",
//   },
//   icon: {
//     width: "100%",
//     height: "100%",
//   },
// });
