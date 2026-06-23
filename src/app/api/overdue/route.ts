import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markOverdueRepayments } from "@/lib/overdue";

export async function GET() {
  await markOverdueRepayments();

  const overdue = await prisma.repayment.findMany({
    where: { status: "OVERDUE" },
    include: {
      loan: { include: { borrower: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(overdue);
}
