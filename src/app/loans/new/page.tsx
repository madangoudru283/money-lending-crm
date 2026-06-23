import PageHeader from "@/components/ui/PageHeader";
import LoanForm from "@/components/loans/LoanForm";

export default function NewLoanPage() {
  return (
    <div>
      <PageHeader
        title="New Loan Application"
        description="Create a new loan application"
      />
      <LoanForm />
    </div>
  );
}
