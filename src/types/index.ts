export type LeadStatus = "NEW" | "CONTACTED" | "APPROVED" | "REJECTED";
export type LoanStatus =
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "DEFAULTED";
export type RepaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export interface Borrower {
  id: string;
  name: string;
  phone: string;
  address: string;
  aadhaar: string;
  occupation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  borrowerId: string;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  borrower?: Borrower;
}

export interface Loan {
  id: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  status: LoanStatus;
  approvalDate: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
  borrower?: Borrower;
  repayments?: Repayment[];
}

export interface Repayment {
  id: string;
  loanId: string;
  emiNumber: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  paidDate: string | null;
  status: RepaymentStatus;
  loan?: Loan;
}

export interface DashboardStats {
  totalLeads: number;
  activeLoans: number;
  overdueLoans: number;
  totalCollection: number;
}
