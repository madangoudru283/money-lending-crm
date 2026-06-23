"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { formatCurrency } from "@/lib/utils";
import type { Repayment } from "@/types";

interface PaymentModalProps {
  repayment: Repayment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  repayment,
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repayment && isOpen) {
      setAmount(repayment.amount.toString());
    }
  }, [repayment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayment) return;
    setLoading(true);

    await fetch(`/api/repayments/${repayment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paidAmount: parseFloat(amount) }),
    });

    setLoading(false);
    setAmount("");
    onSuccess();
    onClose();
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Record Payment">
      {repayment && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 text-sm">
            <p className="text-slate-500">EMI #{repayment.emiNumber}</p>
            <p className="font-medium text-slate-900">
              Due: {formatCurrency(repayment.amount)}
            </p>
          </div>
          <Input
            label="Payment Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Confirm Payment"}
            </Button>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
