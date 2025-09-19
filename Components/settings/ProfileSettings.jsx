import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save } from 'lucide-react';

export default function ProfileSettings({ user, onUpdate }) {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        photo_url: ''
    });
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                photo_url: user.photo_url || ''
            });
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, photo_url: previewUrl }));
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let dataToUpdate = { ...formData };
            delete dataToUpdate.email; // Email cannot be changed

            if (profilePicFile) {
                const { file_url } = await UploadFile({ file: profilePicFile });
                dataToUpdate.photo_url = file_url;
            }

            const updatedUser = await User.updateMyUserData(dataToUpdate);
            onUpdate(updatedUser);
            alert("Profil berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal memperbarui profil:", error);
            alert("Terjadi kesalahan. Gagal memperbarui profil.");
        }
        setIsSubmitting(false);
    };

    return (
        <Card className="glass-effect shadow-xl border-0">
            <CardHeader>
                <CardTitle>Pengaturan Profil</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                            <AvatarImage src={formData.photo_url} alt={formData.full_name} />
                            <AvatarFallback className="text-3xl bg-slate-200">{formData.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Input id="photo-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload').click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Ubah Foto
                            </Button>
                            <p className="text-xs text-slate-500 mt-2">JPG, GIF, atau PNG. Ukuran maks 5MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="full_name">Nama Lengkap</Label>
                            <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="email">Alamat Email</Label>
                            <Input id="email" name="email" value={formData.email} disabled />
                        </div>
                        <div>
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="address">Alamat</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-white/30 p-4 rounded-b-2xl">
                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}