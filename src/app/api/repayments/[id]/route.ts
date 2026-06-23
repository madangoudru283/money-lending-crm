import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.repayment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Repayment not found" }, { status: 404 });
  }

  const paidAmount = body.paidAmount ?? existing.amount;

  const repayment = await prisma.repayment.update({
    where: { id },
    data: {
      paidAmount,
      paidDate: new Date(),
      status: "PAID",
    },
    include: { loan: { include: { borrower: true } } },
  });

  const remaining = await prisma.repayment.count({
    where: {
      loanId: repayment.loanId,
      status: { not: "PAID" },
    },
  });

  if (remaining === 0) {
    await prisma.loan.update({
      where: { id: repayment.loanId },
      data: { status: "COMPLETED" },
    });
  }

  return NextResponse.json(repayment);
}
