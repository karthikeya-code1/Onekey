import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./models";

export const app = new Elysia({ prefix: "/api-keys" })
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
    "/",
    async ({ userId, body }) => {
      const { apikey, id } = await ApiKeyService.createApiKey(
        body.name,
        Number(userId),
      );
      return {
        id,
        apikey,
      };
    },
    {
      body: ApiKeyModel.createApiKeySchema,
      response: {
        200: ApiKeyModel.createapiKeyResponse,
      },
    },
  )

  .get(
    "/",
    async ({ userId }) => {
      const apiKeys = await ApiKeyService.getApiKeys(Number(userId));
      return {
        apiKeys: apiKeys,
      };
    },
    {
      response: {
        200: ApiKeyModel.getApiKeyResponseSchema,
      },
    },
  )
  .put(
    "/",
    async ({ body, userId, status }) => {
      try {
        await ApiKeyService.updateApiKeyDisabled(
          Number(body.id),
          Number(userId),
          body.disabled,
        );
        return {
          message: "Disabled Successfully",
        };
      } catch (e) {
        return status(411, {
          message: "unsuccessful",
        });
      }
    },
    {
      body: ApiKeyModel.updateApikeySchema,
      response: {
        200: ApiKeyModel.updateapiKeyResponseSchema,
        411: ApiKeyModel.disableapiKeyFailedResponseSchema,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, userId, status }) => {
      try {
        await ApiKeyService.delete(Number(id), Number(userId));
        return {
          message: "Api key Deleted Successfully",
        };
      } catch (e) {
        return status(411, {
          message: "Deletion failed",
        });
      }
    },
    {
      response: {
        200: ApiKeyModel.deletedapiKeyResponseSchmea,
        411: ApiKeyModel.deleteapiKeyFailedResponseSchema,
      },
    },
  );
