import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User as UserIcon, Shield, Bell } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';

import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                // Handle not logged in user if needed
            }
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50/50 to-transparent min-h-full">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
                        Pengaturan Akun
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Kelola profil, keamanan, dan preferensi notifikasi Anda.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 glass-effect p-2 h-auto">
                            <TabsTrigger value="profile"><UserIcon className="w-4 h-4 mr-2" /> Profil</TabsTrigger>
                            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" /> Keamanan</TabsTrigger>
                            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> Notifikasi</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="profile" className="mt-6">
                            {isLoading ? <Skeleton className="w-full h-96 rounded-2xl" /> : <ProfileSettings user={user} onUpdate={handleUserUpdate} />}
                        </TabsContent>
                        <TabsContent value="security" className="mt-6">
                             {isLoading ? <Skeleton className="w-full h-64 rounded-2xl" /> : <SecuritySettings />}
                        </TabsContent>
                        <TabsContent value="notifications" className="mt-6">
                             {isLoading ? <Skeleton className="w-full h-80 rounded-2xl" /> : <NotificationSettings user={user} onUpdate={handleUserUpdate} />}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}