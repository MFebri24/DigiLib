import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const statusColors = {
  borrowed: "bg-blue-100 text-blue-800",
  returned: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  lost: "bg-gray-100 text-gray-800",
};

export default function LoanTable({ loans, isLoading }) {
  return (
    <Card className="glass-effect shadow-xl border-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/50 border-b-0">
              <TableHead>Judul Buku</TableHead>
              <TableHead>Peminjam</TableHead>
              <TableHead>Tgl Pinjam</TableHead>
              <TableHead>Jatuh Tempo</TableHead>
              <TableHead>Tgl Kembali</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-b-white/20">
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : loans.map((loan) => (
              <TableRow key={loan.id} className="hover:bg-white/30 transition-colors border-b-white/20">
                <TableCell className="font-medium text-slate-800">{loan.book_title}</TableCell>
                <TableCell className="text-slate-600">{loan.member_name}</TableCell>
                <TableCell className="text-slate-600">
                  {loan.loan_date ? format(new Date(loan.loan_date), 'dd MMM yyyy', { locale: id }) : '-'}
                </TableCell>
                <TableCell className="text-slate-600">
                  {loan.due_date ? format(new Date(loan.due_date), 'dd MMM yyyy', { locale: id }) : '-'}
                </TableCell>
                <TableCell className="text-slate-600">
                  {loan.return_date ? format(new Date(loan.return_date), 'dd MMM yyyy', { locale: id }) : '-'}
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[loan.status]}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && loans.length === 0 && (
            <div className="text-center py-16 text-slate-500">
                <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Belum ada data peminjaman.</p>
            </div>
        )}
      </div>
    </Card>
  );
}