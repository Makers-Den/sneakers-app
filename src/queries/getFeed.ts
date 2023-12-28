import { z } from "zod";
import {
  ShopifyFieldKey,
  ShopifyMetaFieldKey,
  ShopifyMetaFieldNamespace,
  ShopifyMetaObjectType,
} from "@/types/shopify";
import { envVariables } from "@/lib/env";

export interface GetFeedIdVars {
  maxImageWidth: number;
  maxImageHeight: number;
  page?: number;
  perPage?: number;
  cursor?: string;
}

export function getFeedQuery({
  page = 1,
  perPage = 20,
  cursor,
  ...vars
}: GetFeedIdVars) {
  const cursorQuery = cursor ? `, after: "${cursor}"` : "";

  return `
query GetFeed {
  metaobject(id: "${envVariables.shopify.metaObjectId.feed}") {
    handle
    id
    type
    fields {
      key
      value
      references(first: ${perPage}${cursorQuery}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ... on Metaobject {
              handle
              id
              type
              fields {
                key
                value
                reference {
                  ... on Product {
                    id
                    title
                    availableForSale,
                    variants(first: 50) {
                        nodes {
                            id
                            title
                        }
                    }
                    priceRange {
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    media(first: 1) {
                        nodes {
                            previewImage {
                                resizedUrl: url(transform: { maxHeight: ${vars.maxImageHeight}, maxWidth: ${vars.maxImageWidth} })
                            }
                        }
                    }
                    metafields(identifiers: [
                        {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelVariant}"},
                        {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelIsForMen}"},
                        {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelDropOffsetDays}"},
                    ]) {
                        value
                        key
                    }
                  }
                  ... on MediaImage {
                    id
                    image {
                      url(transform: { maxHeight: ${vars.maxImageHeight}, maxWidth: ${vars.maxImageWidth} })
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
}
`;
}

const product = z.object({
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
});

const metaObject = z.object({
  handle: z.string(),
  id: z.string(),
  type: z.enum([ShopifyMetaObjectType.blogPost, ShopifyMetaObjectType.product]),
  fields: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      reference: z.union([
        product,
        z.null(),
        z.object({
          id: z.string().optional(),
          image: z
            .object({
              url: z.string(),
            })
            .optional(),
        }),
      ]),
    })
  ),
});

const references = z.object({
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    endCursor: z.string().nullable(),
  }),
  edges: z.array(z.object({ node: metaObject })),
});

export type ProductQuery = z.infer<typeof product>;

export const getFeedSchema = z.object({
  data: z.object({
    metaobject: z.object({
      fields: z.array(
        z.object({
          key: z.nativeEnum(ShopifyFieldKey),
          value: z.string(),
          references,
        })
      ),
    }),
  }),
});
