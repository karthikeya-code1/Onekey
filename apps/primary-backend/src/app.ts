import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { app as authapp } from "./modules/auth";
import { app as apiKeyApp } from "./modules/apikeys";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";

export const app = new Elysia()
  .use(cors())
  .get("/", () => ({ status: "ok", message: "OneKey Primary Backend is running 🦊" }))
  .use(authapp)
  .use(apiKeyApp)
  .use(modelsApp)
  .use(paymentsApp);

export type App = typeof app;
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
