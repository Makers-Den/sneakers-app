import { BottomModal } from "@/components/ui/BottomModal";
import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import * as Notifications from "expo-notifications";
import { createNamedLogger } from "@/lib/log";
import { createNotificationData } from "@/lib/notification";

const logger = createNamedLogger("NotificationModal");

export interface NotificationModalShoes {
  id: string;
  model: string;
}

export interface NotificationModalProps {
  shoes: NotificationModalShoes | null;
  onClose: () => void;
}

export function NotificationModal({ shoes, onClose }: NotificationModalProps) {
  const handleSchedulePress = async () => {
    if (!shoes) {
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${shoes.model} dropped! 🎉`,
          data: createNotificationData({
            type: "ShoesDropped",
            shoesId: shoes.id,
          }),
        },
        trigger: { seconds: 30 },
      });
    } catch (error) {
      logger.error("Scheduling notification failed", error);
    }

    onClose();
  };

  return (
    <BottomModal isOpen={!!shoes} onClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          Try out the scheduled notifications! Enter the "Schedule" button and
          wait a few seconds.
        </Text>
        <Button text="Schedule" size="lg" onPress={handleSchedulePress} />
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
