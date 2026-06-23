"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import BorrowerForm from "@/components/borrowers/BorrowerForm";
import type { Borrower } from "@/types";

export default function EditBorrowerPage() {
  const params = useParams();
  const [borrower, setBorrower] = useState<Borrower | null>(null);

  useEffect(() => {
    fetch(`/api/borrowers/${params.id}`)
      .then((r) => r.json())
      .then(setBorrower);
  }, [params.id]);

  if (!borrower) return <p className="text-slate-500">Loading...</p>;

  return (
    <div>
      <PageHeader title="Edit Borrower" description={`Editing ${borrower.name}`} />
      <BorrowerForm borrower={borrower} />
    </div>
  );
}
