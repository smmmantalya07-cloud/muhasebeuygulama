import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, TrendingUp, TrendingDown, 
  ArrowUpRight, ArrowDownRight, Search, 
  Filter, Download, PieChart, Info,
  Activity, Scale, ShieldAlert, CheckCircle2,
  Table, FileSearch, LineChart as LineChartIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function FinancialAnalysisPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm text-blue-600">
             <BarChart3 className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Finansal Tablo Analizi</h2>
             <p className="text-[13px] text-slate-500 font-medium tracking-tight">Dikey, yatay ve oran analizi ile önemli yanlışlık riski tespiti</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2 uppercase tracking-widest text-[10px]">
            <Table className="w-4 h-4" /> TABLOLARI KARŞILAŞTIR
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            <Download className="w-4 h-4" /> ANALİZ RAPORU ÜRET
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <MetricBox label="Cari Oran" value="1.85" status="İdeal" color="emerald" />
         <MetricBox label="Asit-Test Oranı" value="0.94" status="Makul" color="amber" />
         <MetricBox label="Borçlanma Oranı" value="0.52" status="Güvenli" color="emerald" />
         <MetricBox label="Öz Sermaye Karlılığı" value="%24" status="Yüksek" color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-200 bg-white">
               <CardHeader className="py-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-800">Gelir Tablosu Trend Analizi</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-bold">2024 - 2025 KARŞILAŞTIRMA</Badge>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                             <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hesap Kalemi</th>
                             <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Önceki Dönem</th>
                             <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Cari Dönem</th>
                             <th className="px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Değişim %</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          <DataRow label="Brüt Satışlar" prev="8.450.000" current="12.120.000" change={43} />
                          <DataRow label="Satışların Maliyeti" prev="5.120.000" current="6.850.000" change={33} />
                          <DataRow label="Faaliyet Giderleri" prev="1.240.000" current="2.140.000" change={72} isAlert />
                          <DataRow label="Finansman Giderleri" prev="450.000" current="1.120.000" change={148} isAlert />
                          <DataRow label="Dönem Net Karı" prev="1.100.000" current="1.840.000" change={67} />
                       </tbody>
                    </table>
                  </div>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="border-slate-200 shadow-sm bg-white p-5 text-left">
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Activity className="w-4 h-4 text-emerald-500" /> Bilanço Analiz Notları
                  </h4>
                  <ul className="space-y-3">
                     <li className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-relaxed">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> Stok devir hızı sektör ortalamasına göre %15 daha yüksektir.
                     </li>
                     <li className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-relaxed">
                        <TrendingDown className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /> Kısa vadeli borçların oranı %10 artış göstermiştir.
                     </li>
                     <li className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-relaxed">
                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" /> Öz sermaye yapısı karlılıkla desteklenmektedir.
                     </li>
                  </ul>
               </Card>
               <Card className="border-slate-200 shadow-sm bg-rose-50/50 p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                     <ShieldAlert className="w-5 h-5 text-rose-600" />
                     <h4 className="text-[12px] font-black text-rose-800 uppercase tracking-widest">Olağan Dışı Artışlar</h4>
                  </div>
                  <p className="text-[11px] text-rose-900 font-bold leading-relaxed mb-4">
                     Pazarlama ve Finansman giderlerindeki sırasıyla %72 ve %148'lik artışlar, işletme hacmindeki %43'lük artışla uyumsuz görülmektedir. Bu kalemler "Önemli Yanlışlık Riski" (ÖYR) olarak işaretlenmelidir.
                  </p>
                  <Button variant="outline" className="w-full bg-white border-rose-200 text-rose-600 h-9 font-black text-[10px] uppercase">DENETİM ÖRNEKLEMİ OLUŞTUR</Button>
               </Card>
            </div>
         </div>

         {/* Sidebar Charts/Info */}
         <div className="space-y-6 text-left">
            <Card className="shadow-sm border-slate-200 bg-white">
               <CardHeader className="py-4 border-b border-slate-50">
                  <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-800">Varlık Dağılımı</CardTitle>
               </CardHeader>
               <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full border-[12px] border-emerald-500 border-t-amber-400 border-r-blue-400 flex items-center justify-center">
                     <div className="text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block leading-none">Toplam</span>
                        <span className="text-sm font-black text-slate-900">18.4M</span>
                     </div>
                  </div>
                  <div className="mt-6 space-y-2">
                     <LegendItem color="bg-emerald-500" label="Dönen Varlıklar" percent={65} />
                     <LegendItem color="bg-blue-400" label="Duran Varlıklar" percent={25} />
                     <LegendItem color="bg-amber-400" label="Diğer" percent={10} />
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white p-6">
               <h4 className="text-[12px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Analitik İnceleme
               </h4>
               <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-4">
                  "BDS 520 uyarınca denetçi, finansal tablolar arasındaki tutarlılığı ölçmek için analitik prosedürler uygulamalıdır. Beklenmeyen sapmalar doğrudan denetim kanıtı gerektirir."
               </p>
               <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Badge variant="outline" className="text-[9px] border-blue-900 text-blue-400">BDS 520</Badge>
                  <Button variant="link" className="p-0 h-auto text-[10px] text-slate-500 font-black uppercase">STANDART GÖR</Button>
               </div>
            </Card>
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
                   Finansal Tablo Analizi modülü; mizan verilerini TMS (Türkiye Muhasebe Standartları) ve BDS (Bağımsız Denetim Standartları) çerçevesinde otomatik işleyerek oransal sapmaları tespit eder. Yatay ve dikey analiz sonuçları, firmanın faaliyet hacmi (Gross Sales) ile gider kalemleri arasındaki korelasyonu (Regression Analysis simülasyonu) ölçerek potansiyel riskli alanları raporlar. Bu analiz bir denetim planı değil, denetim planına baz teşkil eden bir "Risk Haritası"dır. Sonuçlar mali müşavir veya denetçi tarafından fiili belgelerle doğrulanmalıdır.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function DataRow({ label, prev, current, change, isAlert = false }: { label: string, prev: string, current: string, change: number, isAlert?: boolean }) {
   return (
      <tr className="hover:bg-slate-50 transition-colors">
         <td className="px-6 py-4 text-[12px] font-bold text-slate-800">{label}</td>
         <td className="px-6 py-4 text-right text-[11px] font-medium text-slate-500">{prev} ₺</td>
         <td className="px-6 py-4 text-right text-[11px] font-bold text-slate-900">{current} ₺</td>
         <td className="px-6 py-4 text-right">
            <Badge variant="outline" className={`text-[10px] font-black ${isAlert ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
               {change > 0 ? '+' : ''}{change}% {change > 50 ? (change > 100 ? '⚠️' : '🔥') : ''}
            </Badge>
         </td>
      </tr>
   );
}

function MetricBox({ label, value, status, color }: { label: string, value: string, status: string, color: 'emerald' | 'amber' }) {
   const colorClass = color === 'emerald' ? 'text-emerald-600' : 'text-amber-500';
   return (
      <Card className="shadow-sm border-slate-200 bg-white p-4">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <div className="flex items-end justify-between">
            <h4 className="text-xl font-black text-slate-900">{value}</h4>
            <span className={`text-[10px] font-black uppercase ${colorClass}`}>{status}</span>
         </div>
      </Card>
   );
}

function LegendItem({ color, label, percent }: { color: string, label: string, percent: number }) {
   return (
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <span className="text-[11px] font-bold text-slate-600">{label}</span>
         </div>
         <span className="text-[11px] font-black text-slate-900">%{percent}</span>
      </div>
   );
}
