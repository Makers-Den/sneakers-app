import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/lib/theme";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList, Screen } from "@/types/navigation";
import { CategoryListView } from "@/components/blog/category-list/CategoryListView";
import { BlogHeader } from "@/components/blog/blog-header/BlogHeader";

export function DiscoverScreen({
  navigation,
}: BottomTabScreenProps<RootTabParamList, Screen.DiscoverScreens>) {
  return (
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
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
  },
});
