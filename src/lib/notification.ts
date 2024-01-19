import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { z } from "zod";
import { createNamedLogger } from "./log";
import { registerPushToken } from "./backend";

const logger = createNamedLogger("notification");

export type NotificationData = z.infer<typeof notificationDataSchema>;

export const notificationDataSchema = z.union([
  z.object({
    type: z.literal("ShoesDropped"),
    shoesId: z.string(),
  }),
  z.object({
    /**
     * z.union takes a least two zod schemas. Remove TemporalNotification when
     * we have at least two "normal" notifications
     */
    type: z.literal("TemporalNotification"),
  }),
]);

export const createNotificationData = (data: NotificationData) => data;

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    logger.info("Not a physical device, Push Notifications not allowed");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    logger.info("Notification permissions not granted");
    return;
  }

  const easProjectId = Constants.expoConfig?.extra?.eas.projectId;
  if (!easProjectId) {
    logger.info("EAS project id is missing");
    return;
  }

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    projectId: easProjectId,
  });

  await registerPushToken(expoPushToken.data);
}
