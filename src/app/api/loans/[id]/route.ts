import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateEMI, generateEmiSchedule } from "@/lib/loan-calculator";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: {
      borrower: true,
      repayments: { orderBy: { emiNumber: "asc" } },
    },
  });

  if (!loan) {
    return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  }

  return NextResponse.json(loan);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.loan.findUnique({
    where: { id },
    include: { repayments: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  }

  const emiAmount = calculateEMI(
    body.amount ?? existing.amount,
    body.interestRate ?? existing.interestRate,
    body.tenureMonths ?? existing.tenureMonths
  );

  const newStatus = body.status ?? existing.status;
  const wasActive = existing.status === "ACTIVE";
  const isActive = newStatus === "ACTIVE";
  const isApproved = newStatus === "APPROVED" || isActive;
  const startDate = body.startDate
    ? new Date(body.startDate)
    : existing.startDate ?? new Date();

  const loan = await prisma.loan.update({
    where: { id },
    data: {
      borrowerId: body.borrowerId ?? existing.borrowerId,
      amount: body.amount ?? existing.amount,
      interestRate: body.interestRate ?? existing.interestRate,
      tenureMonths: body.tenureMonths ?? existing.tenureMonths,
      emiAmount,
      status: newStatus,
      approvalDate:
        isApproved && !existing.approvalDate ? new Date() : existing.approvalDate,
      startDate: isActive ? startDate : existing.startDate,
    },
    include: { borrower: true, repayments: true },
  });

  if (isActive && !wasActive && existing.repayments.length === 0) {
    const schedule = generateEmiSchedule(
      loan.id,
      loan.amount,
      loan.interestRate,
      loan.tenureMonths,
      startDate
    );
    await prisma.repayment.createMany({ data: schedule });
  }

  return NextResponse.json(loan);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.loan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
