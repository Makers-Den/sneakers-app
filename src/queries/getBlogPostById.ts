import {
  ShopifyBlogPostFieldKey,
  ShopifyMetaFieldKey,
  ShopifyMetaFieldNamespace,
} from "@/types/shopify";
import { z } from "zod";

export interface GetBlogPostByIdVars {
  id: string;
  productImage: {
    maxWidth: number;
    maxHeight: number;
  };
  image: {
    maxWidth: number;
    maxHeight: number;
  };
}

export function getBlogPostsByIdQuery({
  id,
  image,
  productImage,
}: GetBlogPostByIdVars) {
  return `
query GetBlogPostByIdQuery {
  metaobject(id: "${id}") {
    id
    handle
    type
    fields {
      key
      value
      references(first: 10) {
        nodes {
          ... on Product {
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
                amount,
                currencyCode
              }
            },
            media(first: 1) {
              nodes {
                previewImage {
                  resizedUrl: url(transform: { maxHeight: ${productImage.maxHeight}, maxWidth: ${productImage.maxWidth} })
                }
              }
            },
            metafields(identifiers: [
              {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelVariant}"},
              {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelIsForMen}"},
              {namespace: "${ShopifyMetaFieldNamespace.Shoe}", key: "${ShopifyMetaFieldKey.ModelDropOffsetDays}"}
            ]) {
              value,
              key
            }
          }
        }
      },
      reference {
        ... on MediaImage {
          id
          image {
            url(transform: {maxHeight: ${image.maxHeight}, maxWidth: ${image.maxWidth}})
          }
        }
      }
    }
  }
}
`;
}

const productSchema = z.object({
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

const metaObjectSchema = z.object({
  handle: z.string(),
  id: z.string(),
  type: z.string(),
  fields: z.array(
    z.union([
      z.object({
        key: z.literal(ShopifyBlogPostFieldKey.Category),
        value: z.string(),
      }),
      z.object({
        key: z.literal(ShopifyBlogPostFieldKey.Content),
        value: z.string(),
      }),
      z.object({
        key: z.literal(ShopifyBlogPostFieldKey.Date),
        value: z.string(),
      }),
      z.object({
        key: z.literal(ShopifyBlogPostFieldKey.Products),
        value: z.string(),
        references: z
          .object({
            nodes: z.array(productSchema),
          })
          .nullable(),
      }),
      z.object({
        key: z.literal(ShopifyBlogPostFieldKey.Thumbnail),
        value: z.string(),
        reference: z
          .object({
            id: z.string().optional(),
            image: z
              .object({
                url: z.string(),
              })
              .optional(),
          })
          .nullable(),
      }),
      z.object({
        key: z.literal(ShopifyBlogPostFieldKey.Title),
        value: z.string(),
      }),
      z.object({
        key: z.string(),
        value: z.string(),
        references: z
          .object({
            nodes: z.array(productSchema),
          })
          .nullable(),
        reference: z.object({}).nullable(),
      }),
    ])
  ),
});

export const getBlogPostByIdSchema = z.object({
  data: z.object({
    metaobject: metaObjectSchema,
  }),
});
