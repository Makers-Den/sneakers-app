import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SizeButton } from "./SizeButton";
import { Size } from "./Checkout";
import { BottomModal } from "@/components/ui/BottomModal";

const SIZE_BUTTONS_PER_ROW = 4;

export interface CheckoutSizeModalProps {
  isOpen: boolean;
  sizes: Size[];
  onClose: () => void;
  onSelect: (size: Size) => void;
}

export function CheckoutSizeModal({
  isOpen,
  sizes,
  onClose,
  onSelect,
}: CheckoutSizeModalProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const validSelectedSizeId =
    sizes.find((size) => size.id === selectedSize?.id)?.id || null;

  const sizeRowCount = Math.ceil(sizes.length / SIZE_BUTTONS_PER_ROW);

  const handleContinuePress = () => {
    if (!selectedSize) {
      return;
    }

    onSelect(selectedSize);
  };

  return (
    <BottomModal isOpen={isOpen} onClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.selectSizeText}>Select Size</Text>
        <View style={styles.sizeListWrapper}>
          {new Array(sizeRowCount).fill(null).map((_, rowIndex) => {
            const sizeCellsToDisplay = sizes.slice(
              SIZE_BUTTONS_PER_ROW * rowIndex,
              SIZE_BUTTONS_PER_ROW * (rowIndex + 1)
            );

            const emptyCellsToDisplay =
              SIZE_BUTTONS_PER_ROW - sizeCellsToDisplay.length;

            return (
              <View key={rowIndex} style={styles.sizeListRow}>
                {sizeCellsToDisplay.map((size) => (
                  <View key={size.id} style={styles.sizeListCell}>
                    <SizeButton
                      label={`EU ${size.label}`}
                      isSelected={validSelectedSizeId === size.id}
                      onPress={() => setSelectedSize(size)}
                    />
                  </View>
                ))}

                {new Array(emptyCellsToDisplay).fill(null).map((_, index) => (
                  <View key={index} style={styles.sizeListCell} />
                ))}
              </View>
            );
          })}
        </View>

        <Button
          isDisabled={!validSelectedSizeId}
          text="Continue"
          size="lg"
          onPress={handleContinuePress}
        />
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.palette.gray[800],
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(3),
  },
  sizeListWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  sizeListRow: {
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
  },
  sizeListCell: {
    flexGrow: 1,
    flexBasis: 50,
    flexShrink: 0,
  },
  selectSizeText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: "500",
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(3),
  },
});
