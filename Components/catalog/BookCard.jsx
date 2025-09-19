import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    BookOpen, 
    User, 
    Calendar, 
    Star, 
    Eye,
    CheckCircle2,
    XCircle,
    Bookmark
} from "lucide-react";
import { motion } from "framer-motion";

const categoryColors = {
    fiksi: "bg-blue-100 text-blue-800 border-blue-200",
    nonfiksi: "bg-green-100 text-green-800 border-green-200",
    sains: "bg-purple-100 text-purple-800 border-purple-200",
    teknologi: "bg-orange-100 text-orange-800 border-orange-200",
    sejarah: "bg-red-100 text-red-800 border-red-200",
    biografi: "bg-indigo-100 text-indigo-800 border-indigo-200",
    anak: "bg-pink-100 text-pink-800 border-pink-200",
    agama: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ekonomi: "bg-yellow-100 text-yellow-800 border-yellow-200",
    kesehatan: "bg-cyan-100 text-cyan-800 border-cyan-200",
    default: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function BookCard({ book, viewMode, delay = 0 }) {
    const categoryColor = categoryColors[book.category] || categoryColors.default;
    const isAvailable = book.available_stock > 0;

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay, duration: 0.3 }}
                className="glass-effect rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <div className="flex gap-6">
                    <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                        {book.cover_url ? (
                            <img
                                src={book.cover_url}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-slate-400" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-2">
                                {book.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{book.author}</span>
                                </div>
                                {book.publication_year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{book.publication_year}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${categoryColor} border font-medium`}>
                                {book.category}
                            </Badge>
                            {book.rating > 0 && (
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{book.rating.toFixed(1)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Eye className="w-3 h-3" />
                                <span>{book.total_borrowed || 0} peminjaman</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isAvailable ? (
                                    <div className="flex items-center gap-1 text-green-600 text-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Tersedia ({book.available_stock})</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <XCircle className="w-4 h-4" />
                                        <span>Tidak tersedia</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8">
                                    <Bookmark className="w-4 h-4 mr-1" />
                                    Simpan
                                </Button>
                                <Button 
                                    size="sm" 
                                    disabled={!isAvailable}
                                    className="h-8 bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Pinjam
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.3, type: "spring" }}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Card className="glass-effect border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden">
                    {book.cover_url ? (
                        <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-slate-400" />
                        </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Availability indicator */}
                    <div className="absolute top-3 right-3">
                        <div className={`p-2 rounded-full shadow-lg ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isAvailable ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                            )}
                        </div>
                    </div>

                    {/* Rating badge */}
                    {book.rating > 0 && (
                        <div className="absolute top-3 left-3">
                            <div className="bg-yellow-100/90 backdrop-blur-sm text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{book.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                className="flex-1 bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm"
                            >
                                <Bookmark className="w-4 h-4 mr-1" />
                                Simpan
                            </Button>
                            <Button 
                                size="sm" 
                                disabled={!isAvailable}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            >
                                Pinjam
                            </Button>
                        </div>
                    </div>
                </div>
                
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-bold text-slate-800 line-clamp-2 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                                {book.author}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <Badge className={`${categoryColor} border text-xs`}>
                                {book.category}
                            </Badge>
                            
                            {book.publication_year && (
                                <span className="text-xs text-slate-500">
                                    {book.publication_year}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{book.total_borrowed || 0}</span>
                            </div>
                            
                            <span className={isAvailable ? "text-green-600" : "text-red-500"}>
                                {isAvailable ? `${book.available_stock} tersedia` : "Habis"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}