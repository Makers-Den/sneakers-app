import { z } from "zod";

export type MetaObjectTypes = "content_categories" | "stories" | "blog_posts";

export interface GetMetaObjectsVars {
  type: MetaObjectTypes;
  image?: {
    maxWidth: number;
    maxHeight: number;
  };
}

export function getMetaObjectsQuery({
  type,
  image = { maxHeight: 400, maxWidth: 400 },
}: GetMetaObjectsVars) {
  return `
query GetMetaObjectsQuery {
    metaobjects(type: "${type}", first: 100) {
    nodes {
      handle
      id
      type
      fields {
        key
        value
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
}
`;
}

export const metaObjectSchema = z.object({
  handle: z.string(),
  id: z.string(),
  type: z.string(),
  fields: z.array(
    z.object({
      key: z.string(),
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
    })
  ),
});

export const getMetaObjectsSchema = z.object({
  data: z.object({
    metaobjects: z.object({ nodes: z.array(metaObjectSchema) }),
  }),
});
