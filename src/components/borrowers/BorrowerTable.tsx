"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import type { Borrower } from "@/types";

interface BorrowerWithCount extends Borrower {
  _count?: { leads: number; loans: number };
}

export default function BorrowerTable() {
  const [borrowers, setBorrowers] = useState<BorrowerWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrowers = async () => {
    const res = await fetch("/api/borrowers");
    setBorrowers(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this borrower and all related data?")) return;
    await fetch(`/api/borrowers/${id}`, { method: "DELETE" });
    fetchBorrowers();
  };

  if (loading) return <p className="text-slate-500">Loading borrowers...</p>;

  if (borrowers.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500">
        No borrowers yet. Add your first borrower.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Occupation</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Aadhaar</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Loans</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {borrowers.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{b.name}</td>
                <td className="px-4 py-3 text-slate-600">{b.phone}</td>
                <td className="px-4 py-3 text-slate-600">{b.occupation}</td>
                <td className="px-4 py-3 text-slate-600">{b.aadhaar}</td>
                <td className="px-4 py-3">
                  <Badge status="ACTIVE" />
                  <span className="ml-1 text-slate-600">{b._count?.loans ?? 0}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/borrowers/${b.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/borrowers/${b.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
