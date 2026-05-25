import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, BarChart3, AlertTriangle, 
  ShieldCheck, ArrowRight, Info, Scale, 
  Target, FilePieChart, TrendingUp, 
  Search, ShieldAlert, CheckCircle2,
  ListChecks, Briefcase, FileSearch
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function AuditPreControlPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm text-emerald-600">
             <ClipboardCheck className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Bağımsız Denetim Ön Kontrol</h2>
             <p className="text-[13px] text-slate-500 font-medium tracking-tight">BDS/TMS uyumlu önemlilik düzeyi ve risk değerlendirme asistanı</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2 uppercase tracking-widest text-[10px]">
            <Target className="w-4 h-4" /> ÖNEMLİLİK HESAPLA
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            <ListChecks className="w-4 h-4" /> DENETİM PLANI ÜRET
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Materiality Dashboard */}
         <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Card className="shadow-sm border-slate-200 bg-white">
                  <CardHeader className="py-4 border-b border-slate-50">
                     <CardTitle className="text-[11px] font-black uppercase text-slate-400">Genel Önemlilik (Overall Materiality)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                     <h3 className="text-3xl font-black text-slate-900">450.000 ₺</h3>
                     <p className="text-[11px] font-medium text-slate-500 mt-2">Brüt Satışlar üzerinden %1.5 baz alınarak hesaplanmıştır.</p>
                     <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">BDS 320 Uyumlu</span>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold text-[9px]">GÜNCEL</Badge>
                     </div>
                  </CardContent>
               </Card>
               <Card className="shadow-sm border-slate-200 bg-white">
                  <CardHeader className="py-4 border-b border-slate-50">
                     <CardTitle className="text-[11px] font-black uppercase text-slate-400">Performans Önemliliği (PM)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                     <h3 className="text-3xl font-black text-indigo-600">337.500 ₺</h3>
                     <p className="text-[11px] font-medium text-slate-500 mt-2">Genel önemliliğin %75'i seviyesinde muhafazakar sınır.</p>
                     <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">Hata Tolerans Sınırı</span>
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none font-bold text-[9px]">KORUMACI</Badge>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-800">Önemli Yanlışlık Riski (ÖYR) Analizi</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                     <RiskRow title="Stoklar" risk="Yüksek" detail="Enflasyon düzeltmesi kayıtları ve stok sayım farkları riski." score={85} />
                     <RiskRow title="Ticari Alacaklar" risk="Orta" detail="Şüpheli alacak karşılıkları ve dönem sonu mutabakat eksikleri." score={45} />
                     <RiskRow title=" Maddi Duran Varlıklar" risk="Düşük" detail="Yeni alımlar ve amortisman hesaplamaları uyumu." score={20} />
                     <RiskRow title="Satış Gelirleri" risk="Yüksek" detail="Dönem kayması (cut-off) ve iade karşılıkları riskleri." score={92} />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Insights */}
         <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white overflow-hidden">
               <CardHeader className="py-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                     <ShieldAlert className="w-4 h-4 text-amber-500" />
                     <CardTitle className="text-[11px] font-black uppercase tracking-widest text-amber-500">Kritik Denetim Alanı</CardTitle>
                  </div>
               </CardHeader>
               <CardContent className="p-5">
                  <h4 className="text-[13px] font-black uppercase mb-2">Hile Riski Değerlendirmesi</h4>
                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic mb-4">
                     "Yönetimin kontrolleri geçersiz kılma riski (management override) gözlemlenmiştir. Manuel yevmiye kayıtları %40 artmıştır."
                  </p>
                  <Button variant="outline" className="w-full h-10 border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold text-[10px] uppercase">ANALİZ RAPORU ÜRET</Button>
               </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-white p-5">
               <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-4">Denetim Çalışma Dosyaları</h4>
               <div className="space-y-3">
                  <FileLink label="Genel Denetim Planı (BDS 300)" status="Tamamlandı" />
                  <FileLink label="Risk Değerlendirme Formu" status="Taslak" />
                  <FileLink label="Önemlilik Hesaplama Tablosu" status="Tamamlandı" />
                  <FileLink label="İç Kontrol Testleri" status="Bekleyen" />
               </div>
            </Card>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 shadow-sm">
               <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                     <h4 className="text-[12px] font-black text-emerald-800 uppercase mb-1">Hazırlık Skoru</h4>
                     <p className="text-[11px] text-emerald-700 font-medium mb-3">İlgili dönem denetim çalışma dosyaları %65 hazır.</p>
                     <Progress value={65} className="h-1.5 bg-emerald-200" />
                  </div>
               </div>
            </div>
         </div>
      </div>

       {/* Final Control Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4">
             <div className="shrink-0 mt-1">
                <Scale className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Bağımsız Denetim Ön Kontrol modülü, KGK (Kamu Gözetimi Kurumu) standartları ve Bağımsız Denetim Standartları (BDS) simülasyonu üzerinden veri üretmektedir. Hesaplanan önemlilik düzeyleri ve risk skorları, mizan verilerinin BDS 320 ve BDS 315 uyarınca matematiksel modellemesidir. Sistemin hile riski uyarısı, olağan dışı yevmiye kayıt yoğunluğu ve mizan anomalileri üzerinden verilmektedir. Denetçi, bu verileri kullanarak kendi mesleki muhakemesini (professional judgment) oluşturmalı ve denetim programını bizzat finalize etmelidir.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function RiskRow({ title, risk, detail, score }: { title: string, risk: 'Yüksek' | 'Orta' | 'Düşük', detail: string, score: number }) {
   const riskColor = risk === 'Yüksek' ? 'text-rose-600' : risk === 'Orta' ? 'text-amber-500' : 'text-emerald-500';
   return (
      <div className="p-4 hover:bg-slate-50 transition-colors">
         <div className="flex items-start justify-between mb-2">
            <div>
               <h5 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{title}</h5>
               <p className="text-[11px] text-slate-500 font-medium mt-1">{detail}</p>
            </div>
            <div className="text-right">
               <Badge variant="outline" className={`${riskColor} border-none font-black text-[9px] uppercase`}>{risk} RİSK</Badge>
               <span className="block text-[14px] font-black text-slate-900 mt-1">%{score}</span>
            </div>
         </div>
         <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${score > 70 ? 'bg-rose-500' : score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${score}%` }}></div>
         </div>
      </div>
   );
}

function FileLink({ label, status }: { label: string, status: string }) {
   const statusColor = status === 'Tamamlandı' ? 'text-emerald-600' : status === 'Taslak' ? 'text-blue-500' : 'text-slate-400';
   return (
      <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-50 bg-slate-50/20 group hover:border-slate-200 transition-colors cursor-pointer">
         <span className="text-[11px] font-bold text-slate-600 truncate mr-2">{label}</span>
         <Badge variant="outline" className={`text-[9px] font-black uppercase ${statusColor}`}>{status}</Badge>
      </div>
   );
}
