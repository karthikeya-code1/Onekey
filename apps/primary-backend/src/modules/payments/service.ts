import { prisma } from "db";

export abstract class PaymentService {
  static async onrampCredits(userId: number, amount: number): Promise<string> {
    const [transaction] = await prisma.$transaction([
      prisma.onrampTransactions.create({
        data: {
          userId,
          amount,
          status: "COMPLETED",
        },
      }),
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: amount,
          },
        },
      }),
    ]);

    return transaction.id.toString();
  }
}
