import { format } from "date-fns";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd MMM yyyy");
}

export const leadStatusLabels: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const loanStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  DEFAULTED: "Defaulted",
};

export const repaymentStatusLabels: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
};
