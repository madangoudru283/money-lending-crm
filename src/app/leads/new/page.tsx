import PageHeader from "@/components/ui/PageHeader";
import LeadForm from "@/components/leads/LeadForm";

export default function NewLeadPage() {
  return (
    <div>
      <PageHeader
        title="Add Lead"
        description="Create a new lead for a borrower"
      />
      <LeadForm />
    </div>
  );
}
