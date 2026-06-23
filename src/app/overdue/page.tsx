"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Repayment } from "@/types";

export default function OverduePage() {
  const [overdue, setOverdue] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overdue")
      .then((r) => r.json())
      .then((data) => {
        setOverdue(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Loading overdue loans...</p>;

  return (
    <div>
      <PageHeader
        title="Overdue Loans"
        description="EMIs that are past their due date"
      />

      {overdue.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-medium text-emerald-600">All clear!</p>
          <p className="mt-1 text-sm text-slate-500">No overdue EMIs at the moment.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Borrower</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">EMI #</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Due Date</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdue.map((r) => (
                  <tr key={r.id} className="hover:bg-red-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {r.loan?.borrower?.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.loan?.borrower?.phone}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.emiNumber}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">
                      {formatDate(r.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/loans/${r.loanId}`}>
                        <Button size="sm">View Loan</Button>
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
