import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const leads = await prisma.lead.findMany({
    include: { borrower: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();

  const lead = await prisma.lead.create({
    data: {
      borrowerId: body.borrowerId,
      status: body.status ?? "NEW",
      notes: body.notes || null,
    },
    include: { borrower: true },
  });

  return NextResponse.json(lead, { status: 201 });
}
