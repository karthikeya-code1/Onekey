import { t } from "elysia";

export namespace PaymentModel {
  export const onrampBodySchema = t.Object({
    amount: t.Number({ minimum: 1, description: "Number of credits to purchase" }),
  });

  export type onrampBody = typeof onrampBodySchema.static;

  export const onrampResponseSchema = t.Object({
    message: t.Literal("Credits onramped successfully"),
    transactionId: t.String(),
  });

  export type onrampResponse = typeof onrampResponseSchema.static;

  export const onrampFailureResponseSchema = t.Object({
    message: t.Literal("Failed to onramp credits"),
  });

  export type onrampFailureResponse = typeof onrampFailureResponseSchema.static;
}
