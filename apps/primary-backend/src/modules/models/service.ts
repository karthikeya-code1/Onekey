import { prisma } from "db";

export abstract class ModelService {
  static async getModels() {
    const models = await prisma.model.findMany({
      include: {
        company: true,
      },
    });

    return models.map((m) => ({
      id: m.id.toString(),
      name: m.name,
      slug: m.slug,
      companyId: m.companyId.toString(),
      company: {
        id: m.company.id.toString(),
        name: m.company.name,
        website: m.company.website,
      },
    }));
  }

  static async getProviders() {
    const providers = await prisma.provider.findMany();

    return providers.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      website: p.website,
    }));
  }

  static async getMappingsByModelId(modelId: number) {
    const mappings = await prisma.modelProviderMapping.findMany({
      where: {
        modelId,
      },
      include: {
        provider: true,
      },
    });

    return mappings.map((m) => ({
      id: m.id.toString(),
      modelId: m.modelId.toString(),
      providerId: m.providerId.toString(),
      providersName: m.provider.name,
      providersWebsite: m.provider.website,
      costPer1MTokens: m.costPer1MTokens,
    }));
  }
}
