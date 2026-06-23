"use client";

import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Repayment } from "@/types";

interface EmiScheduleProps {
  repayments: Repayment[];
  onRecordPayment: (repayment: Repayment) => void;
}

export default function EmiSchedule({ repayments, onRecordPayment }: EmiScheduleProps) {
  if (repayments.length === 0) {
    return (
      <Card className="p-6 text-center text-slate-500">
        No EMI schedule yet. Activate the loan to generate schedule.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">EMI #</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Due Date</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Paid</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {repayments.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{r.emiNumber}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(r.dueDate)}</td>
                <td className="px-4 py-3 text-slate-600">{formatCurrency(r.amount)}</td>
                <td className="px-4 py-3 text-slate-600">
                  {r.paidAmount > 0 ? formatCurrency(r.paidAmount) : "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge status={r.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {r.status !== "PAID" && (
                    <Button size="sm" onClick={() => onRecordPayment(r)}>
                      Record Payment
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
