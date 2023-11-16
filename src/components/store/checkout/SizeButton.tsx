import { theme } from "@/lib/theme";
import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface SizeButtonProps {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}

export function SizeButton({ isSelected, label, onPress }: SizeButtonProps) {
  const prevIsSelected = useRef(isSelected);
  const selectionAnimationProgress = useSharedValue(isSelected ? 1 : 0);

  const innerWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        selectionAnimationProgress.value,
        [0, 1],
        [theme.palette.gray[800], theme.palette.gray[100]]
      ),
      borderColor: interpolateColor(
        selectionAnimationProgress.value,
        [0, 1],
        [theme.palette.gray[500], theme.palette.gray[100]]
      ),
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        selectionAnimationProgress.value,
        [0, 1],
        [theme.palette.gray[100], theme.palette.gray[900]]
      ),
    };
  });

  useEffect(() => {
    if (prevIsSelected.current === isSelected) {
      return;
    }

    if (prevIsSelected.current && !isSelected) {
      selectionAnimationProgress.value = withTiming(0);
    } else {
      selectionAnimationProgress.value = withTiming(1);
    }

    prevIsSelected.current = isSelected;
  }, [isSelected]);

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <Animated.View style={[styles.innerWrapper, innerWrapperAnimatedStyle]}>
        <Animated.Text style={[styles.text, textAnimatedStyle]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    borderRadius: theme.spacing(1),
  },
  innerWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.spacing(1),
    borderWidth: 1,
  },
  text: {
    fontSize: theme.typography.fontSize.base,
  },
});
