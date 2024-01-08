import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/lib/theme";
import { MainScreen, MainScreensProps } from "@/types/navigation";
import { CategoryListView } from "@/components/blog/category-list/CategoryListView";
import { BlogHeader } from "@/components/blog/blog-header/BlogHeader";
import { FadeInAnimation } from "@/components/wrappers/FadeInAnimation";

export function DiscoverScreen({
  navigation,
}: MainScreensProps<MainScreen.DiscoverScreen>) {
  return (
    <FadeInAnimation>
      <SafeAreaView
        edges={{
          bottom: "off",
          top: "additive",
          left: "additive",
          right: "additive",
        }}
        style={styles.wrapper}
      >
        <BlogHeader />
        <CategoryListView navigation={navigation} />
      </SafeAreaView>
    </FadeInAnimation>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
  },
});

export const MemoDiscoverScreen = React.memo(DiscoverScreen);
