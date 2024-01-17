import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { StyleSheet, Text, View } from "react-native";
import { BottomModal } from "@/components/ui/BottomModal";

export interface CheckoutDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutDemoModal({ isOpen, onClose }: CheckoutDemoModalProps) {
  return (
    <BottomModal isOpen={isOpen} onClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          🚨 Demo Alert: No live checkout! This app is purely for demonstration
          purposes. Explore our features and experience the demo journey. Thank
          you for choosing our demo app!
        </Text>
        <Button text="Close" size="lg" onPress={onClose} />
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(3),
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    lineHeight:
      theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    color: theme.palette.gray[100],
    marginBottom: theme.spacing(3),
  },
});
