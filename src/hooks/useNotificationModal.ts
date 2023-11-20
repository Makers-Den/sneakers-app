import {
  NotificationModalProps,
  NotificationModalShoes,
} from "@/components/store/notification/NotificationModal";
import { useCallback, useMemo, useState } from "react";

export function useNotificationModal() {
  const [shoes, setShoes] = useState<NotificationModalShoes | null>(null);

  const open = useCallback(
    (shoes: NotificationModalShoes) => {
      setShoes(shoes);
    },
    [setShoes]
  );

  const props = useMemo(
    (): NotificationModalProps => ({
      onClose: () => setShoes(null),
      shoes,
    }),
    [shoes, setShoes]
  );

  return useMemo(
    () => ({
      open,
      props,
    }),
    [open, props]
  );
}
