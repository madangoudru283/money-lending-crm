"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BalanceSummary from "@/components/repayments/BalanceSummary";
import EmiSchedule from "@/components/repayments/EmiSchedule";
import PaymentModal from "@/components/repayments/PaymentModal";
import { getRemainingBalance } from "@/lib/loan-calculator";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Loan, Repayment } from "@/types";

export default function LoanDetailPage() {
  const params = useParams();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [selectedRepayment, setSelectedRepayment] = useState<Repayment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activating, setActivating] = useState(false);

  const fetchLoan = useCallback(() => {
    fetch(`/api/loans/${params.id}`)
      .then((r) => r.json())
      .then(setLoan);
  }, [params.id]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  const handleActivate = async () => {
    if (!loan) return;
    setActivating(true);
    await fetch(`/api/loans/${loan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACTIVE", startDate: new Date().toISOString() }),
    });
    setActivating(false);
    fetchLoan();
  };

  if (!loan) return <p className="text-slate-500">Loading...</p>;

  const repayments = loan.repayments || [];
  const totalAmount = repayments.reduce((s, r) => s + r.amount, 0);
  const paidAmount = repayments.reduce((s, r) => s + r.paidAmount, 0);
  const remainingBalance = getRemainingBalance(repayments);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Loan - ${loan.borrower?.name}`}
        description={`Application for ${formatCurrency(loan.amount)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Amount</p>
          <p className="text-xl font-bold">{formatCurrency(loan.amount)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Interest Rate</p>
          <p className="text-xl font-bold">{loan.interestRate}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">EMI Amount</p>
          <p className="text-xl font-bold">{formatCurrency(loan.emiAmount)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Status</p>
          <div className="mt-2">
            <Badge status={loan.status} />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Tenure</dt>
            <dd className="font-medium">{loan.tenureMonths} months</dd>
          </div>
          <div>
            <dt className="text-slate-500">Approval Date</dt>
            <dd className="font-medium">
              {loan.approvalDate ? formatDate(loan.approvalDate) : "Not approved"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Start Date</dt>
            <dd className="font-medium">
              {loan.startDate ? formatDate(loan.startDate) : "Not started"}
            </dd>
          </div>
        </dl>
        {(loan.status === "PENDING" || loan.status === "APPROVED") && (
          <Button className="mt-4" onClick={handleActivate} disabled={activating}>
            {activating ? "Activating..." : "Activate Loan & Generate EMI Schedule"}
          </Button>
        )}
      </Card>

      {repayments.length > 0 && (
        <>
          <BalanceSummary
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            remainingBalance={remainingBalance}
          />
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">EMI Schedule</h2>
            <EmiSchedule
              repayments={repayments}
              onRecordPayment={(r) => {
                setSelectedRepayment(r);
                setModalOpen(true);
              }}
            />
          </div>
        </>
      )}

      <PaymentModal
        repayment={selectedRepayment}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRepayment(null);
        }}
        onSuccess={fetchLoan}
      />
    </div>
  );
}
