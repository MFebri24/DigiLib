import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Upload } from 'lucide-react';

const categories = ["fiksi", "nonfiksi", "sains", "teknologi", "sejarah", "biografi", "anak", "agama", "ekonomi", "kesehatan", "politik", "pendidikan", "seni", "olahraga", "lainnya"];

export default function BookForm({ book, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publication_year: '',
    isbn: '',
    category: '',
    description: '',
    cover_url: '',
    total_stock: 1,
    available_stock: 1,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year || '',
        isbn: book.isbn || '',
        category: book.category || '',
        description: book.description || '',
        cover_url: book.cover_url || '',
        total_stock: book.total_stock || 1,
        available_stock: book.available_stock || 1,
      });
      setPreviewUrl(book.cover_url || '');
    } else {
      setFormData({
        title: '', author: '', publisher: '', publication_year: '', isbn: '',
        category: '', description: '', cover_url: '', total_stock: 1, available_stock: 1,
      });
      setPreviewUrl('');
    }
    setCoverFile(null);
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (['publication_year', 'total_stock', 'available_stock'].includes(name)) {
        finalValue = value ? parseInt(value, 10) : '';
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        publication_year: formData.publication_year ? Number(formData.publication_year) : null,
        total_stock: Number(formData.total_stock),
        available_stock: Number(formData.available_stock),
    };
    onSubmit(finalData, coverFile);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
      {/* Kolom Cover */}
      <div className="md:col-span-1 space-y-4">
        <Label>Cover Buku</Label>
        <div className="aspect-[3/4] w-full rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 text-sm">Pratinjau Cover</span>
          )}
        </div>
        <Input id="cover-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('cover-upload').click()}>
            <Upload className="w-4 h-4 mr-2" />
            Unggah Cover
        </Button>
      </div>

      {/* Kolom Detail Buku */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Judul Buku</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="author">Penulis</Label>
          <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="publisher">Penerbit</Label>
          <Input id="publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="publication_year">Tahun Terbit</Label>
          <Input id="publication_year" name="publication_year" type="number" value={formData.publication_year} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select name="category" value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
            <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="total_stock">Total Stok</Label>
          <Input id="total_stock" name="total_stock" type="number" value={formData.total_stock} onChange={handleChange} min="1" />
        </div>
        <div>
          <Label htmlFor="available_stock">Stok Tersedia</Label>
          <Input id="available_stock" name="available_stock" type="number" value={formData.available_stock} onChange={handleChange} min="0" max={formData.total_stock} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        </div>
      </div>
      
      <div className="md:col-span-3">
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan Buku'}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}