import { theme } from "@/lib/theme";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface ShoesCarouselPaginationProps {
  activeItemIndex: number;
  itemCount: number;
}

export function ShoesCarouselPagination({
  activeItemIndex,
  itemCount,
}: ShoesCarouselPaginationProps) {
  return (
    <View style={styles.pagination}>
      {new Array(itemCount).fill(null).map((_, index) => (
        <ShoesCarouselPaginationItem
          key={index}
          isActive={index === activeItemIndex}
        />
      ))}
    </View>
  );
}

interface ShoesCarouselPaginationItemProps {
  isActive: boolean;
}

function ShoesCarouselPaginationItem({
  isActive,
}: ShoesCarouselPaginationItemProps) {
  const prevIsActive = useRef(isActive);
  const activeAnimationProgress = useSharedValue(isActive ? 1 : 0);

  const paginationItemAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        activeAnimationProgress.value,
        [0, 1],
        [theme.palette.gray[600], theme.palette.gray[400]]
      ),
    };
  });

  useEffect(() => {
    if (prevIsActive.current === isActive) {
      return;
    }

    if (prevIsActive.current && !isActive) {
      activeAnimationProgress.value = withTiming(0);
    } else {
      activeAnimationProgress.value = withTiming(1);
    }

    prevIsActive.current = isActive;
  }, [isActive]);

  return (
    <Animated.View
      style={[styles.paginationItemWrapper, paginationItemAnimatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  pagination: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing(0.5),
  },
  paginationItemWrapper: {
    width: theme.spacing(5),
    height: theme.spacing(0.25),
  },
});
