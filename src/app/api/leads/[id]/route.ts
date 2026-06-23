import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { borrower: true },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(lead);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      borrowerId: body.borrowerId,
      status: body.status,
      notes: body.notes || null,
    },
    include: { borrower: true },
  });

  return NextResponse.json(lead);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
