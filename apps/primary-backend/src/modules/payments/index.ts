import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PaymentService } from "./service";
import { PaymentModel } from "./models";

export const app = new Elysia({ prefix: "/payments" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    }),
  )
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    if (!auth) {
      return status(401);
    }

    const decoded = await jwt.verify(auth.value as string);

    if (!decoded || !decoded.userId) {
      return status(401);
    }

    return {
      userId: decoded.userId as string,
    };
  })
  .post(
    "/onramp",
    async ({ userId, body, status }) => {
      try {
        const transactionId = await PaymentService.onrampCredits(
          Number(userId),
          body.amount,
        );
        return {
          message: "Credits onramped successfully" as const,
          transactionId,
        };
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Failed to onramp credits" as const,
        });
      }
    },
    {
      body: PaymentModel.onrampBodySchema,
      response: {
        200: PaymentModel.onrampResponseSchema,
        400: PaymentModel.onrampFailureResponseSchema,
      },
    },
  );
