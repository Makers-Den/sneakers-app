import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MainScreen,
  RootScreen,
  RootScreensProps,
  ShoppingScreen,
} from "@/types/navigation";
import { useQuery } from "react-query";
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
import { Product, getBlogPostById } from "@/lib/shopify";
import { getFeedCardImageDimensions } from "@/components/store/feed/FeedCard";
import { FeedShoesCard } from "@/components/store/feed/FeedShoesCard";
import { useCheckoutProcess } from "@/hooks/useCheckoutProcess";
import { useNotificationModal } from "@/hooks/useNotificationModal";
import { Checkout } from "@/components/store/checkout/Checkout";
import { NotificationModal } from "@/components/store/notification/NotificationModal";

const BLOG_IMAGE_ASPECT_RATIO = 1;

export function BlogPostScreen({
  navigation,
  route,
}: RootScreensProps<RootScreen.BlogPostScreen>) {
  const { blogPostId } = route.params;

  const opacity = useSharedValue(0);

  const dimensions = useWindowDimensions();

  const checkoutProcess = useCheckoutProcess();
  const notificationModal = useNotificationModal();

  useLayoutEffect(() => {
    opacity.value = 0;
    return () => {
      opacity.value = 0;
    };
  }, [blogPostId]);

  const productImageDimensions = useMemo(
    () => getImageSize(getFeedCardImageDimensions()),
    []
  );

  const imageDimensions = useMemo(() => {
    return getImageSize({
      width: dimensions.width,
      height: dimensions.width * BLOG_IMAGE_ASPECT_RATIO,
    });
  }, [dimensions.width]);

  const blogPostQuery = useQuery({
    queryFn: ({ signal }) =>
      getBlogPostById({
        blogPostId,
        image: {
          maxHeight: imageDimensions.height,
          maxWidth: imageDimensions.width,
        },
        productImage: {
          maxHeight: productImageDimensions.height,
          maxWidth: productImageDimensions.width,
        },
        signal,
      }),
    queryKey: queryKeys.blogPosts.detail({
      blogPostId,
      maxImageHeight: imageDimensions.height,
      maxImageWidth: imageDimensions.width,
      maxProductImageHeight: productImageDimensions.height,
      maxProductImageWidth: productImageDimensions.width,
    }),
  });

  const html = useMemo(() => {
    if (!blogPostQuery.data) {
      return "";
    }

    return convertRichTextToHtml(blogPostQuery.data.data.content);
  }, [blogPostQuery.data]);

  const handleImageLoadEnd = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
    });
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    navigation.navigate(RootScreen.Main, {
      screen: MainScreen.ShoppingScreens,
      params: {
        screen: ShoppingScreen.ShoesDetails,
        params: { shoesId: product.id },
      },
    });
  }, []);

  const handleProductButtonPress = useCallback(
    (product: Product) => {
      if (product.isUpcoming) {
        notificationModal.open({
          id: product.id,
          model: product.model,
        });

        return;
      }

      checkoutProcess.startCheckoutProcess({
        model: product.model,
        modelVariant: product.modelVariant,
        priceAmount: product.price.amount,
        priceCurrencyCode: product.price.currencyCode,
        sizes: product.sizes,
      });
    },
    [checkoutProcess, notificationModal]
  );

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
          {blogPostQuery.isFetching && (
            <PlaceholderLoading
              width={dimensions.width}
              height={dimensions.height}
            />
          )}

          {!blogPostQuery.isFetching && blogPostQuery.data && (
            <>
              <Animated.Image
                source={{ uri: blogPostQuery.data.data.thumbnail }}
                style={{
                  width: "100%",
                  aspectRatio: BLOG_IMAGE_ASPECT_RATIO,
                  opacity,
                }}
                onLoadEnd={handleImageLoadEnd}
              />

              <View style={styles.contentWrapper}>
                <HtmlRenderer html={html} width={dimensions.width} />
              </View>

              {blogPostQuery.data.products.map((product) => {
                const currencyFormatter = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: product.price.currencyCode,
                });

                return (
                  <FeedShoesCard
                    key={product.id}
                    image={product.previewImage}
                    model={product.model}
                    modelVariant={product.modelVariant}
                    buttonText={
                      product.isUpcoming
                        ? "Notify Me"
                        : currencyFormatter.format(product.price.amount)
                    }
                    onButtonPress={() => handleProductButtonPress(product)}
                    onPress={() => handleProductPress(product)}
                  />
                );
              })}
            </>
          )}
        </View>
      </ScrollView>

      <Checkout {...checkoutProcess.checkoutProps} />
      <NotificationModal {...notificationModal.props} />
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
    justifyContent: "center",
    backgroundColor: theme.palette.gray[900],
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    marginBottom: theme.spacing(2),
  },
});
