import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, format } from 'date-fns';

export default function LoanForm({ books, members, onSubmit, isSubmitting }) {
    const [bookId, setBookId] = useState('');
    const [memberId, setMemberId] = useState('');
    const loanDuration = 14; // default 14 days
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!bookId || !memberId) {
            alert("Harap pilih buku dan anggota.");
            return;
        }
        const dueDate = format(addDays(new Date(), loanDuration), 'yyyy-MM-dd');
        onSubmit({ book_id: bookId, member_id: memberId, due_date: dueDate });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
                <Label htmlFor="book">Buku</Label>
                <Select value={bookId} onValueChange={setBookId}>
                    <SelectTrigger><SelectValue placeholder="Pilih buku..." /></SelectTrigger>
                    <SelectContent>
                        {books.map(book => (
                            <SelectItem key={book.id} value={book.id}>
                                {book.title} ({book.available_stock} tersedia)
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="member">Anggota</Label>
                <Select value={memberId} onValueChange={setMemberId}>
                    <SelectTrigger><SelectValue placeholder="Pilih anggota..." /></SelectTrigger>
                    <SelectContent>
                        {members.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                                {member.full_name} ({member.member_number})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="text-sm text-slate-500">
                <p>Tanggal Pinjam: {format(new Date(), 'dd MMMM yyyy')}</p>
                <p>Jatuh Tempo: {format(addDays(new Date(), loanDuration), 'dd MMMM yyyy')} ({loanDuration} hari)</p>
            </div>
            <Button type="submit" disabled={isSubmitting || !bookId || !memberId} className="w-full">
                {isSubmitting ? 'Memproses...' : 'Simpan Peminjaman'}
            </Button>
        </form>
    );
}