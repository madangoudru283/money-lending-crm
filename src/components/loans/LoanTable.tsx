"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Loan } from "@/types";

export default function LoanTable() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/loans")
      .then((r) => r.json())
      .then((data) => {
        setLoans(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-slate-500">Loading loans...</p>;

  if (loans.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500">
        No loan applications yet.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Borrower</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Interest</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">EMI</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Approval</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {loan.borrower?.name}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatCurrency(loan.amount)}
                </td>
                <td className="px-4 py-3 text-slate-600">{loan.interestRate}%</td>
                <td className="px-4 py-3 text-slate-600">
                  {formatCurrency(loan.emiAmount)}
                </td>
                <td className="px-4 py-3">
                  <Badge status={loan.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {loan.approvalDate ? formatDate(loan.approvalDate) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Link href={`/loans/${loan.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
