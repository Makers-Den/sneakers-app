import { z } from "zod";

export type NotificationData = z.infer<typeof notificationDataSchema>;

export const notificationDataSchema = z.union([
  z.object({
    type: z.literal("OpenShoesDetails"),
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
