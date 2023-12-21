import { theme } from "@/lib/theme";
import { DimensionValue } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

export type PlaceholderLoadingProps = {
  width?: DimensionValue;
  height?: DimensionValue;
};

export function PlaceholderLoading({ height, width }: PlaceholderLoadingProps) {
  const time = useSharedValue(0);
  useFrameCallback((frameInfo) => {
    time.value = Math.sin(frameInfo.timestamp / 300);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        time.value,
        [0, 1],
        [theme.palette.gray[700], theme.palette.gray[900]]
      ),
    };
  });
  return (
    <Animated.View
      style={[
        {
          width,
          height,
        },
        animatedStyle,
      ]}
    />
  );
}
