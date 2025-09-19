import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

export default function NotificationSettings({ user, onUpdate }) {
    const [prefs, setPrefs] = useState({
        due_reminders: true,
        new_book_alerts: true,
        return_confirmations: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && user.notification_prefs) {
            setPrefs(user.notification_prefs);
        }
    }, [user]);

    const handlePrefChange = (key, value) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updatedUser = await User.updateMyUserData({ notification_prefs: prefs });
            onUpdate(updatedUser);
            alert("Preferensi notifikasi berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal memperbarui preferensi:", error);
            alert("Terjadi kesalahan. Gagal memperbarui preferensi.");
        }
        setIsSubmitting(false);
    };

    const notificationItems = [
        { key: 'due_reminders', label: 'Pengingat Jatuh Tempo', description: 'Kirim notifikasi saat mendekati tanggal jatuh tempo.' },
        { key: 'new_book_alerts', label: 'Info Buku Baru', description: 'Beritahu saya jika ada buku baru yang menarik.' },
        { key: 'return_confirmations', label: 'Konfirmasi Pengembalian', description: 'Kirim konfirmasi saat buku telah berhasil dikembalikan.' },
    ];

    return (
        <Card className="glass-effect shadow-xl border-0">
            <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
                <CardDescription>Pilih notifikasi yang ingin Anda terima.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {notificationItems.map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                            <div>
                                <Label htmlFor={item.key} className="font-semibold">{item.label}</Label>
                                <p className="text-sm text-slate-600">{item.description}</p>
                            </div>
                            <Switch
                                id={item.key}
                                checked={prefs[item.key]}
                                onCheckedChange={(value) => handlePrefChange(item.key, value)}
                            />
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="bg-white/30 p-4 rounded-b-2xl">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Preferensi'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}