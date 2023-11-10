import { QueryClient } from "react-query";

export const queryClient = new QueryClient();

export const queryKeys = {
  products: {
    all: () => ["products"] as const,
    lists: () => [...queryKeys.products.all(), "lists"] as const,
    list: (params: { collectionId: string }) =>
      [...queryKeys.products.lists(), params.collectionId] as const,
  },
};
