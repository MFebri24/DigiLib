import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCard({ 
    title, 
    value, 
    icon: Icon, 
    gradient, 
    bgColor, 
    textColor, 
    isLoading,
    delay = 0 
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, type: "spring" }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
                
                <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-600 tracking-wide">
                                {title}
                            </p>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <motion.p 
                                    className="text-3xl font-bold text-slate-800"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: delay + 0.3, type: "spring" }}
                                >
                                    {value.toLocaleString()}
                                </motion.p>
                            )}
                        </div>
                        
                        <motion.div 
                            className={`p-4 rounded-2xl ${bgColor} group-hover:scale-110 transition-transform duration-300`}
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ delay: delay + 0.2 }}
                        >
                            <Icon className={`w-6 h-6 ${textColor}`} />
                        </motion.div>
                    </div>

                    <motion.div 
                        className="mt-4 flex items-center text-xs text-slate-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + 0.5 }}
                    >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient} mr-2`} />
                        Update terakhir: hari ini
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}