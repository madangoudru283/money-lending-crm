import { PrismaClient } from "@prisma/client";
import { calculateEMI, generateEmiSchedule } from "../src/lib/loan-calculator";

const prisma = new PrismaClient();

async function main() {
  await prisma.repayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.borrower.deleteMany();

  const borrowers = await Promise.all([
    prisma.borrower.create({
      data: {
        name: "Rajesh Kumar",
        phone: "9876543210",
        address: "12 MG Road, Bangalore, Karnataka",
        aadhaar: "1234-5678-9012",
        occupation: "Shop Owner",
      },
    }),
    prisma.borrower.create({
      data: {
        name: "Priya Sharma",
        phone: "9876543211",
        address: "45 Park Street, Mumbai, Maharashtra",
        aadhaar: "2345-6789-0123",
        occupation: "Teacher",
      },
    }),
    prisma.borrower.create({
      data: {
        name: "Amit Patel",
        phone: "9876543212",
        address: "78 Ring Road, Ahmedabad, Gujarat",
        aadhaar: "3456-7890-1234",
        occupation: "Driver",
      },
    }),
    prisma.borrower.create({
      data: {
        name: "Sunita Devi",
        phone: "9876543213",
        address: "23 Civil Lines, Jaipur, Rajasthan",
        aadhaar: "4567-8901-2345",
        occupation: "Tailor",
      },
    }),
  ]);

  await prisma.lead.createMany({
    data: [
      { borrowerId: borrowers[0].id, status: "NEW" },
      {
        borrowerId: borrowers[1].id,
        status: "CONTACTED",
        notes: "Follow up next week for documentation",
      },
      { borrowerId: borrowers[2].id, status: "APPROVED" },
      { borrowerId: borrowers[3].id, status: "REJECTED", notes: "Insufficient income proof" },
    ],
  });

  const startDate1 = new Date("2025-01-01");
  const loan1 = await prisma.loan.create({
    data: {
      borrowerId: borrowers[0].id,
      amount: 100000,
      interestRate: 12,
      tenureMonths: 12,
      emiAmount: calculateEMI(100000, 12, 12),
      status: "ACTIVE",
      approvalDate: new Date("2024-12-15"),
      startDate: startDate1,
    },
  });

  const schedule1 = generateEmiSchedule(loan1.id, 100000, 12, 12, startDate1);
  await prisma.repayment.createMany({ data: schedule1 });

  const repayments1 = await prisma.repayment.findMany({
    where: { loanId: loan1.id },
    orderBy: { emiNumber: "asc" },
  });

  for (let i = 0; i < 4; i++) {
    await prisma.repayment.update({
      where: { id: repayments1[i].id },
      data: {
        paidAmount: repayments1[i].amount,
        paidDate: new Date(),
        status: "PAID",
      },
    });
  }

  await prisma.repayment.update({
    where: { id: repayments1[4].id },
    data: { status: "OVERDUE" },
  });

  const startDate2 = new Date("2025-06-01");
  const loan2 = await prisma.loan.create({
    data: {
      borrowerId: borrowers[1].id,
      amount: 50000,
      interestRate: 10,
      tenureMonths: 6,
      emiAmount: calculateEMI(50000, 10, 6),
      status: "ACTIVE",
      approvalDate: new Date("2025-05-20"),
      startDate: startDate2,
    },
  });

  const schedule2 = generateEmiSchedule(loan2.id, 50000, 10, 6, startDate2);
  await prisma.repayment.createMany({ data: schedule2 });

  await prisma.loan.create({
    data: {
      borrowerId: borrowers[2].id,
      amount: 75000,
      interestRate: 11,
      tenureMonths: 9,
      emiAmount: calculateEMI(75000, 11, 9),
      status: "PENDING",
    },
  });

  await prisma.loan.create({
    data: {
      borrowerId: borrowers[3].id,
      amount: 30000,
      interestRate: 14,
      tenureMonths: 6,
      emiAmount: calculateEMI(30000, 14, 6),
      status: "APPROVED",
      approvalDate: new Date("2025-06-10"),
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
