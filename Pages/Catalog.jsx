import React, { useState, useEffect } from "react";
import { Book } from "@/entities/Book";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
    Search, 
    Filter, 
    BookOpen, 
    User, 
    Calendar,
    Star,
    Eye,
    Grid3X3,
    List,
    SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import BookCard from "../components/catalog/BookCard";
import BookFilters from "../components/catalog/BookFilters";

export default function Catalog() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [viewMode, setViewMode] = useState("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        availability: "all",
        rating: "all",
        year: "all"
    });

    useEffect(() => {
        loadBooks();
    }, []);

    useEffect(() => {
        filterAndSortBooks();
    }, [books, searchTerm, selectedCategory, sortBy, filters]);

    const loadBooks = async () => {
        setIsLoading(true);
        try {
            const booksData = await Book.list();
            setBooks(booksData);
        } catch (error) {
            console.error("Error loading books:", error);
        }
        setIsLoading(false);
    };

    const filterAndSortBooks = () => {
        let filtered = [...books];

        // Filter berdasarkan pencarian
        if (searchTerm) {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter berdasarkan kategori
        if (selectedCategory !== "all") {
            filtered = filtered.filter(book => book.category === selectedCategory);
        }

        // Filter berdasarkan ketersediaan
        if (filters.availability === "available") {
            filtered = filtered.filter(book => book.available_stock > 0);
        } else if (filters.availability === "unavailable") {
            filtered = filtered.filter(book => book.available_stock === 0);
        }

        // Filter berdasarkan rating
        if (filters.rating !== "all") {
            const minRating = parseInt(filters.rating);
            filtered = filtered.filter(book => book.rating >= minRating);
        }

        // Filter berdasarkan tahun
        if (filters.year !== "all") {
            const currentYear = new Date().getFullYear();
            if (filters.year === "new") {
                filtered = filtered.filter(book => book.publication_year >= currentYear - 5);
            } else if (filters.year === "classic") {
                filtered = filtered.filter(book => book.publication_year < currentYear - 20);
            }
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "title":
                    return a.title.localeCompare(b.title);
                case "author":
                    return a.author.localeCompare(b.author);
                case "year":
                    return (b.publication_year || 0) - (a.publication_year || 0);
                case "popularity":
                    return (b.total_borrowed || 0) - (a.total_borrowed || 0);
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });

        setFilteredBooks(filtered);
    };

    const categories = [
        { value: "all", label: "Semua Kategori" },
        { value: "fiksi", label: "Fiksi" },
        { value: "nonfiksi", label: "Non-Fiksi" },
        { value: "sains", label: "Sains" },
        { value: "teknologi", label: "Teknologi" },
        { value: "sejarah", label: "Sejarah" },
        { value: "biografi", label: "Biografi" },
        { value: "anak", label: "Anak-Anak" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-transparent">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Katalog Buku Digital
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Jelajahi koleksi buku digital terlengkap
                    </p>
                </motion.div>

                {/* Search & Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-effect rounded-2xl p-6 mb-8 shadow-xl"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Cari berdasarkan judul, penulis, atau ISBN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 border-0 bg-white/60 shadow-inner text-base"
                            />
                        </div>

                        {/* Category Select */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="lg:w-48 h-12 border-0 bg-white/60 shadow-inner">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort Select */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="lg:w-40 h-12 border-0 bg-white/60 shadow-inner">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="title">Judul</SelectItem>
                                <SelectItem value="author">Penulis</SelectItem>
                                <SelectItem value="year">Tahun</SelectItem>
                                <SelectItem value="popularity">Populer</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Toggle & Filters */}
                        <div className="flex gap-2">
                            <Button
                                variant={showFilters ? "default" : "outline"}
                                onClick={() => setShowFilters(!showFilters)}
                                className="h-12 px-4"
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                            
                            <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    onClick={() => setViewMode("grid")}
                                    size="sm"
                                    className="rounded-none h-12 px-4"
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    onClick={() => setViewMode("list")}
                                    size="sm"
                                    className="rounded-none h-12 px-4"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 pt-6 border-t border-slate-200"
                            >
                                <BookFilters filters={filters} setFilters={setFilters} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Results Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-slate-600">
                            Menampilkan {filteredBooks.length} dari {books.length} buku
                        </span>
                        {searchTerm && (
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                                "{searchTerm}"
                            </Badge>
                        )}
                        {selectedCategory !== "all" && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                {categories.find(c => c.value === selectedCategory)?.label}
                            </Badge>
                        )}
                    </div>
                </motion.div>

                {/* Books Grid/List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="glass-effect rounded-2xl p-4 animate-pulse">
                                    <div className="aspect-[3/4] bg-slate-200 rounded-xl mb-4" />
                                    <div className="h-4 bg-slate-200 rounded mb-2" />
                                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : filteredBooks.length > 0 ? (
                        <div className={
                            viewMode === "grid" 
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                        }>
                            <AnimatePresence mode="wait">
                                {filteredBooks.map((book, index) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        viewMode={viewMode}
                                        delay={index * 0.05}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <BookOpen className="w-24 h-24 mx-auto mb-6 text-slate-300" />
                            <h3 className="text-2xl font-semibold text-slate-600 mb-2">
                                Tidak ada buku ditemukan
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Coba ubah kata kunci pencarian atau filter untuk menemukan buku yang Anda cari.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}