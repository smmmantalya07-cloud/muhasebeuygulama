import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CashRiskAnalysisPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Wallet className="w-6 h-6 text-blue-600" />
          Kasa & Ortaklar Cari Risk Analizi
        </h1>
        <p className="text-slate-500 text-sm">100 (Kasa), 131 ve 331 (Ortaklardan Alacaklar/Borçlar) hesaplarının Adat faizi ve kurumlar vergisi riskleri.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Adat Hesaplama ve Risk Özeti</CardTitle>
            <CardDescription>Sisteme yüklenen son mizan verilerine göre otomatik tespitler</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                   <div>
                     <p className="text-sm font-medium text-slate-500 mb-1">İncelenen Firma</p>
                     <p className="font-bold text-slate-900">ABC İnşaat Ltd. Şti.</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-medium text-slate-500 mb-1">Dönem</p>
                     <p className="font-bold text-slate-900">2026/03 Mizanı</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <h4 className="font-bold text-red-900 text-sm">100 Kasa Hesabı Şişkinliği</h4>
                      </div>
                      <p className="text-2xl font-bold text-red-700">450.000 ₺</p>
                      <p className="text-xs text-red-600 mt-2">Günlük işlem hacmine göre olağanın yaklaşık 5 katı kasa bakiyesi mevcut.</p>
                   </div>

                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                        <h4 className="font-bold text-amber-900 text-sm">131 Ortaklar Cari Bakiyesi</h4>
                      </div>
                      <p className="text-2xl font-bold text-amber-700">2.500.000 ₺</p>
                      <p className="text-xs text-amber-600 mt-2">Örtülü kazanç dağıtımı riski. Adat faizi hesaplanması ve fatura kesilmesi gerekiyor.</p>
                   </div>
                </div>

                <div className="pt-2">
                   <Button className="w-full bg-slate-900 text-white">Otomatik Adat Hesaplama Tablosu Oluştur (Excel)</Button>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-slate-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Yapılması Gerekenler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <ul className="text-sm space-y-3 text-slate-700">
               <li className="flex gap-2"><span className="text-red-500">•</span> Adat faizi hesaplanmalı (Mevcut faiz oranı: %50 üzerinden).</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> Hesaplanan faize %20 KDV dahil edilerek firmaya fatura kesilmeli.</li>
               <li className="flex gap-2"><span className="text-red-500">•</span> Geçici vergi dönemlerinde bu hesaplamalar kurum kazancına eklenmeli.</li>
             </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
