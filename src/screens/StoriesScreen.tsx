import { Stories } from "@/components/blog/stories/Stories";
import { theme } from "@/lib/theme";
import {
  RootStackParamList,
  RootScreen,
  RootScreensProps,
} from "@/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

export function StoriesScreen({
  route,
  navigation,
}: RootScreensProps<RootScreen.Story>) {
  return (
    <Stories
      videoSources={[
        "https://cdn.shopify.com/videos/c/o/v/0ebbf24d8e71437388c34129cecb8fea.mp4",
        "https://cdn.shopify.com/videos/c/o/v/ac3fe107502f49cc8709c2f8621b8c85.mp4",
        "https://cdn.shopify.com/videos/c/o/v/65ab7aab0fbe4ae093f4e39af63d3cb8.mp4",
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
  },
});
