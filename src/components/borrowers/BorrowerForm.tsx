"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import type { Borrower } from "@/types";

interface BorrowerFormProps {
  borrower?: Borrower;
}

export default function BorrowerForm({ borrower }: BorrowerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: borrower?.name || "",
    phone: borrower?.phone || "",
    address: borrower?.address || "",
    aadhaar: borrower?.aadhaar || "",
    occupation: borrower?.occupation || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = borrower ? `/api/borrowers/${borrower.id}` : "/api/borrowers";
    const method = borrower ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/borrowers");
    router.refresh();
  };

  return (
    <Card className="max-w-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <Input
          label="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <Input
          label="Aadhaar Number"
          value={form.aadhaar}
          onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
          placeholder="XXXX-XXXX-XXXX"
          required
        />
        <Input
          label="Occupation"
          value={form.occupation}
          onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          required
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : borrower ? "Update Borrower" : "Add Borrower"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
