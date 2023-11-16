import {
  CheckoutProps,
  CheckoutShoes,
  Size,
} from "@/components/store/checkout/Checkout";
import { createCheckout } from "@/lib/shopify";
import { useCallback, useMemo, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useMutation } from "react-query";
import { Alert } from "react-native";
import { createNamedLogger } from "@/lib/log";

const logger = createNamedLogger("useCheckoutProcess");

export function useCheckoutProcess() {
  const [shoes, setShoes] = useState<CheckoutShoes | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);

  const createCheckoutMutation = useMutation({
    mutationFn: async () =>
      selectedSize
        ? createCheckout({ sizeId: selectedSize.id })
        : Promise.reject(new Error("Selected size is missing")),
    onSuccess: async (data) => {
      if (!data) {
        return;
      }

      try {
        await WebBrowser.openBrowserAsync(data.webUrl);
      } catch (error) {
        Alert.alert(
          "Something went wrong",
          "We were not able to start the checkout process. Please try again later."
        );

        logger.error("Opening browser failed", error);
      }
    },
    onError: (error) => {
      Alert.alert(
        "Something went wrong",
        "We were not able to start the checkout process. Please try again later."
      );

      logger.error("Creating checkout session failed", error);
    },
  });

  const validatedSelectedSize = useMemo(() => {
    if (!shoes || !selectedSize) {
      return null;
    }

    return shoes.sizes.find((size) => size.id === selectedSize.id) || null;
  }, [shoes, selectedSize]);

  const startCheckoutProcess = useCallback(
    (shoes: CheckoutShoes) => {
      if (createCheckoutMutation.isLoading) {
        return;
      }

      setShoes(shoes);
      setSelectedSize(null);
    },
    [setShoes, createCheckoutMutation.isLoading]
  );

  const cancelCheckoutProcess = useCallback(() => {
    if (createCheckoutMutation.isLoading) {
      return;
    }

    setShoes(null);
    setSelectedSize(null);
  }, [setShoes, setSelectedSize, createCheckoutMutation.isLoading]);

  const selectSize = useCallback(
    (size: Size) => {
      if (createCheckoutMutation.isLoading) {
        return;
      }

      setSelectedSize(size);
    },
    [setSelectedSize, createCheckoutMutation.isLoading]
  );

  const startCreatingCheckout = useCallback(() => {
    if (createCheckoutMutation.isLoading) {
      return;
    }

    createCheckoutMutation.mutate();
  }, [createCheckoutMutation.mutate, createCheckoutMutation.isLoading]);

  const checkoutProps = useMemo(
    (): CheckoutProps => ({
      selectedSize: validatedSelectedSize,
      shoes,
      isBuying: createCheckoutMutation.isLoading,
      onCancel: cancelCheckoutProcess,
      onSelectSize: selectSize,
      onBuy: startCreatingCheckout,
    }),
    [
      shoes,
      validatedSelectedSize,
      createCheckoutMutation.isLoading,
      cancelCheckoutProcess,
      selectSize,
      startCreatingCheckout,
    ]
  );

  return useMemo(
    () => ({ startCheckoutProcess, checkoutProps }),
    [startCheckoutProcess, checkoutProps]
  );
}
