"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import BorrowerForm from "@/components/borrowers/BorrowerForm";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Borrower, Lead, Loan } from "@/types";

interface BorrowerDetail extends Borrower {
  leads: Lead[];
  loans: Loan[];
}

export default function BorrowerDetailPage() {
  const params = useParams();
  const [borrower, setBorrower] = useState<BorrowerDetail | null>(null);

  useEffect(() => {
    fetch(`/api/borrowers/${params.id}`)
      .then((r) => r.json())
      .then(setBorrower);
  }, [params.id]);

  if (!borrower) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={borrower.name} description="Borrower profile details" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Personal Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium text-slate-900">{borrower.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Aadhaar</dt>
              <dd className="font-medium text-slate-900">{borrower.aadhaar}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Occupation</dt>
              <dd className="font-medium text-slate-900">{borrower.occupation}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Address</dt>
              <dd className="mt-1 font-medium text-slate-900">{borrower.address}</dd>
            </div>
          </dl>
          <Link
            href={`/borrowers/${borrower.id}/edit`}
            className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
          >
            Edit borrower
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-slate-900">Loans ({borrower.loans.length})</h2>
          {borrower.loans.length === 0 ? (
            <p className="text-sm text-slate-500">No loans yet</p>
          ) : (
            <div className="space-y-3">
              {borrower.loans.map((loan) => (
                <Link
                  key={loan.id}
                  href={`/loans/${loan.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {formatCurrency(loan.amount)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {loan.interestRate}% · {loan.tenureMonths} months
                    </p>
                  </div>
                  <Badge status={loan.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-slate-900">Leads ({borrower.leads.length})</h2>
        {borrower.leads.length === 0 ? (
          <p className="text-sm text-slate-500">No leads</p>
        ) : (
          <div className="space-y-2">
            {borrower.leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <span className="text-sm text-slate-600">
                  {formatDate(lead.createdAt)}
                </span>
                <Badge status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
