"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";
import type { Borrower, Lead } from "@/types";

interface LeadFormProps {
  lead?: Lead;
}

export default function LeadForm({ lead }: LeadFormProps) {
  const router = useRouter();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    borrowerId: lead?.borrowerId || "",
    status: lead?.status || "NEW",
    notes: lead?.notes || "",
  });

  useEffect(() => {
    fetch("/api/borrowers")
      .then((r) => r.json())
      .then(setBorrowers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = lead ? `/api/leads/${lead.id}` : "/api/leads";
    const method = lead ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/leads");
    router.refresh();
  };

  return (
    <Card className="max-w-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Borrower"
          value={form.borrowerId}
          onChange={(e) => setForm({ ...form, borrowerId: e.target.value })}
          options={[
            { value: "", label: "Select borrower" },
            ...borrowers.map((b) => ({ value: b.id, label: b.name })),
          ]}
          required
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { value: "NEW", label: "New" },
            { value: "CONTACTED", label: "Contacted" },
            { value: "APPROVED", label: "Approved" },
            { value: "REJECTED", label: "Rejected" },
          ]}
        />
        <Input
          label="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Optional notes"
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : lead ? "Update Lead" : "Add Lead"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
