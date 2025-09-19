import React, { useState, useEffect, useCallback } from "react";
import { Member } from "@/entities/Member";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import { motion } from "framer-motion";

import MemberTable from "../components/members/MemberTable";
import MemberForm from "../components/members/MemberForm";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const membersData = await Member.list("-created_date");
      setMembers(membersData);
    } catch (error) {
      console.error("Gagal memuat anggota:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleAddNew = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      try {
        await Member.delete(memberId);
        loadMembers();
      } catch (error) {
        console.error("Gagal menghapus anggota:", error);
      }
    }
  };

  const handleSubmit = async (memberData) => {
    setIsSubmitting(true);
    try {
      if (editingMember) {
        await Member.update(editingMember.id, memberData);
      } else {
        const lastMember = members.length > 0 ? members.reduce((a, b) => parseInt(a.member_number.replace('MB','')) > parseInt(b.member_number.replace('MB','')) ? a : b) : {member_number: 'MB000'};
        const lastNumber = parseInt(lastMember.member_number.replace('MB', ''));
        const newMemberNumber = `MB${(lastNumber + 1).toString().padStart(3, '0')}`;
        await Member.create({ ...memberData, member_number: newMemberNumber, join_date: new Date().toISOString().split('T')[0] });
      }
      loadMembers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan anggota:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50/50 to-transparent min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Manajemen Anggota
            </h1>
            <p className="text-slate-600 text-lg">
              Kelola data anggota perpustakaan
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddNew}
                className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg glass-effect">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    {editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}
                </DialogTitle>
              </DialogHeader>
              <MemberForm
                member={editingMember}
                onSubmit={handleSubmit}
                onCancel={() => setDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Member Table */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <MemberTable
                members={members}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </motion.div>
      </div>
    </div>
  );
}