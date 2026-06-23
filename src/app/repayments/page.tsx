"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Repayment } from "@/types";

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/repayments")
      .then((r) => r.json())
      .then((data) => {
        setRepayments(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Loading repayments...</p>;

  return (
    <div>
      <PageHeader
        title="Repayment Tracking"
        description="View all EMI schedules and payment status"
      />

      {repayments.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">
          No repayments yet. Activate a loan to generate EMI schedule.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Borrower</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">EMI #</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Due Date</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Loan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repayments.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {r.loan?.borrower?.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.emiNumber}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(r.dueDate)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(r.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/loans/${r.loanId}`}
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
