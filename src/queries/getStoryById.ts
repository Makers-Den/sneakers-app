import { z } from "zod";

export interface GetStoryByIdVars {
  id: string;
}

export function getStoryById({ id }: GetStoryByIdVars) {
  return `
query GetStoryById {
  metaobject(id: "${id}") {
    fields {
      key
      value
      references(first: 10) {
        edges {
          node {
            ... on Metaobject {
              id
              fields {
                key
                value
                reference {
                  ... on Video {
                    id
                    sources {
                      url
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

export const storySchema = z.object({
  id: z.string(),
  value: z.string().nullable(),
  fields: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      reference: z
        .object({
          id: z.string().optional(),
          sources: z
            .array(
              z.object({
                url: z.string(),
              })
            )
            .optional(),
        })
        .nullable(),
    })
  ),
});

export type StoryNode = z.infer<typeof storySchema>;

export const metaObjectSchema = z.object({
  fields: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      references: z
        .object({
          edges: z.array(
            z.object({
              node: z.any(), // z.union([storySchema, z.object({})]),
            })
          ),
        })
        .nullable(),
    })
  ),
});

export const getStoryByIdSchema = z.object({
  data: z.object({
    metaobject: metaObjectSchema,
  }),
});
