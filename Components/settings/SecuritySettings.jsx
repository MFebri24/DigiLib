import React from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function SecuritySettings() {
    const handleLogout = async () => {
        try {
            await User.logout();
            window.location.reload(); // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Card className="glass-effect shadow-xl border-0">
            <CardHeader>
                <CardTitle>Keamanan & Sesi</CardTitle>
                <CardDescription>
                    Pengaturan yang berkaitan dengan keamanan akun Anda.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                    <div>
                        <h4 className="font-semibold">Sesi Aktif</h4>
                        <p className="text-sm text-slate-600">Keluar dari akun Anda di perangkat ini.</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Keluar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}