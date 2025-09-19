import React, { useState, useEffect } from "react";
import { Book, Member, Loan, Notification } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    BookOpen, 
    Users, 
    RefreshCw, 
    TrendingUp,
    Calendar,
    AlertTriangle,
    Award,
    Eye
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import PopularBooks from "../components/dashboard/PopularBooks";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalMembers: 0,
        activeLoans: 0,
        overdueLoans: 0
    });
    const [chartData, setChartData] = useState([]);
    const [popularBooks, setPopularBooks] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [books, members, loans] = await Promise.all([
                Book.list(),
                Member.list(), 
                Loan.list()
            ]);

            // Hitung statistik
            const activeLoans = loans.filter(loan => loan.status === 'borrowed').length;
            const overdueLoans = loans.filter(loan => loan.status === 'overdue').length;

            setStats({
                totalBooks: books.length,
                totalMembers: members.length,
                activeLoans,
                overdueLoans
            });

            // Data untuk chart (simulasi data bulanan)
            const monthlyData = [
                { month: 'Jan', peminjaman: 65 },
                { month: 'Feb', peminjaman: 59 },
                { month: 'Mar', peminjaman: 80 },
                { month: 'Apr', peminjaman: 81 },
                { month: 'Mei', peminjaman: 56 },
                { month: 'Jun', peminjaman: 95 }
            ];
            setChartData(monthlyData);

            // Buku populer (berdasarkan total_borrowed)
            const popularBooksData = books
                .sort((a, b) => (b.total_borrowed || 0) - (a.total_borrowed || 0))
                .slice(0, 5);
            setPopularBooks(popularBooksData);

            // Recent activity (simulasi)
            const recentActivities = [
                { type: 'loan', message: 'Buku "The Great Gatsby" dipinjam oleh John Doe', time: '2 jam lalu' },
                { type: 'return', message: 'Buku "To Kill a Mockingbird" dikembalikan', time: '4 jam lalu' },
                { type: 'member', message: 'Anggota baru: Jane Smith bergabung', time: '1 hari lalu' },
                { type: 'book', message: 'Buku baru ditambahkan: "1984"', time: '2 hari lalu' }
            ];
            setRecentActivity(recentActivities);

        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }
        setIsLoading(false);
    };

    const statCards = [
        {
            title: "Total Buku",
            value: stats.totalBooks,
            icon: BookOpen,
            gradient: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            title: "Total Anggota", 
            value: stats.totalMembers,
            icon: Users,
            gradient: "from-green-500 to-emerald-600",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
        },
        {
            title: "Peminjaman Aktif",
            value: stats.activeLoans,
            icon: RefreshCw,
            gradient: "from-purple-500 to-violet-600", 
            bgColor: "bg-purple-50",
            textColor: "text-purple-700"
        },
        {
            title: "Terlambat",
            value: stats.overdueLoans,
            icon: AlertTriangle,
            gradient: "from-red-500 to-rose-600",
            bgColor: "bg-red-50", 
            textColor: "text-red-700"
        }
    ];

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50/50 to-transparent min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Dashboard Perpustakaan
                    </h1>
                    <p className="text-slate-600 text-lg">Selamat datang di sistem manajemen perpustakaan digital</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {statCards.map((stat, index) => (
                        <StatsCard 
                            key={stat.title}
                            {...stat}
                            isLoading={isLoading}
                            delay={index * 0.1}
                        />
                    ))}
                </motion.div>

                {/* Charts & Activity */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Chart Peminjaman */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="glass-effect shadow-xl border-0">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    Tren Peminjaman Bulanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis 
                                                dataKey="month" 
                                                stroke="#64748b"
                                                fontSize={12}
                                            />
                                            <YAxis stroke="#64748b" fontSize={12} />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                                }}
                                            />
                                            <Bar 
                                                dataKey="peminjaman" 
                                                fill="url(#gradient)" 
                                                radius={[8, 8, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#667eea" />
                                                    <stop offset="100%" stopColor="#764ba2" />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <RecentActivity activities={recentActivity} isLoading={isLoading} />
                    </motion.div>
                </div>

                {/* Popular Books */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <PopularBooks books={popularBooks} isLoading={isLoading} />
                </motion.div>
            </div>
        </div>
    );
}