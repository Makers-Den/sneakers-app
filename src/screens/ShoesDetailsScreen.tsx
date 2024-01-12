import { View, ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MainScreen,
  RootScreen,
  ShoppingScreen,
  ShoppingScreensProps,
  ShoppingStackParamList,
} from "@/types/navigation";
import { useQuery } from "react-query";
import { getShoesById } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";
import {
  ShoesCarousel,
  getShoesCarouselDimensions,
} from "@/components/store/details/ShoesCarousel";
import { theme } from "@/lib/theme";
import { ShoesActionBar } from "@/components/store/details/ShoesActionBar";
import { ShoesHeader } from "@/components/store/details/ShoesHeader";
import { ShoesDescription } from "@/components/store/details/ShoesDescription";
import { Button } from "@/components/ui/Button";
import { useContext, useMemo } from "react";
import { useCheckoutProcess } from "@/hooks/useCheckoutProcess";
import { Checkout } from "@/components/store/checkout/Checkout";
import { NotificationModal } from "@/components/store/notification/NotificationModal";
import { useNotificationModal } from "@/hooks/useNotificationModal";
import { getImageSize } from "@/lib/image";
import { BlogHorizontalList } from "@/components/ui/BlogHorizontalList";
import { ShopifyMetaObjectType } from "@/types/shopify";

export function ShoesDetailsScreen({
  navigation,
  route,
}: ShoppingScreensProps<ShoppingScreen.ShoesDetails>) {
  const shoesId = route.params.shoesId;
  const notificationModal = useNotificationModal();
  const checkoutProcess = useCheckoutProcess();

  const shoesCarouselImage = useMemo(
    () => getImageSize(getShoesCarouselDimensions().image),
    []
  );
  const shoesQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesById({
        shoesId,
        maxImageHeight: shoesCarouselImage.height,
        maxImageWidth: shoesCarouselImage.width,
        signal,
      }),
    queryKey: queryKeys.shoes.detail({
      shoesId,
      maxImageHeight: shoesCarouselImage.height,
      maxImageWidth: shoesCarouselImage.width,
    }),
  });

  const handleActionButtonPress = () => {
    if (!shoesQuery.data) {
      return;
    }

    if (shoesQuery.data.dropsAt) {
      notificationModal.open({
        id: shoesQuery.data.id,
        model: shoesQuery.data.model,
      });

      return;
    }

    checkoutProcess.startCheckoutProcess({
      model: shoesQuery.data.model,
      modelVariant: shoesQuery.data.modelVariant,
      priceAmount: shoesQuery.data.price.amount,
      priceCurrencyCode: shoesQuery.data.price.currencyCode,
      sizes: shoesQuery.data.sizes,
    });
  };

  const actionButtonText = useMemo(() => {
    if (!shoesQuery.data) {
      return "";
    }

    if (shoesQuery.data.dropsAt) {
      return "Notify Me";
    }

    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: shoesQuery.data.price.currencyCode,
    });

    return currencyFormatter.format(shoesQuery.data.price.amount);
  }, [shoesQuery.data]);

  const onBlogPress = ({ id }: { id: string }) => {
    navigation.navigate(RootScreen.BlogPostScreen, { blogPostId: id });
  };

  const blogs = useMemo(() => {
    if (!shoesQuery.data) {
      return null;
    }

    return shoesQuery.data.relatedContent?.map((blog) => {
      return {
        id: blog.id,
        title: blog.data.title,
        image: blog.data.thumbnail,
        type: blog.type as
          | ShopifyMetaObjectType.blogPost
          | ShopifyMetaObjectType.stories,
      };
    });
  }, [shoesQuery.data]);

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
          <ShoesActionBar onClose={navigation.goBack} />
          <ShoesCarousel images={shoesQuery.data?.images || []} />

          <View style={styles.contentWrapper}>
            {shoesQuery.data && (
              <>
                <ShoesHeader
                  model={shoesQuery.data.model}
                  modelVariant={shoesQuery.data.modelVariant}
                  dropsAt={shoesQuery.data.dropsAt}
                  priceAmount={shoesQuery.data.price.amount}
                  priceCurrencyCode={shoesQuery.data.price.currencyCode}
                  sizeRange={
                    shoesQuery.data.sizeRange
                      ? {
                          max: shoesQuery.data.sizeRange.max.label,
                          min: shoesQuery.data.sizeRange.min.label,
                        }
                      : null
                  }
                />

                <ShoesDescription
                  htmlDescription={shoesQuery.data.descriptionHtml}
                />
              </>
            )}
            {blogs && (
              <>
                <Text style={styles.relatedArticles}>Related Articles</Text>
                <BlogHorizontalList blogs={blogs} onBlogPress={onBlogPress} />
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {shoesQuery.data && (
        <View style={styles.actionButtonWrapper}>
          <Button
            text={actionButtonText}
            onPress={handleActionButtonPress}
            size="lg"
          />
        </View>
      )}

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
  relatedArticles: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingHorizontal: theme.spacing(2),
    fontSize: theme.typography.fontSize.lg,
    color: theme.palette.gray[100],
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeight.bold,
  },
});
