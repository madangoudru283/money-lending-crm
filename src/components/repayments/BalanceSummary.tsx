import Card from "../ui/Card";
import { formatCurrency } from "@/lib/utils";

interface BalanceSummaryProps {
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
}

export default function BalanceSummary({
  totalAmount,
  paidAmount,
  remainingBalance,
}: BalanceSummaryProps) {
  const progress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="p-4">
        <p className="text-sm text-slate-500">Total Payable</p>
        <p className="mt-1 text-xl font-bold text-slate-900">
          {formatCurrency(totalAmount)}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-slate-500">Total Paid</p>
        <p className="mt-1 text-xl font-bold text-emerald-600">
          {formatCurrency(paidAmount)}
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-sm text-slate-500">Remaining Balance</p>
        <p className="mt-1 text-xl font-bold text-red-600">
          {formatCurrency(remainingBalance)}
        </p>
      </Card>
      <Card className="col-span-full p-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-500">Repayment Progress</span>
          <span className="font-medium text-slate-700">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>
    </div>
  );
}
