import PageHeader from "@/components/ui/PageHeader";
import LoanTable from "@/components/loans/LoanTable";

export default function LoansPage() {
  return (
    <div>
      <PageHeader
        title="Loan Applications"
        description="Manage loan applications and approvals"
        actionLabel="New Application"
        actionHref="/loans/new"
      />
      <LoanTable />
    </div>
  );
}
