export function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return Math.round((principal / months) * 100) / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi * 100) / 100;
}

export function generateEmiSchedule(
  loanId: string,
  principal: number,
  annualRate: number,
  months: number,
  startDate: Date
) {
  const emi = calculateEMI(principal, annualRate, months);
  const schedule = [];

  for (let i = 1; i <= months; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    schedule.push({
      loanId,
      emiNumber: i,
      dueDate,
      amount: emi,
      status: "PENDING" as const,
    });
  }

  return schedule;
}

export function getRemainingBalance(
  repayments: { amount: number; paidAmount: number }[]
) {
  return repayments.reduce((sum, r) => sum + (r.amount - r.paidAmount), 0);
}
