import { prisma } from "./prisma";

export async function markOverdueRepayments() {
  await prisma.repayment.updateMany({
    where: {
      status: "PENDING",
      dueDate: { lt: new Date() },
    },
    data: { status: "OVERDUE" },
  });
}
