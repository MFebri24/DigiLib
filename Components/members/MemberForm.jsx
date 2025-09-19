import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

const memberTypes = ["regular", "student", "premium"];
const statuses = ["active", "suspended", "expired"];

export default function MemberForm({ member, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    member_type: 'regular',
    status: 'active',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        full_name: member.full_name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        birth_date: member.birth_date ? member.birth_date.split('T')[0] : '',
        member_type: member.member_type || 'regular',
        status: member.status || 'active',
      });
    } else {
      setFormData({
        full_name: '', email: '', phone: '', address: '', birth_date: '',
        member_type: 'regular', status: 'active',
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div>
          <Label htmlFor="full_name">Nama Lengkap</Label>
          <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="birth_date">Tanggal Lahir</Label>
          <Input id="birth_date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="member_type">Tipe Anggota</Label>
              <Select name="member_type" value={formData.member_type} onValueChange={(v) => handleSelectChange('member_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {memberTypes.map(type => <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {member && (
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
        </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan Anggota'}
        </Button>
      </DialogFooter>
    </form>
  );
}