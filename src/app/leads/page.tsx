import PageHeader from "@/components/ui/PageHeader";
import LeadTable from "@/components/leads/LeadTable";

export default function LeadsPage() {
  return (
    <div>
      <PageHeader
        title="Leads Management"
        description="Track and manage loan inquiry leads"
        actionLabel="Add Lead"
        actionHref="/leads/new"
      />
      <LeadTable />
    </div>
  );
}
