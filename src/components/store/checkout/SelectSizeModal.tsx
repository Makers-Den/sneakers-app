import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SizeButton } from "./SizeButton";

const SIZE_BUTTONS_PER_ROW = 4;

export interface Size {
  id: string;
  label: string;
}

export interface SelectSizeModalProps {
  isOpen: boolean;
  sizes: Size[];
  onClose: () => void;
}

export function SelectSizeModal({
  isOpen,
  sizes,
  onClose,
}: SelectSizeModalProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const validSelectedSizeId =
    sizes.find((size) => size.id === selectedSizeId)?.id || null;

  const sizeRowCount = Math.ceil(sizes.length / SIZE_BUTTONS_PER_ROW);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.wrapper}>
        <Pressable style={styles.exitArea} onPress={onClose} />

        <View style={styles.contentWrapper}>
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
                        onPress={() => setSelectedSizeId(size.id)}
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
          <Button isDisabled={!validSelectedSizeId} text="Continue" size="lg" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  exitArea: {
    flex: 1,
    backgroundColor: theme.palette.gray[900],
    opacity: theme.opacity.lg,
  },
  contentWrapper: {
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
