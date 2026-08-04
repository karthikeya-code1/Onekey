import { t } from "elysia";

t;

export namespace ApiKeyModel {
  export const createApiKeySchema = t.Object({
    name: t.String(),
  });

  export type createapiKeySchema = typeof createApiKeySchema.static;

  export const createapiKeyResponse = t.Object({
    id: t.String(),
    apikey: t.String(),
  });

  export type createapiKeyResponse = typeof createapiKeyResponse.static;

  export const updateApikeySchema = t.Object({
    id: t.String(),
    disabled: t.Boolean(),
  });

  export type updatepiKeySchema = typeof updateApikeySchema.static;

  export const updateapiKeyResponseSchema = t.Object({
    message: t.Literal("Disabled Successfully"),
  });

  export type updateApiKeyResponseSchema = typeof updateApikeySchema.static;

  export const disableapiKeyFailedResponseSchema = t.Object({
    message: t.Literal("unsuccessful"),
  });

  export type disableapiKeyFailedResponse =
    typeof disableapiKeyFailedResponseSchema.static;

  export const getApiKeyResponseSchema = t.Object({
    apiKeys: t.Array(
      t.Object({
        id: t.String(),
        apikey: t.String(),
        name: t.String(),
        lastUsed: t.Nullable(t.Date()),
        creditsConsumed: t.Number(),
      }),
    ),
  });

  export type getApiKeyResponseSchema = typeof getApiKeyResponseSchema.static;

  export const deletedapiKeyResponseSchmea = t.Object({
    message: t.Literal("Api key Deleted Successfully"),
  });

  export type deletedapiKeyResponseSchmea =
    typeof deletedapiKeyResponseSchmea.static;

  export const deleteapiKeyFailedResponseSchema = t.Object({
    message: t.Literal("Deletion failed"),
  });

  export type deleteapiKeyFailedResponse =
    typeof deleteapiKeyFailedResponseSchema.static;
}
