import { z } from "zod";
import {
  ShopifyMetaFieldKey,
  ShopifyMetaFieldNamespace,
} from "@/types/shopify";

export interface SearchProductsVars {
  query: string;
  maxImageWidth: number;
  maxImageHeight: number;
}

export function searchProductsQuery(vars: SearchProductsVars) {
  return `
  query SearchProductsQuery {
    search(query: "${vars.query}", types: [PRODUCT], first: 30) {
      nodes {
        ... on Product {
          id
          title
          media(first: 1) {
            nodes {
              previewImage {
                resizedUrl: url(transform: { maxHeight: ${vars.maxImageHeight}, maxWidth: ${vars.maxImageWidth} })
              }
            }
          },
          metafields(identifiers: [
            {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelVariant}"}
          ]) {
              value,
              key
          }
        }
      }
    }
  }
`;
}

export const searchProductsSchema = z.object({
  data: z.object({
    search: z.object({
      nodes: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
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
              z.null(),
            ])
          ),
        })
      ),
    }),
  }),
});
