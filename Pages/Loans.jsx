import React, { useState, useEffect, useMemo } from "react";
import { Loan, Book, Member } from "@/entities/all";
import { motion } from "framer-motion";
import { RefreshCw, Plus, Minus } from "lucide-react";

import LoanTable from "../components/loans/LoanTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoanForm from "../components/loans/LoanForm";
import ReturnForm from "../components/loans/ReturnForm";

export default function LoansPage() {
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loanDialogOpen, setLoanDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [loansData, booksData, membersData] = await Promise.all([
                Loan.list("-loan_date"),
                Book.list(),
                Member.list()
            ]);
            setLoans(loansData);
            setBooks(booksData);
            setMembers(membersData);
        } catch (error) {
            console.error("Gagal memuat data peminjaman:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const enrichedLoans = useMemo(() => {
        return loans.map(loan => {
            const book = books.find(b => b.id === loan.book_id);
            const member = members.find(m => m.id === loan.member_id);
            return {
                ...loan,
                book_title: book?.title || "Buku tidak ditemukan",
                member_name: member?.full_name || "Anggota tidak ditemukan"
            };
        });
    }, [loans, books, members]);

    const handleLoanSubmit = async ({ book_id, member_id, due_date }) => {
        setIsSubmitting(true);
        try {
            const book = books.find(b => b.id === book_id);
            if (!book || book.available_stock <= 0) {
                alert("Buku tidak tersedia untuk dipinjam.");
                setIsSubmitting(false);
                return;
            }

            await Loan.create({
                book_id,
                member_id,
                loan_date: new Date().toISOString().split('T')[0],
                due_date,
                status: 'borrowed'
            });

            await Book.update(book_id, { available_stock: book.available_stock - 1 });
            
            await loadData();
            setLoanDialogOpen(false);
        } catch (error) {
            console.error("Gagal membuat peminjaman:", error);
        }
        setIsSubmitting(false);
    };

    const handleReturnSubmit = async ({ loan_id }) => {
        setIsSubmitting(true);
        try {
            const loan = loans.find(l => l.id === loan_id);
            if (!loan) {
                alert("Data peminjaman tidak ditemukan.");
                setIsSubmitting(false);
                return;
            }

            const book = books.find(b => b.id === loan.book_id);
            
            await Loan.update(loan.id, {
                status: 'returned',
                return_date: new Date().toISOString().split('T')[0]
            });

            if(book) {
                await Book.update(book.id, { available_stock: (book.available_stock || 0) + 1 });
            }

            await loadData();
            setReturnDialogOpen(false);
        } catch(error) {
            console.error("Gagal melakukan pengembalian:", error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50/50 to-transparent min-h-full">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                            Peminjaman & Pengembalian
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Catat sirkulasi buku perpustakaan
                        </p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg"><Plus className="w-4 h-4 mr-2" /> Peminjaman Baru</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md glass-effect">
                                <DialogHeader>
                                    <DialogTitle>Form Peminjaman Baru</DialogTitle>
                                </DialogHeader>
                                <LoanForm
                                    books={books.filter(b => b.available_stock > 0)}
                                    members={members}
                                    onSubmit={handleLoanSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            </DialogContent>
                        </Dialog>
                        <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline"><Minus className="w-4 h-4 mr-2" /> Pengembalian Buku</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md glass-effect">
                                <DialogHeader>
                                    <DialogTitle>Form Pengembalian Buku</DialogTitle>
                                </DialogHeader>
                                <ReturnForm 
                                    activeLoans={enrichedLoans.filter(l => l.status === 'borrowed' || l.status === 'overdue')}
                                    onSubmit={handleReturnSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <LoanTable loans={enrichedLoans} isLoading={isLoading} />
                </motion.div>
            </div>
        </div>
    );
}