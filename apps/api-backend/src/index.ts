import bearer from "@elysiajs/bearer";
import { prisma } from "db";
import { Elysia, t } from "elysia";
import { Conversation } from "./types";
import { Gemini } from "./llms/Gemini";
import { LlmResponse } from "./llms/Base";

const app = new Elysia()
  .use(bearer())
  .post("/api/v1/chat/completions", async ({ status, bearer: apikey, body }) => {
    const model = body.model;
    const [_companyName, providerModelName] = model.split("/");
    const apiKeyDb = await prisma.apiKey.findFirst({
      where: {
        apikey,
        disabled: false,
        deleted: false
      },
      select: {
        user: true
      }
    })

    if (!apiKeyDb) {
      return status(403, {
        message: "Invalid api key"
      })
    }

    if (apiKeyDb?.user.credits <= 0) {
      return status(403, {
        message: "You dont have enough credits in your db"
      })
    }

    const modelDb = await prisma.model.findFirst({
      where: {
        slug: model
      }
    })

    if (!modelDb) {
      return status(403, {
        message: "This is an invalid model we dont support"
      })
    }

    const providers = await prisma.modelProviderMapping.findMany({
      where: {
        modelId: modelDb.id
      },
      include: {
        provider: true
      }
    })

    const provider = providers[Math.floor(Math.random() * providers.length)];

    let response: LlmResponse | null = null
    if (provider.provider.name === "Google API" || provider.provider.name === "Google Vertex") {
      try {
        response = await Gemini.chat(providerModelName, body.messages)
      } catch (err: any) {
        const msg = err?.message ?? "";
        const statusCode = err?.status ?? err?.statusCode ?? err?.code ?? 0;
        // 429 = quota exceeded / rate limited
        if (statusCode === 429 || msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate limit")) {
          return status(429, {
            message: "Google API free quota has been exhausted. Please try again later or contact the platform admin."
          })
        }
        // Any other Google API error
        return status(503, {
          message: `Google API error: ${msg || "Unknown error. Please try again later."}`
        })
      }
    }

    if (provider.provider.name === "OpenAI") {
      return status(503, {
        message: "OpenAI models are not available at the moment. Please try a Gemini model instead."
      })
    }

    if (provider.provider.name === "Claude API") {
      return status(503, {
        message: "Claude models are not available at the moment. Please try a Gemini model instead."
      })
    }

    if (!response) {
      return status(403, {
        message: "No provider found for this model"
      })
    }

    const totalTokens = response.inputTokensConsumed + response.outputTokensConsumed;
    const creditsUsed = Math.ceil((totalTokens * provider.costPer1MTokens) / 1_000_000);
    console.log(`[billing] inputTokens=${response.inputTokensConsumed} outputTokens=${response.outputTokensConsumed} totalTokens=${totalTokens} costPer1M=${provider.costPer1MTokens} creditsUsed=${creditsUsed}`);
    const res = await prisma.user.update({
      where: {
        id: apiKeyDb.user.id
      },
      data: {
        credits: {
          decrement: creditsUsed
        }
      }
    });
    const res2 = await prisma.apiKey.update({
      where: {
        apikey: apikey
      },
      data: {
        creditsConsumed: {
          increment: creditsUsed
        }
      }
    })

    return response;
  }, {
    body: Conversation
  }).listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);