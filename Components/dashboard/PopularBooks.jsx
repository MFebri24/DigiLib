import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Eye, TrendingUp, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function PopularBooks({ books, isLoading }) {
    return (
        <Card className="glass-effect shadow-xl border-0">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Award className="w-5 h-5 text-indigo-600" />
                    Buku Populer
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {books.map((book, index) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl overflow-hidden mb-3 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                                    {book.cover_url ? (
                                        <img
                                            src={book.cover_url}
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center text-slate-500">
                                                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-xs">No Cover</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                                            <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                                                <TrendingUp className="w-3 h-3" />
                                                {book.total_borrowed || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 line-clamp-1">
                                        {book.author}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Eye className="w-3 h-3" />
                                        <span>{book.total_borrowed || 0} peminjaman</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Belum ada buku populer</p>
                        <p className="text-sm">Mulai tambahkan buku untuk melihat statistik</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}