import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PlaceholderPage({ title, description, icon: Icon }: { title: string, description: string, icon: any }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Icon className="w-6 h-6 text-blue-600" />
          {title}
        </h1>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Modül Hazırlanıyor</CardTitle>
          <CardDescription>Bu alan henüz yapım aşamasındadır veya şu an entegre edilmektedir.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
            <Icon className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Çok Yakında</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {title} modülü vergi asistanınızın yeni yetenekleriyle birlikte çok yakında kullanımınıza sunulacaktır.
            </p>
            <Button onClick={() => toast.success(`Talep: ${title} için öncelik kaydedildi.`)}>
              Beni Haberdar Et
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
