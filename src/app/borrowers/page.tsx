import PageHeader from "@/components/ui/PageHeader";
import BorrowerTable from "@/components/borrowers/BorrowerTable";

export default function BorrowersPage() {
  return (
    <div>
      <PageHeader
        title="Borrower Management"
        description="Manage borrower profiles and KYC details"
        actionLabel="Add Borrower"
        actionHref="/borrowers/new"
      />
      <BorrowerTable />
    </div>
  );
}
