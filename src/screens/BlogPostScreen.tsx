import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootScreen, RootScreensProps } from "@/types/navigation";
import { useQuery } from "react-query";
import { getBlogPost } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";
import { theme } from "@/lib/theme";
import { getImageSize } from "@/lib/image";
import { BlogActionBar } from "@/components/blog/details/BlogActionBar";
import { HtmlRenderer } from "@/components/ui/HtmlRenderer";
import { useCallback, useLayoutEffect, useMemo } from "react";
import { convertRichTextToHtml } from "@/lib/convertRichTextToHtml";
import { PlaceholderLoading } from "@/components/ui/PlaceholderLoading";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BLOG_IMAGE_ASPECT_RATIO = 1;

export function BlogPostScreen({
  navigation,
  route,
}: RootScreensProps<RootScreen.BlogPostScreen>) {
  const { blogPostId } = route.params;

  const opacity = useSharedValue(0);

  const dimensions = useWindowDimensions();

  useLayoutEffect(() => {
    opacity.value = 0;
    return () => {
      opacity.value = 0;
    };
  }, [blogPostId]);

  const imageDimensions = useMemo(() => {
    return getImageSize({
      width: dimensions.width,
      height: dimensions.width * BLOG_IMAGE_ASPECT_RATIO,
    });
  }, [dimensions.width]);

  const blogPostQuery = useQuery({
    queryFn: ({ signal }) =>
      getBlogPost({
        blogPostId,
        image: {
          maxHeight: imageDimensions.height,
          maxWidth: imageDimensions.width,
        },
        signal,
      }),
    queryKey: queryKeys.blogPosts.detail({
      blogPostId,
      maxImageHeight: imageDimensions.height,
      maxImageWidth: imageDimensions.width,
    }),
  });

  const html = useMemo(() => {
    if (!blogPostQuery.data) {
      return "";
    }

    return convertRichTextToHtml(blogPostQuery.data.data.content);
  }, [blogPostQuery.data]);

  const onImageLoadEnd = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
    });
  }, []);

  return (
    <SafeAreaView
      edges={{
        bottom: "off",
        top: "additive",
        left: "additive",
        right: "additive",
      }}
      style={styles.safeArea}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.wrapper}>
          <BlogActionBar onClose={navigation.goBack} />
          {blogPostQuery.isFetching ? (
            <PlaceholderLoading
              width={dimensions.width}
              height={dimensions.height}
            />
          ) : (
            <>
              <Animated.Image
                source={{ uri: blogPostQuery.data?.data.thumbnail }}
                style={{
                  width: "100%",
                  aspectRatio: BLOG_IMAGE_ASPECT_RATIO,
                  opacity,
                }}
                onLoadEnd={onImageLoadEnd}
              />
              <View style={styles.contentWrapper}>
                {blogPostQuery.data && (
                  <>
                    <HtmlRenderer html={html} width={dimensions.width} />
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.gray[700],
  },
  scrollView: {
    backgroundColor: theme.palette.gray[900],
  },
  wrapper: {
    position: "relative",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.gray[900],
    paddingBottom: theme.spacing(14),
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
  },
  actionButtonWrapper: {
    position: "absolute",
    bottom: theme.spacing(4),
    left: theme.spacing(2),
    right: theme.spacing(2),
  },
});
