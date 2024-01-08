import { useFocusEffect } from "@react-navigation/native";
import { ReactNode } from "react";
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type FadeInAnimationProps = {
  children: ReactNode;
};

const slideOutValues = {
  opacity: 0,
};

const slideInValues = {
  opacity: 1,
};

export function FadeInAnimation({ children }: FadeInAnimationProps) {
  const animationValues = useSharedValue({
    opacity: 0,
  });
  useFocusEffect(() => {
    animationValues.value = slideInValues;
    return () => {
      animationValues.value = slideOutValues;
    };
  });

  const animatedStyles = useAnimatedStyle(() => ({
    flex: 1,

    opacity: withTiming(animationValues.value.opacity, {
      easing: Easing.inOut(Easing.quad),
      duration: 400,
    }),
  }));
  return (
    <Animated.View exiting={FadeOut} style={animatedStyles}>
      {children}
    </Animated.View>
  );
}
