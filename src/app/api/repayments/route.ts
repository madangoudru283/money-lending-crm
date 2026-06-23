import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const loanId = searchParams.get("loanId");

  const repayments = await prisma.repayment.findMany({
    where: loanId ? { loanId } : undefined,
    include: {
      loan: { include: { borrower: true } },
    },
    orderBy: [{ loanId: "asc" }, { emiNumber: "asc" }],
  });

  return NextResponse.json(repayments);
}
