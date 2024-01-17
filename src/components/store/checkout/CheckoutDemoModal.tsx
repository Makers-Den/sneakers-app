import * as Linking from "expo-linking";
import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomModal } from "@/components/ui/BottomModal";
import { MakersDenLogo } from "@/components/svg/MakersDenLogo";

export interface CheckoutDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutDemoModal({ isOpen, onClose }: CheckoutDemoModalProps) {
  const openMakersDenWebsite = () => {
    Linking.openURL("https://makersden.io/");
  };

  return (
    <BottomModal isOpen={isOpen} onClose={onClose}>
      <View style={styles.wrapper}>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: theme.spacing(3),
          }}
        >
          <Pressable onPress={openMakersDenWebsite}>
            <MakersDenLogo style={{ width: 200, aspectRatio: 5.5 }} />
          </Pressable>
        </View>

        <Text style={styles.text}>
          💡 Demo Alert: No live checkout! This app is for demonstration
          purposes. Explore our features and experience the demo journey. Thank you
          for using our app. To learn more about our services, please visit{" "}
          <Text
            onPress={openMakersDenWebsite}
            style={{ color: theme.palette.green[400] }}
          >
            makersden.io
          </Text>
          .
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
