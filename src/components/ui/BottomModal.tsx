import { theme } from "@/lib/theme";
import { Modal, Pressable, StyleSheet, View } from "react-native";

export interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomModal({ isOpen, children, onClose }: BottomModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.wrapper}>
        <Pressable style={styles.exitArea} onPress={onClose} />

        <View style={styles.contentWrapper}>{children}</View>
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
    opacity: theme.opacity.md,
  },
  contentWrapper: {
    backgroundColor: theme.palette.gray[800],
  },
});
