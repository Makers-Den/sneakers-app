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
    details: () => [...queryKeys.contentCategories.all(), "detail"] as const,
    detail: (params: {
      id: string;
      maxImageWidth: number;
      maxImageHeight: number;
    }) => [...queryKeys.contentCategories.details(), params] as const,
  },
  blogPosts: {
    all: () => ["blogPosts"] as const,
    details: () => [...queryKeys.blogPosts.all(), "detail"] as const,
    detail: (params: {
      blogPostId: string;
      maxImageWidth: number;
      maxImageHeight: number;
      maxProductImageWidth: number;
      maxProductImageHeight: number;
    }) => [...queryKeys.blogPosts.details(), params] as const,
  },
  feed: {
    all: () => ["feed"] as const,
    lists: () => [...queryKeys.feed.all(), "lists"] as const,
    list: (params: { maxImageWidth: number; maxImageHeight: number }) =>
      [...queryKeys.feed.lists(), params] as const,
  },
  stories: {
    all: () => ["stories"] as const,
    details: () => [...queryKeys.stories.all(), "detail"] as const,
    detail: (params: { id: string }) =>
      [...queryKeys.stories.details(), params] as const,
  },
};
