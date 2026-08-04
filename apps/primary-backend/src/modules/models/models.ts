import { t } from "elysia";

export namespace ModelsModel {
  export const getModelsResponseSchema = t.Object({
    models: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        slug: t.String(),
        companyId: t.String(),
        company: t.Object({
          id: t.String(),
          name: t.String(),
          website: t.String(),
        }),
      }),
    ),
  });

  export type getModelsResponse = typeof getModelsResponseSchema.static;

  export const getProvidersResponseSchema = t.Object({
    providers: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        website: t.String(),
      }),
    ),
  });

  export type getProvidersResponse = typeof getProvidersResponseSchema.static;

  export const getMappingsResponseSchema = t.Object({
    mappings: t.Array(
      t.Object({
        id: t.String(),
        modelId: t.String(),
        providerId: t.String(),
        costPer1MTokens: t.Number(),
        model: t.Object({
          id: t.String(),
          name: t.String(),
          slug: t.String(),
        }),
        provider: t.Object({
          id: t.String(),
          name: t.String(),
          website: t.String(),
        }),
      }),
    ),
  });

  export type getMappingsResponse = typeof getMappingsResponseSchema.static;

  export const getProvidersForModelParamsSchema = t.Object({
    id: t.String(),
  });

  export const getProvidersForModelResponseSchema = t.Object({
    mappings: t.Array(
      t.Object({
        id: t.String(),
        modelId: t.String(),
        providerId: t.String(),
        providersName: t.String(),
        providersWebsite: t.String(),
        costPer1MTokens: t.Number(),
      }),
    ),
  });
}
