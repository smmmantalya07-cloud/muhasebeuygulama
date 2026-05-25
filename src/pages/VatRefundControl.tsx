import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  History, CheckCircle2, AlertTriangle, 
  Search, Filter, Plus, FileText, 
  Scale, ShieldCheck, ArrowRight,
  ClipboardCheck, Eye, Download, Info,
  ExternalLink, ShieldAlert, Workflow,
  FileSearch, UserCheck, Timer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RefundCase {
  id: string;
  period: string;
  amount: number;
  type: 'İhracat' | 'Tevkifat' | 'İndirimli Oran';
  status: 'Hazırlık' | 'YMM Onayı' | 'Vergi Dairesi' | 'İade Tamamlandı';
  progress: number;
  missingInvoices: number;
}

const SAMPLE_DATA: RefundCase[] = [
  { id: '1', period: '2026/01', amount: 845000.00, type: 'İhracat', status: 'Vergi Dairesi', progress: 85, missingInvoices: 0 },
  { id: '2', period: '2026/02', amount: 1250000.00, type: 'İhracat', status: 'YMM Onayı', progress: 45, missingInvoices: 12 },
  { id: '3', period: '2026/03', amount: 420000.00, type: 'İndirimli Oran', status: 'Hazırlık', progress: 15, missingInvoices: 45 },
];

export function VatRefundControlPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-600">
             <Workflow className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">KDV İadesi Kontrol Merkezi</h2>
             <p className="text-[13px] text-slate-500 font-medium tracking-tight">İndirilecek KDV listeleri, yüklenilen KDV ve karşıt inceleme otomasyonu</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2 uppercase tracking-widest text-[10px]">
             KOS / GİB SORGULA
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            <Plus className="w-4 h-4" /> YENİ İADE DOSYASI
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-800">Aktif İade Dosyaları</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                     {SAMPLE_DATA.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-slate-50 transition-all group">
                           <div className="flex items-start justify-between mb-4">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[9px] font-black border-indigo-100 text-indigo-600 uppercase">{item.type}</Badge>
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.period} Dönemi</span>
                                 </div>
                                 <h3 className="text-[16px] font-black text-slate-900 mt-1">{item.amount.toLocaleString('tr-TR')} ₺ İade Talebi</h3>
                              </div>
                              <StatusBadge status={item.status} />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase">Dosya Tamamlanma</span>
                                    <span className="text-indigo-600">%{item.progress}</span>
                                 </div>
                                 <Progress value={item.progress} className="h-1.5 bg-slate-100" />
                                 <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 gap-1.5"><Eye className="w-3.5 h-3.5" /> DOSYA DETAYI</Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 hover:bg-blue-50 gap-1.5"><FileSearch className="w-3.5 h-3.5" /> LİSTELERİ KONTROL ET</Button>
                                 </div>
                              </div>
                              <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                                 <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Kontrol Kriterleri</span>
                                    {item.missingInvoices > 0 ? (
                                       <Badge className="bg-rose-100 text-rose-700 text-[9px] font-black">{item.missingInvoices} HATA</Badge>
                                    ) : (
                                       <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">TAM</Badge>
                                    )}
                                 </div>
                                 <div className="space-y-1.5">
                                    <CheckItem label="İndirilecek KDV Listesi" checked={item.progress > 40} />
                                    <CheckItem label="Yüklenilen KDV Listesi" checked={item.progress > 70} />
                                    <CheckItem label="Gümrük Beyanname Teyidi" checked={item.type === 'İhracat'} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 bg-white p-5 text-left">
               <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-indigo-500" /> V.D. Eksiklik Yazıları
               </h4>
               <div className="space-y-3">
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-black text-rose-800 uppercase tracking-tight">Eksiklik Yazısı (No: 45)</span>
                        <span className="text-[9px] font-bold text-rose-400 italic">2 GÜN KALDI</span>
                     </div>
                     <p className="text-[10px] text-rose-700 font-bold leading-relaxed mb-2">Alt mükellef (KOD-4) matrah arttırımı sorgusu talep ediliyor.</p>
                     <Button variant="link" className="p-0 h-auto text-[10px] font-black text-rose-900 uppercase">CEVAPLA &gt;</Button>
                  </div>
               </div>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white p-6 text-left">
               <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-amber-500">I-GEP / Risk Analizi</h4>
               </div>
               <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">
                  "İade taleplerinde GİB Risk Analiz Merkezi tarafından üretilen segmentasyon raporları (GEKSİS/İGEP) otomatik taranarak mükellefe ön uyarı verilir."
               </p>
               <Button variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-white font-bold text-[10px] uppercase">GİB ANALİZİ YAP</Button>
            </Card>
         </div>
      </div>

       {/* Final Control Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6 text-left">
          <div className="flex items-start gap-4">
             <div className="shrink-0 mt-1">
                <Info className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   KDV İadesi Kontrol Merkezi; ihracat, indirimli oran ve tevkifatlı işlemlerden doğan iade taleplerini 3065 Sayılı KDV Kanunu ve Genel Uygulama Tebliğleri çerçevesinde takip eder. Sistem, indirilecek ve yüklenilen KDV listelerini UBL-TR formatında analiz ederek mükerrer kayıt, KOD listesi uyarıları ve binek araç kısıtlamaları yönünden çapraz sorgu yapar. İade dosyasının vergi dairesine teslimi öncesi üretilen "GEKSİS Ön Kontrol" raporu, iade sürecini hızlandırmak amacıyla tasarlanmıştır. Nihai hak ediş tutarı YMM tasdik raporu veya vergi dairesi raporu ile kesinleşir.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RefundCase['status'] }) {
   const colors = {
      'Hazırlık': 'bg-slate-100 text-slate-600',
      'YMM Onayı': 'bg-blue-100 text-blue-700',
      'Vergi Dairesi': 'bg-amber-100 text-amber-700',
      'İade Tamamlandı': 'bg-emerald-100 text-emerald-700'
   };
   return (
      <Badge className={`${colors[status]} border-none font-black text-[10px] uppercase tracking-wider px-2.5 py-1`}>{status}</Badge>
   );
}

function CheckItem({ label, checked }: { label: string, checked: boolean }) {
   return (
      <div className="flex items-center gap-2">
         {checked ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <div className="w-3 h-3 rounded-full border border-slate-200"></div>}
         <span className={`text-[10px] font-bold ${checked ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
      </div>
   );
}
