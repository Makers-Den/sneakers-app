import { z } from "zod";

export interface GetMetaObjectsVars {
  id: string;
  image?: {
    maxWidth: number;
    maxHeight: number;
  };
}

export function getMetaObjectQuery({
  id,
  image = { maxHeight: 400, maxWidth: 400 },
}: GetMetaObjectsVars) {
  return `
query GetMetaObjectQuery {
  metaobject(id: "${id}") {
    id
    handle
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

export const getMetaObjectSchema = z.object({
  data: z.object({
    metaobject: metaObjectSchema,
  }),
});
