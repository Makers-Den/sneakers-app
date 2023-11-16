import { z } from "zod";

export interface CreateCheckoutVars {
  variantId: string;
}

export function createCheckoutMutation(vars: CreateCheckoutVars) {
  return `
  mutation ChekoutCreateMutation {
    checkoutCreate(
      input: {lineItems: [{variantId: "${vars.variantId}", quantity: 1}]}
    ) {
      checkout {
        webUrl
      }
    }
  }
`;
}

export const createCheckoutSchema = z.object({
  data: z.object({
    checkoutCreate: z.object({
      checkout: z.object({
        webUrl: z.string().url(),
      }),
    }),
  }),
});
