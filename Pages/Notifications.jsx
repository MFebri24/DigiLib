import React, { useState, useEffect } from 'react';
import { Notification } from '@/entities/Notification';
import { motion } from 'framer-motion';
import { Bell, Clock, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const notifMeta = {
    due_reminder: { icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    overdue: { icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
    new_book: { icon: Info, color: 'text-blue-600 bg-blue-100' },
    return_confirmation: { icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
    fine_notice: { icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNotifications = async () => {
            setIsLoading(true);
            try {
                const data = await Notification.list('-created_date');
                setNotifications(data);
            } catch (error) {
                console.error("Gagal memuat notifikasi:", error);
            }
            setIsLoading(false);
        };
        loadNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await Notification.update(id, { is_read: true });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Gagal update notifikasi:", error);
        }
    };

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50/50 to-transparent min-h-full">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Pusat Notifikasi
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Semua pemberitahuan penting untuk Anda
                    </p>
                </motion.div>

                <Card className="glass-effect shadow-xl border-0">
                    <CardContent className="p-0">
                        <div className="space-y-2">
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="flex gap-4 p-6 border-b border-white/20">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            ))
                        ) : notifications.length > 0 ? (
                            notifications.map((notif, index) => {
                                const meta = notifMeta[notif.type] || { icon: Bell, color: 'text-gray-600 bg-gray-100' };
                                const Icon = meta.icon;
                                return (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex items-start gap-4 p-6 border-b border-white/20 hover:bg-white/30 transition-colors cursor-pointer ${!notif.is_read ? 'bg-indigo-50/50' : ''}`}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        <div className={`flex-shrink-0 p-3 rounded-full ${meta.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-semibold text-slate-800 ${!notif.is_read ? 'font-bold' : ''}`}>{notif.title}</p>
                                            <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {format(new Date(notif.created_date), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                            </p>
                                        </div>
                                        {!notif.is_read && (
                                            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full self-center" title="Belum dibaca"></div>
                                        )}
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-24 text-slate-500">
                                <Bell className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Tidak ada notifikasi</p>
                                <p>Semua pemberitahuan akan muncul di sini.</p>
                            </div>
                        )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}