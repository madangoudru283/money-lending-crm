"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";
import { calculateEMI } from "@/lib/loan-calculator";
import { formatCurrency } from "@/lib/utils";
import type { Borrower } from "@/types";

export default function LoanForm() {
  const router = useRouter();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    borrowerId: "",
    amount: "",
    interestRate: "12",
    tenureMonths: "12",
    status: "PENDING",
    startDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetch("/api/borrowers")
      .then((r) => r.json())
      .then(setBorrowers);
  }, []);

  const emiPreview =
    form.amount && form.interestRate && form.tenureMonths
      ? calculateEMI(
          parseFloat(form.amount),
          parseFloat(form.interestRate),
          parseInt(form.tenureMonths)
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        borrowerId: form.borrowerId,
        amount: parseFloat(form.amount),
        interestRate: parseFloat(form.interestRate),
        tenureMonths: parseInt(form.tenureMonths),
        status: form.status,
        startDate: form.startDate,
      }),
    });

    router.push("/loans");
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
        <Input
          label="Loan Amount (₹)"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          min="1000"
        />
        <Input
          label="Interest Rate (% per annum)"
          type="number"
          step="0.1"
          value={form.interestRate}
          onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
          required
        />
        <Input
          label="Tenure (months)"
          type="number"
          value={form.tenureMonths}
          onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
          required
          min="1"
        />
        <Select
          label="Loan Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { value: "PENDING", label: "Pending" },
            { value: "APPROVED", label: "Approved" },
            { value: "ACTIVE", label: "Active (generate EMI schedule)" },
          ]}
        />
        {form.status === "ACTIVE" && (
          <Input
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
        )}
        {emiPreview > 0 && (
          <div className="rounded-lg bg-indigo-50 p-4">
            <p className="text-sm text-indigo-600">Estimated EMI</p>
            <p className="text-xl font-bold text-indigo-900">
              {formatCurrency(emiPreview)}
            </p>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Loan Application"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
