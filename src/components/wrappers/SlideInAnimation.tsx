import { useFocusEffect } from "@react-navigation/native";
import { ReactNode } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Easing,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSharedProps } from "react-native-render-html";

export type SlideInAnimationProps = {
  children: ReactNode;
};

const windowDimension = Dimensions.get("window");

const slideOutValues = {
  opacity: 0,
  translateY: windowDimension.height,
};

const slideInValues = {
  opacity: 1,
  translateY: 0,
};

export function SlideInAnimation({ children }: SlideInAnimationProps) {
  const animationValues = useSharedValue({
    opacity: 0,
    translateY: windowDimension.height,
  });
  useFocusEffect(() => {
    animationValues.value = slideInValues;
    return () => {
      animationValues.value = slideOutValues;
    };
  });

  const animatedStyles = useAnimatedStyle(() => ({
    flex: 1,
    transform: [
      {
        translateY: withTiming(animationValues.value.translateY, {
          easing: Easing.inOut(Easing.quad),
          duration: 400,
        }),
      },
    ],
    opacity: withTiming(animationValues.value.opacity, {
      easing: Easing.inOut(Easing.quad),
      duration: 400,
    }),
  }));
  return (
    <Animated.View exiting={FadeOutDown} style={animatedStyles}>
      {children}
    </Animated.View>
  );
}
