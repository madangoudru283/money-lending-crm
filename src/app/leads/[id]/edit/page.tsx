"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import LeadForm from "@/components/leads/LeadForm";
import type { Lead } from "@/types";

export default function EditLeadPage() {
  const params = useParams();
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetch(`/api/leads/${params.id}`)
      .then((r) => r.json())
      .then(setLead);
  }, [params.id]);

  if (!lead) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <PageHeader title="Edit Lead" description={`Editing lead for ${lead.borrower?.name}`} />
      <LeadForm lead={lead} />
    </div>
  );
}
