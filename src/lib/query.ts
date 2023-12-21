import { QueryClient } from "react-query";

export const queryClient = new QueryClient();

export const queryKeys = {
  shoes: {
    all: () => ["shoes"] as const,
    lists: () => [...queryKeys.shoes.all(), "lists"] as const,
    list: (params: {
      collectionId: string;
      maxImageWidth: number;
      maxImageHeight: number;
    }) => [...queryKeys.shoes.lists(), params] as const,
    details: () => [...queryKeys.shoes.all(), "detail"] as const,
    detail: (params: {
      shoesId: string;
      maxImageWidth: number;
      maxImageHeight: number;
    }) => [...queryKeys.shoes.details(), params] as const,
    search: (params: {
      query: string;
      maxImageWidth: number;
      maxImageHeight: number;
    }) => [...queryKeys.shoes.all(), "search", params] as const,
    recentSearches: () => [...queryKeys.shoes.all(), "recentSearches"] as const,
  },
  contentCategories: {
    all: () => ["contentCategories"] as const,
  },
  blogPosts: {
    all: () => ["blogPosts"] as const,
    details: () => [...queryKeys.blogPosts.all(), "detail"] as const,
    detail: (params: {
      blogPostId: string;
      maxImageWidth: number;
      maxImageHeight: number;
    }) => [...queryKeys.blogPosts.details(), params] as const,
  },
};
