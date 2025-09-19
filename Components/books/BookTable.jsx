import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors = {
    fiksi: "bg-blue-100 text-blue-800 border-blue-200",
    nonfiksi: "bg-green-100 text-green-800 border-green-200",
    sains: "bg-purple-100 text-purple-800 border-purple-200",
    teknologi: "bg-orange-100 text-orange-800 border-orange-200",
    sejarah: "bg-red-100 text-red-800 border-red-200",
    biografi: "bg-indigo-100 text-indigo-800 border-indigo-200",
    anak: "bg-pink-100 text-pink-800 border-pink-200",
    default: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function BookTable({ books, isLoading, onEdit, onDelete }) {
  return (
    <Card className="glass-effect shadow-xl border-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white/50 border-b-0">
              <TableHead className="w-20">Cover</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-b-white/20">
                  <TableCell><Skeleton className="w-12 h-16 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : books.map((book) => (
              <TableRow key={book.id} className="hover:bg-white/30 transition-colors border-b-white/20">
                <TableCell>
                  <div className="w-12 h-16 rounded-md overflow-hidden bg-slate-200">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-800">{book.title}</TableCell>
                <TableCell className="text-slate-600">{book.author}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${categoryColors[book.category] || categoryColors.default} border font-medium`}>
                    {book.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">
                  {book.available_stock} / {book.total_stock}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="icon" onClick={() => onEdit(book)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(book.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && books.length === 0 && (
            <div className="text-center py-16 text-slate-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Belum ada buku. Silakan tambahkan buku baru.</p>
            </div>
        )}
      </div>
    </Card>
  );
}