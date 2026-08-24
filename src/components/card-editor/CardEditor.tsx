'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card as CardUI, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CardEditorProps {
  initialData?: Card;
}

export function CardEditor({ initialData }: CardEditorProps) {
  const [formData, setFormData] = useState<Partial<Card>>(
    initialData || {
      name: '',
      title: '',
      company: '',
      phone: '',
      email: '',
      website: '',
    }
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement Supabase update logic here
    setTimeout(() => {
      setIsSaving(false);
      alert('Tarjeta guardada exitosamente (Mock)');
    }, 1000);
  };

  return (
    <CardUI className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Tarjeta Digital</CardTitle>
        <CardDescription>Actualiza tu información de contacto y enlaces.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Cargo / Profesión</Label>
              <Input id="title" name="title" value={formData.title || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" name="company" value={formData.company || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input id="website" name="website" type="url" value={formData.website || ''} onChange={handleChange} />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Tarjeta'}
          </Button>
        </form>
      </CardContent>
    </CardUI>
  );
}
