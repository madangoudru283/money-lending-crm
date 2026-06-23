import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const borrower = await prisma.borrower.findUnique({
    where: { id },
    include: {
      leads: true,
      loans: { include: { repayments: true } },
    },
  });

  if (!borrower) {
    return NextResponse.json({ error: "Borrower not found" }, { status: 404 });
  }

  return NextResponse.json(borrower);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  const borrower = await prisma.borrower.update({
    where: { id },
    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
      aadhaar: body.aadhaar,
      occupation: body.occupation,
    },
  });

  return NextResponse.json(borrower);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.borrower.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
