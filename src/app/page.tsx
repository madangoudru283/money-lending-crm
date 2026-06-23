"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Landmark,
  AlertTriangle,
  IndianRupee,
  Users,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Lead, Repayment } from "@/types";

interface DashboardData {
  totalLeads: number;
  activeLoans: number;
  overdueLoans: number;
  totalCollection: number;
  recentLeads: Lead[];
  recentPayments: Repayment[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your lending business
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={data.totalLeads}
          icon={UserPlus}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Loans"
          value={data.activeLoans}
          icon={Landmark}
          color="bg-indigo-500"
        />
        <StatCard
          title="Overdue Loans"
          value={data.overdueLoans}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Total Collection"
          value={formatCurrency(data.totalCollection)}
          icon={IndianRupee}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Leads</h2>
            <Link href="/leads" className="text-sm text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          {data.recentLeads.length === 0 ? (
            <p className="text-sm text-slate-500">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {lead.borrower?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  <Badge status={lead.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Payments</h2>
            <Link
              href="/repayments"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {data.recentPayments.length === 0 ? (
            <p className="text-sm text-slate-500">No payments recorded yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {payment.loan?.borrower?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      EMI #{payment.emiNumber}
                    </p>
                  </div>
                  <p className="font-semibold text-emerald-600">
                    {formatCurrency(payment.paidAmount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/borrowers">
          <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="font-medium text-slate-900">Manage Borrowers</p>
              <p className="text-xs text-slate-500">Add and edit borrower profiles</p>
            </div>
          </Card>
        </Link>
        <Link href="/loans/new">
          <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
            <Landmark className="h-8 w-8 text-indigo-600" />
            <div>
              <p className="font-medium text-slate-900">New Loan Application</p>
              <p className="text-xs text-slate-500">Create a new loan request</p>
            </div>
          </Card>
        </Link>
        <Link href="/overdue">
          <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-medium text-slate-900">Overdue Loans</p>
              <p className="text-xs text-slate-500">Review overdue EMIs</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
