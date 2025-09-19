import React, { useState, useEffect, useCallback } from "react";
import { Book } from "@/entities/Book";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, BookMarked } from "lucide-react";
import { motion } from "framer-motion";

import BookTable from "../components/books/BookTable";
import BookForm from "../components/books/BookForm";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const booksData = await Book.list("-created_date");
      setBooks(booksData);
    } catch (error) {
      console.error("Gagal memuat buku:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const handleAddNew = () => {
    setEditingBook(null);
    setDialogOpen(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setDialogOpen(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await Book.delete(bookId);
        loadBooks();
      } catch (error) {
        console.error("Gagal menghapus buku:", error);
      }
    }
  };

  const handleSubmit = async (bookData, coverFile) => {
    setIsSubmitting(true);
    try {
      let cover_url = bookData.cover_url || "";
      if (coverFile) {
        const result = await UploadFile({ file: coverFile });
        cover_url = result.file_url;
      }
      
      const finalBookData = { ...bookData, cover_url };

      if (editingBook) {
        await Book.update(editingBook.id, finalBookData);
      } else {
        await Book.create(finalBookData);
      }

      loadBooks();
      setDialogOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan buku:", error);
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Manajemen Buku
            </h1>
            <p className="text-slate-600 text-lg">
              Kelola koleksi buku perpustakaan Anda
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleAddNew}
                className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Buku Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl glass-effect">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <BookMarked className="w-5 h-5 text-indigo-600" />
                    {editingBook ? "Edit Buku" : "Tambah Buku Baru"}
                </DialogTitle>
              </DialogHeader>
              <BookForm
                book={editingBook}
                onSubmit={handleSubmit}
                onCancel={() => setDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Book Table */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <BookTable
                books={books}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </motion.div>
      </div>
    </div>
  );
}