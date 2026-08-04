import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { ModelService } from "./service";
import { ModelsModel } from "./models";

export const app = new Elysia({ prefix: "/models" })
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
  .get(
    "/",
    async () => {
      const models = await ModelService.getModels();
      return {
        models,
      };
    },
    {
      response: {
        200: ModelsModel.getModelsResponseSchema,
      },
    },
  )
  .get(
    "/providers",
    async () => {
      const providers = await ModelService.getProviders();
      return {
        providers,
      };
    },
    {
      response: {
        200: ModelsModel.getProvidersResponseSchema,
      },
    },
  )
  .get(
    "/:id/providers",
    async ({ params: { id } }) => {
      const mappings = await ModelService.getMappingsByModelId(Number(id));
      return {
        mappings,
      };
    },
    {
      params: ModelsModel.getProvidersForModelParamsSchema,
      response: {
        200: ModelsModel.getProvidersForModelResponseSchema,
      },
    },
  );
