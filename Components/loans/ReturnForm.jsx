import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

export default function ReturnForm({ activeLoans, onSubmit, isSubmitting }) {
    const [loanId, setLoanId] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!loanId) {
            alert("Harap pilih peminjaman yang akan dikembalikan.");
            return;
        }
        onSubmit({ loan_id: loanId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
                <Label htmlFor="loan">Peminjaman Aktif</Label>
                <Select value={loanId} onValueChange={setLoanId}>
                    <SelectTrigger><SelectValue placeholder="Pilih buku yang dikembalikan..." /></SelectTrigger>
                    <SelectContent>
                        {activeLoans.map(loan => (
                            <SelectItem key={loan.id} value={loan.id}>
                                {loan.book_title} - {loan.member_name} (Jatuh tempo: {format(new Date(loan.due_date), 'dd MMM yyyy')})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isSubmitting || !loanId} className="w-full">
                {isSubmitting ? 'Memproses...' : 'Proses Pengembalian'}
            </Button>
        </form>
    );
}