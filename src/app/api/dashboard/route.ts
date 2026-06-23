import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markOverdueRepayments } from "@/lib/overdue";

export async function GET() {
  await markOverdueRepayments();

  const [totalLeads, activeLoans, overdueLoans, collections, recentLeads, recentPayments] =
    await Promise.all([
      prisma.lead.count(),
      prisma.loan.count({ where: { status: "ACTIVE" } }),
      prisma.repayment.count({ where: { status: "OVERDUE" } }),
      prisma.repayment.aggregate({ _sum: { paidAmount: true } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { borrower: true },
      }),
      prisma.repayment.findMany({
        where: { status: "PAID" },
        take: 5,
        orderBy: { paidDate: "desc" },
        include: { loan: { include: { borrower: true } } },
      }),
    ]);

  return NextResponse.json({
    totalLeads,
    activeLoans,
    overdueLoans,
    totalCollection: collections._sum.paidAmount ?? 0,
    recentLeads,
    recentPayments,
  });
}
