import { z } from "zod";
import {
  ShopifyMetaFieldKey,
  ShopifyMetaFieldNamespace,
} from "../types/shopify";

export interface GetProductByIdVars {
  productId: string;
}

export function getProductByIdQuery(vars: GetProductByIdVars) {
  return `
  query GetProductByIdQuery {
    product(id: "${vars.productId}") {
      id,
      title,
      descriptionHtml,
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
      media(first: 50) {
        nodes {
          previewImage {
            url
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
`;
}

export const getProductByIdSchema = z.object({
  data: z.object({
    product: z.object({
      id: z.string(),
      title: z.string(),
      availableForSale: z.boolean(),
      descriptionHtml: z.string(),
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
              url: z.string(),
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
  }),
});
