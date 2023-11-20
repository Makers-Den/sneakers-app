import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { StyleSheet, Text, View } from "react-native";
import { BottomModal } from "@/components/ui/BottomModal";

export interface CheckoutSummaryModalProps {
  model: string;
  modelVariant: string | null;
  sizeLabel: string;
  priceAmount: number;
  priceCurrencyCode: string;
  isOpen: boolean;
  isBuying: boolean;
  onClose: () => void;
  onBuy: () => void;
}

export function CheckoutSummaryModal({
  model,
  modelVariant,
  sizeLabel,
  priceAmount,
  priceCurrencyCode,
  isBuying,
  isOpen,
  onBuy,
  onClose,
}: CheckoutSummaryModalProps) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: priceCurrencyCode,
  });

  return (
    <BottomModal isOpen={isOpen} onClose={onClose}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.modelText}>{model}</Text>
          {modelVariant && (
            <Text style={styles.modelVariantText}>{modelVariant}</Text>
          )}
        </View>

        <View style={styles.propertyList}>
          <View style={styles.propertyListItem}>
            <Text style={styles.propertyKey}>Size</Text>
            <Text style={styles.propertyValue}>EU {sizeLabel}</Text>
          </View>

          <View style={styles.propertyListItem}>
            <Text style={styles.propertyKey}>Purchase Summary</Text>
            <Text style={styles.propertyValue}>
              {currencyFormatter.format(priceAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button isDisabled={isBuying} text="Buy" size="lg" onPress={onBuy} />
        </View>
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.palette.gray[800],
  },
  header: {
    padding: theme.spacing(3),
  },
  modelText: {
    color: theme.palette.gray[100],
    fontSize: theme.typography.fontSize.lg,
    lineHeight:
      theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  modelVariantText: {
    color: theme.palette.gray[400],
    fontSize: theme.typography.fontSize.base,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    textAlign: "center",
  },
  propertyList: {
    borderTopWidth: 1,
    borderTopColor: theme.palette.gray[900],
  },
  propertyListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.gray[900],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  propertyKey: {
    color: theme.palette.gray[100],
    fontSize: theme.typography.fontSize.base,
    fontWeight: "500",
  },
  propertyValue: {
    color: theme.palette.gray[400],
    fontSize: theme.typography.fontSize.base,
  },
  footer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(4),
  },
});
