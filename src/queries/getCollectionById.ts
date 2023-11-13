import { z } from "zod";
import {
  ShopifyMetaFieldKey,
  ShopifyMetaFieldNamespace,
} from "@/types/shopify";

export interface GetCollectionByIdVars {
  collectionId: string;
  maxImageWidth: number;
  maxImageHeight: number;
}

export function getCollectionByIdQuery(vars: GetCollectionByIdVars) {
  return `
  query GetCollectionByIdQuery {
    collection(id: "${vars.collectionId}") {
      products(first: 20) {
        edges {
          node {
            id,
            title,
            availableForSale,
            variants(first: 50) {
              nodes {
                id,
                title
              }
            },
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
            },
            media(first: 1) {
              nodes {
                previewImage {
                  resizedUrl: url(transform: { maxHeight: ${vars.maxImageHeight}, maxWidth: ${vars.maxImageWidth} })
                }
              }
            },
            metafields(identifiers: [
              {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelVariant}"},
              {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelIsForMen}"},
              {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelDropOffsetDays}"},
            ]) {
              value,
              key
            }
          }
        }
      }
    }
  }
`;
}

export const getCollectionByIdSchema = z.object({
  data: z.object({
    collection: z.object({
      products: z.object({
        edges: z.array(
          z.object({
            node: z.object({
              id: z.string(),
              title: z.string(),
              availableForSale: z.boolean(),
              variants: z.object({
                nodes: z.array(z.object({ id: z.string(), title: z.string() })),
              }),
              priceRange: z.object({
                maxVariantPrice: z.object({
                  amount: z.string(),
                  currencyCode: z.string(),
                }),
              }),
              media: z.object({
                nodes: z.array(
                  z.object({
                    previewImage: z.object({
                      resizedUrl: z.string(),
                    }),
                  })
                ),
              }),
              metafields: z.array(
                z.union([
                  z.object({
                    value: z.string(),
                    key: z.literal(ShopifyMetaFieldKey.ModelVariant),
                  }),
                  z.object({
                    value: z.string(),
                    key: z.literal(ShopifyMetaFieldKey.ModelIsForMen),
                  }),
                  z.object({
                    value: z.string(),
                    key: z.literal(ShopifyMetaFieldKey.ModelDropOffsetDays),
                  }),
                  z.null(),
                ])
              ),
            }),
          })
        ),
      }),
    }),
  }),
});
