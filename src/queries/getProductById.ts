import { z } from "zod";
import {
  ShopifyMetaFieldKey,
  ShopifyMetaFieldNamespace,
} from "@/types/shopify";

export interface GetProductByIdVars {
  productId: string;
  maxImageWidth: number;
  maxImageHeight: number;
}

const str = ` references(first: 10) {
        nodes {
          ... on Metaobject {
            id
            fields {
              key
              type
              value
              reference {
                ... on MediaImage {
                  id
                  image {
                    url(transform: {maxHeight: 100, maxWidth: 100})
                  }
                }
              }
            }
          }
        }
      }`;

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
            resizedUrl: url(transform: { maxHeight: ${vars.maxImageHeight}, maxWidth: ${vars.maxImageWidth} })
          }
        }
      },
      metafields(identifiers: [
        {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelVariant}"},
        {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelIsForMen}"},
        {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelDropOffsetDays}"},
        {namespace: "${ShopifyMetaFieldNamespace.Custom}", key: "${ShopifyMetaFieldKey.RelatedContent}"},
      ]) {
        value,
        key,
        references(first: 10) {
          nodes {
          ... on Metaobject {
            id
            fields {
              key
              value
              reference {
                ... on MediaImage {
                  id
                  image {
                    url(transform: {maxHeight: 800, maxWidth: 800})
                  }
                }
              }
            }
          }
        }
      }
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
              resizedUrl: z.string(),
            }),
          })
        ),
      }),
      metafields: z.array(
        z.union([
          z.null(),
          z.object({
            value: z.string(),
            key: z.string(),
            references: z
              .object({
                nodes: z.array(
                  z.object({
                    id: z.string(),
                    type: z.string().optional(),
                    fields: z.array(
                      z.object({
                        key: z.string(),
                        value: z.string(),
                        reference: z
                          .object({
                            id: z.string(),
                            image: z.object({
                              url: z.string(),
                            }),
                          })
                          .or(z.object({}))
                          .nullable(),
                      })
                    ),
                  })
                ),
              })
              .nullable(),
          }),
        ])
      ),
    }),
  }),
});
