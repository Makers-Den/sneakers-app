import { View, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingScreen, ShoppingStackParamList } from "@/types/navigation";
import { useQuery } from "react-query";
import { getShoesById } from "@/lib/shopify";
import { queryKeys } from "@/lib/query";
import {
  SHOES_CAROUSEL_IMAGE_HEIGHT,
  SHOES_CAROUSEL_IMAGE_WIDTH,
  ShoesCarousel,
} from "@/components/store/details/ShoesCarousel";
import { theme } from "@/lib/theme";
import { ShoesActionBar } from "@/components/store/details/ShoesActionBar";
import { ShoesHeader } from "@/components/store/details/ShoesHeader";
import { ShoesDescription } from "@/components/store/details/ShoesDescription";
import { Button } from "@/components/ui/Button";
import { useMemo } from "react";
import { useCheckoutProcess } from "@/hooks/useCheckoutProcess";
import { Checkout } from "@/components/store/checkout/Checkout";
import { NotificationModal } from "@/components/store/notification/NotificationModal";
import { useNotificationModal } from "@/hooks/useNotificationModal";
import { getImageSize } from "@/lib/image";

const shoesCarouselImage = getImageSize({
  height: SHOES_CAROUSEL_IMAGE_HEIGHT,
  width: SHOES_CAROUSEL_IMAGE_WIDTH,
});

export function ShoesDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<
  ShoppingStackParamList,
  ShoppingScreen.ShoesDetails
>) {
  const { shoesId } = route.params;
  const notificationModal = useNotificationModal();
  const checkoutProcess = useCheckoutProcess();
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

  return (
    <SafeAreaView style={styles.safeArea}>
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
});
