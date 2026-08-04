import { prisma } from "db";

const API_KEY_LENGTH = 20;
const ALPHABET_SET = "zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP";

export abstract class ApiKeyService {
  static createRandomApiKey() {
    let suffixKey = "";
    for (let i = 0; i < API_KEY_LENGTH; i++) {
      suffixKey +=
        ALPHABET_SET[Math.floor(Math.random() * ALPHABET_SET.length)];
    }
    return `sk-or-v1-${suffixKey}`;
  }

  static async createApiKey(
    name: string,
    userId: number,
  ): Promise<{
    id: string;
    apikey: string;
  }> {
    const apikey = ApiKeyService.createRandomApiKey();
    const apikeyDb = await prisma.apiKey.create({
      data: {
        name,
        apikey,
        userId,
      },
    });

    return {
      id: apikeyDb.id.toString(),
      apikey,
    };
  }

  static async getApiKeys(userId: number) {
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: userId,
        deleted: false,
      },
    });

    return apiKeys.map((apikey) => ({
      id: apikey.id.toString(),
      apikey: apikey.apikey,
      name: apikey.name,
      lastUsed: apikey.lastUsed,
      creditsConsumed: apikey.creditsConsumed,
    }));
  }

  static async updateApiKeyDisabled(
    apikeyId: number,
    userId: number,
    disabled: boolean,
  ) {
    await prisma.apiKey.update({
      where: {
        id: apikeyId,
        userId,
      },
      data: {
        disabled,
      },
    });
  }
  static async delete(id: number, userId: number) {
    await prisma.apiKey.update({
      where: {
        id,
        userId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
