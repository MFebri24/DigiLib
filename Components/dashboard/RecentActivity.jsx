import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Users, RotateCcw, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const activityIcons = {
    loan: BookOpen,
    return: RotateCcw,
    member: Users,
    book: Plus
};

const activityColors = {
    loan: "text-blue-600 bg-blue-100",
    return: "text-green-600 bg-green-100", 
    member: "text-purple-600 bg-purple-100",
    book: "text-orange-600 bg-orange-100"
};

export default function RecentActivity({ activities, isLoading }) {
    return (
        <Card className="glass-effect shadow-xl border-0 h-full">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Aktivitas Terbaru
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))
                ) : (
                    activities.map((activity, index) => {
                        const Icon = activityIcons[activity.type];
                        const colorClass = activityColors[activity.type];
                        
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/60 transition-colors duration-200 group"
                            >
                                <div className={`p-2 rounded-full ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {activity.time}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })
                )}
                
                {!isLoading && activities.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Belum ada aktivitas terbaru</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}