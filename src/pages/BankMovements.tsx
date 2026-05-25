import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function BankMovementsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Banka Hareketleri</h1>
          <p className="text-slate-500 text-sm">Banka ekstre hareketlerinin detaylı listesi ve analizi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"> <Download className="w-4 h-4 mr-2" /> Excel İndir </Button>
          <Button size="sm"> <Search className="w-4 h-4 mr-2" /> Hareketleri Tara </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200">
           <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOPLAM İŞLEM</CardTitle>
           </CardHeader>
           <CardContent>
              <p className="text-2xl font-black text-slate-900">1.240</p>
           </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
           <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOPLAM GİRİŞ</CardTitle>
           </CardHeader>
           <CardContent>
              <p className="text-2xl font-black text-emerald-600">4.250.000 TL</p>
           </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
           <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOPLAM ÇIKIŞ</CardTitle>
           </CardHeader>
           <CardContent>
              <p className="text-2xl font-black text-rose-600">3.840.500 TL</p>
           </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
           <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">MUHASEBELEŞMEYEN</CardTitle>
           </CardHeader>
           <CardContent>
              <p className="text-2xl font-black text-amber-500">12</p>
           </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
           <div>
              <CardTitle className="text-base font-semibold">Son Banka Hareketleri</CardTitle>
              <CardDescription className="text-xs">Tüm banka hesaplarından gelen canlı veri akışı.</CardDescription>
           </div>
           <div className="flex gap-2">
              <Input placeholder="Açıklama veya tutar ara..." className="w-64 h-9 text-xs" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Tarih</th>
                    <th className="px-6 py-3">Banka / Şube</th>
                    <th className="px-6 py-3">Açıklama</th>
                    <th className="px-6 py-3">Tutar</th>
                    <th className="px-6 py-3">Muhasebe Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {[
                    { date: '05.05.2026', bank: 'Ziraat Bankası', desc: 'EFT: DENİZ LOJİSTİK ÖDEME', amount: '124.500 TL', type: 'out', status: 'Muhasebeleşti' },
                    { date: '05.05.2026', bank: 'Garanti BBVA', desc: 'GELEN HAVALE: ABC İNŞAAT HAKEDİŞ', amount: '450.000 TL', type: 'in', status: 'Bekliyor' },
                    { date: '04.05.2026', bank: 'İş Bankası', desc: 'SİGORTA POLİÇE TAHSİLAT', amount: '12.000 TL', type: 'out', status: 'Muhasebeleşti' },
                    { date: '04.05.2026', bank: 'Akbank', desc: 'KREDİ KARTI TAKSİT TAHSİLAT', amount: '45.000 TL', type: 'in', status: 'Manuel Kontrol' },
                    { date: '03.05.2026', bank: 'Ziraat Bankası', desc: 'KAMU ÖDEMESİ: KDV TAHAKKUK', amount: '85.200 TL', type: 'out', status: 'Muhasebeleşti' },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.date}</td>
                      <td className="px-6 py-4">{item.bank}</td>
                      <td className="px-6 py-4 text-xs italic">{item.desc}</td>
                      <td className={`px-6 py-4 font-bold ${item.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                         {item.type === 'in' ? '+' : '-'}{item.amount}
                      </td>
                      <td className="px-6 py-4">
                         <Badge variant={item.status === 'Muhasebeleşti' ? 'success' : (item.status === 'Bekliyor' ? 'warning' : 'outline')} className="text-[10px]">
                            {item.status}
                         </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
