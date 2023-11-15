import { View, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, Screen } from "@/types/navigation";
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

export function ShoesDetailsScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, Screen.ShoesDetails>) {
  const { shoesId } = route.params;
  const shoesQuery = useQuery({
    queryFn: ({ signal }) =>
      getShoesById({
        shoesId,
        maxImageHeight: SHOES_CAROUSEL_IMAGE_HEIGHT,
        maxImageWidth: SHOES_CAROUSEL_IMAGE_WIDTH,
        signal,
      }),
    queryKey: queryKeys.shoes.detail({
      shoesId,
      maxImageHeight: SHOES_CAROUSEL_IMAGE_HEIGHT,
      maxImageWidth: SHOES_CAROUSEL_IMAGE_WIDTH,
    }),
  });

  const bottomButtonText = useMemo(() => {
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
      <ScrollView>
        <View style={styles.wrapper}>
          <ShoesActionBar onClose={navigation.goBack} />
          <ShoesCarousel images={shoesQuery.data?.images || []} />

          {shoesQuery.data && (
            <View style={styles.contentWrapper}>
              <ShoesHeader
                model={shoesQuery.data.model}
                modelVariant={shoesQuery.data.modelVariant}
                dropsAt={shoesQuery.data.dropsAt}
                priceAmount={shoesQuery.data.price.amount}
                priceCurrencyCode={shoesQuery.data.price.currencyCode}
                sizeRange={
                  shoesQuery.data.sizeRange
                    ? {
                        max: shoesQuery.data.sizeRange.max.name,
                        min: shoesQuery.data.sizeRange.min.name,
                      }
                    : null
                }
              />

              <ShoesDescription
                htmlDescription={shoesQuery.data.descriptionHtml}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        <Button
          text={bottomButtonText}
          onPress={() => {
            // @TODO handlePress
          }}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.palette.gray[700],
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
    width: "100%",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: theme.spacing(4),
    left: theme.spacing(2),
    right: theme.spacing(2),
  },
});
