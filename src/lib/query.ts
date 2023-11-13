import { QueryClient } from "react-query";

export const queryClient = new QueryClient();

export const queryKeys = {
  sneakers: {
    all: () => ["sneakers"] as const,
    lists: () => [...queryKeys.sneakers.all(), "lists"] as const,
    list: (params: {
      collectionId: string;
      maxImageWidth: number;
      maxImageHeight: number;
    }) => [...queryKeys.sneakers.lists(), params] as const,
    details: () => [...queryKeys.sneakers.all(), "detail"] as const,
    detail: (params: { sneakersId: string }) =>
      [...queryKeys.sneakers.details(), params.sneakersId] as const,
    search: (params: { query: string }) =>
      [...queryKeys.sneakers.all(), "search", params.query] as const,
  },
};
