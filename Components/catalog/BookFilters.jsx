import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function BookFilters({ filters, setFilters }) {
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            availability: "all",
            rating: "all", 
            year: "all"
        });
    };

    const activeFiltersCount = Object.values(filters).filter(value => value !== "all").length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Filter Lanjutan</h3>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Hapus Filter ({activeFiltersCount})
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Availability Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Ketersediaan</label>
                    <Select 
                        value={filters.availability} 
                        onValueChange={(value) => handleFilterChange("availability", value)}
                    >
                        <SelectTrigger className="h-10 bg-white/60">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="available">Tersedia</SelectItem>
                            <SelectItem value="unavailable">Tidak Tersedia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Rating Minimum</label>
                    <Select 
                        value={filters.rating} 
                        onValueChange={(value) => handleFilterChange("rating", value)}
                    >
                        <SelectTrigger className="h-10 bg-white/60">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Rating</SelectItem>
                            <SelectItem value="4">4+ Bintang</SelectItem>
                            <SelectItem value="3">3+ Bintang</SelectItem>
                            <SelectItem value="2">2+ Bintang</SelectItem>
                            <SelectItem value="1">1+ Bintang</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">Tahun Terbit</label>
                    <Select 
                        value={filters.year} 
                        onValueChange={(value) => handleFilterChange("year", value)}
                    >
                        <SelectTrigger className="h-10 bg-white/60">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tahun</SelectItem>
                            <SelectItem value="new">Terbaru (5 tahun terakhir)</SelectItem>
                            <SelectItem value="classic">Klasik ({">"}20 tahun)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.availability !== "all" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {filters.availability === "available" ? "Tersedia" : "Tidak Tersedia"}
                        </Badge>
                    )}
                    {filters.rating !== "all" && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            Rating {filters.rating}+ Bintang
                        </Badge>
                    )}
                    {filters.year !== "all" && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {filters.year === "new" ? "Terbaru" : "Klasik"}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}