import { CheckoutSizeModal } from "./CheckoutSizeModal";
import { CheckoutSummaryModal } from "./CheckoutSummaryModal";

export interface Size {
  id: string;
  label: string;
}

export interface CheckoutShoes {
  model: string;
  modelVariant: string | null;
  priceAmount: number;
  priceCurrencyCode: string;
  sizes: Size[];
}

export interface CheckoutProps {
  shoes: CheckoutShoes | null;
  selectedSize: Size | null;
  isBuying: boolean;
  onCancel: () => void;
  onSelectSize: (size: Size) => void;
  onBuy: () => void;
}

export function Checkout({
  shoes,
  selectedSize,
  isBuying,
  onBuy,
  onCancel,
  onSelectSize,
}: CheckoutProps) {
  return (
    <>
      <CheckoutSizeModal
        isOpen={shoes !== null}
        sizes={shoes?.sizes || []}
        onClose={onCancel}
        onSelect={onSelectSize}
      />

      <CheckoutSummaryModal
        model={shoes?.model || ""}
        modelVariant={shoes?.modelVariant || null}
        priceAmount={shoes?.priceAmount || 0}
        priceCurrencyCode={shoes?.priceCurrencyCode || "EUR"}
        sizeLabel={selectedSize?.label || ""}
        isOpen={selectedSize !== null}
        isBuying={isBuying}
        onBuy={onBuy}
        onClose={onCancel}
      />
    </>
  );
}
