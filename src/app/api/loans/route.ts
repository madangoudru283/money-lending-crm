import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateEMI, generateEmiSchedule } from "@/lib/loan-calculator";

export async function GET() {
  const loans = await prisma.loan.findMany({
    include: { borrower: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(loans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const emiAmount = calculateEMI(
    body.amount,
    body.interestRate,
    body.tenureMonths
  );

  const status = body.status ?? "PENDING";
  const isActive = status === "ACTIVE";
  const isApproved = status === "APPROVED" || isActive;
  const startDate = body.startDate ? new Date(body.startDate) : new Date();

  const loan = await prisma.loan.create({
    data: {
      borrowerId: body.borrowerId,
      amount: body.amount,
      interestRate: body.interestRate,
      tenureMonths: body.tenureMonths,
      emiAmount,
      status,
      approvalDate: isApproved ? new Date() : null,
      startDate: isActive ? startDate : null,
    },
    include: { borrower: true },
  });

  if (isActive) {
    const schedule = generateEmiSchedule(
      loan.id,
      body.amount,
      body.interestRate,
      body.tenureMonths,
      startDate
    );
    await prisma.repayment.createMany({ data: schedule });
  }

  return NextResponse.json(loan, { status: 201 });
}
