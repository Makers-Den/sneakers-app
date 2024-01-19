import { z } from "zod";

type EnvVariables = z.infer<typeof envVariablesSchema>;

const envVariablesSchema = z.object({
  backend: z.object({
    /* Base url of the Sneakers App backend */
    baseUrl: z.string().url(),
  }),
  shopify: z.object({
    collectionId: z.object({
      /* Shopify "In Stock" collection id: Should follow format: "gid://shopify/Collection/{the-actual-id}" */
      inStock: z.string().min(1),
      /* Shopify "Upcoming" collection id: Should follow format: "gid://shopify/Collection/{the-actual-id}" */
      upcoming: z.string().min(1),
    }),
    metaObjectId: z.object({
      feed: z.string().min(1),
    }),
    /* Shopify store domain. Should follow format: "{store-name}.myshopify.com" */
    storeDomain: z.string().min(1),
    /* Shopify Storefront access token. Required to access Shopify Storefront API  */
    storefrontAccessToken: z.string().min(1),
  }),
});

const devEnvVariables = (): EnvVariables => ({
  backend: {
    baseUrl: "https://sneakers-app-makersden.vercel.app",
  },
  shopify: {
    collectionId: {
      inStock: "gid://shopify/Collection/601946947784",
      upcoming: "gid://shopify/Collection/601946915016",
    },
    metaObjectId: {
      feed: "gid://shopify/Metaobject/33452785864",
    },
    storeDomain: "makers-sneakers.myshopify.com",
    storefrontAccessToken: "db3f3670ca9a39ba1f48c5b460f57197",
  },
});

export const envVariables = envVariablesSchema.parse(devEnvVariables());
