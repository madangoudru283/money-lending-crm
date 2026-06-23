import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const borrowers = await prisma.borrower.findMany({
    include: {
      _count: { select: { leads: true, loans: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(borrowers);
}

export async function POST(request: Request) {
  const body = await request.json();

  const borrower = await prisma.borrower.create({
    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
      aadhaar: body.aadhaar,
      occupation: body.occupation,
    },
  });

  return NextResponse.json(borrower, { status: 201 });
}
