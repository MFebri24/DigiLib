import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const statusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
};

export default function MemberTable({ members, isLoading, onEdit, onDelete }) {
  return (
    <Card className="glass-effect shadow-xl border-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/50 border-b-0">
              <TableHead>No. Anggota</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tgl Bergabung</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-b-white/20">
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : members.map((member) => (
              <TableRow key={member.id} className="hover:bg-white/30 transition-colors border-b-white/20">
                <TableCell className="font-mono text-slate-600">{member.member_number}</TableCell>
                <TableCell className="font-medium text-slate-800">{member.full_name}</TableCell>
                <TableCell className="text-slate-600">{member.email}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[member.status]}`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">
                  {member.join_date ? format(new Date(member.join_date), 'dd MMM yyyy', { locale: id }) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="icon" onClick={() => onEdit(member)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(member.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && members.length === 0 && (
            <div className="text-center py-16 text-slate-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Belum ada anggota. Silakan tambahkan anggota baru.</p>
            </div>
        )}
      </div>
    </Card>
  );
}