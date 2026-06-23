import PageHeader from "@/components/ui/PageHeader";
import BorrowerForm from "@/components/borrowers/BorrowerForm";

export default function NewBorrowerPage() {
  return (
    <div>
      <PageHeader
        title="Add Borrower"
        description="Register a new borrower"
      />
      <BorrowerForm />
    </div>
  );
}
