import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, TrendingUp, AlertTriangle, 
  History, Calendar, ShieldAlert, Scale,
  Calculator, FileText, Download, Landmark,
  BarChart3, PieChart, Info, CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CashStat {
  id: string;
  firmName: string;
  cashBalance: number;
  averageBalance: number;
  riskScore: number;
  adatRisk: boolean;
  lastUpdate: string;
}

const SAMPLE_DATA: CashStat[] = [
  {
    id: '1',
    firmName: 'ABC İnşaat Ltd. Şti.',
    cashBalance: 845000.00,
    averageBalance: 250000.00,
    riskScore: 85,
    adatRisk: true,
    lastUpdate: '23.05.2026'
  }
];

export function KasaRiskAnalysisPage() {
  const [data] = useState<CashStat>(SAMPLE_DATA[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm text-emerald-600">
             <DollarSign className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Kasa Risk Analizi</h2>
             <p className="text-[13px] text-slate-500 font-medium">Kasa fazlası, adat faizi ve VUK 353 özel usulsüzlük kontrolleri</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <Calculator className="w-4 h-4" /> ADAT HESAPLA
          </Button>
          <Button className="bg-slate-900 hover:bg-black text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            GÜNCEL DURUMU ANALİZ ET
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Main Stats */}
         <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Card className="shadow-sm border-slate-200 bg-white">
                  <CardContent className="p-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Güncel Kasa Bakiyesi</p>
                     <h3 className="text-3xl font-black text-slate-900">{data.cashBalance.toLocaleString('tr-TR')} ₺</h3>
                     <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                        <TrendingUp className="w-4 h-4 text-rose-500" />
                        <span className="text-[11px] font-bold text-rose-600 uppercase">Ortalamanın %238 Üzerinde</span>
                     </div>
                  </CardContent>
               </Card>
               <Card className="shadow-sm border-slate-200 bg-white">
                  <CardContent className="p-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Potansiyel Adat Matrahı</p>
                     <h3 className="text-3xl font-black text-orange-600">595.000 ₺</h3>
                     <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-[11px] font-bold text-orange-600 uppercase">Adat Faizi Uygulanmalı</span>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
               <CardHeader className="py-4 border-b border-slate-50">
                  <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800">Kasa Hareket Analizi (Son 6 Ay)</CardTitle>
               </CardHeader>
               <CardContent className="p-6 text-center h-[300px] flex items-center justify-center text-slate-300">
                  <div className="space-y-2">
                     <BarChart3 className="w-12 h-12 mx-auto opacity-20" />
                     <p className="text-xs font-bold uppercase tracking-wider">Grafik Modülü Yükleniyor...</p>
                  </div>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="border-slate-200 shadow-sm bg-white p-5 text-left">
                  <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Öneri: Kasa Fazlası Eritme
                  </h4>
                  <ul className="space-y-3">
                     {[
                        'Ortaklar cari hesabına adat faizi işletilmesi',
                        'Kar dağıtımı yapılarak kasanın realize edilmesi',
                        'Giderlerin nakit ödeme limitlerine (7.000 TL) uyumu',
                        'Banka ödeme talimatlarının düzenlenmesi'
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-slate-600 leading-snug">
                           <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" /> {item}
                        </li>
                     ))}
                  </ul>
               </Card>
               <Card className="border-slate-200 shadow-sm bg-rose-50 p-5 text-left">
                  <div className="flex items-center gap-2 mb-3">
                     <ShieldAlert className="w-5 h-5 text-rose-600" />
                     <h4 className="text-[13px] font-black text-rose-800 uppercase tracking-widest">Kırmızı Bayrak</h4>
                  </div>
                  <p className="text-[12px] text-rose-900 font-bold leading-relaxed mb-4">
                     "Yüksek kasa bakiyesi, vergi incelemelerinde 'Belgesiz Satış' karinesi olarak kabul edilir. İzah edilemeyen bakiye için vergi ziyaı cezası riski mevcuttur."
                  </p>
                  <Button variant="outline" className="w-full bg-white border-rose-200 text-rose-600 h-9 font-black text-[10px] uppercase">RİSK ANALİZİ İNDİR</Button>
               </Card>
            </div>
         </div>

         {/* Sidebar Analysis */}
         <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 bg-white">
               <CardHeader className="py-4 border-b border-slate-50">
                  <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-800">Üçlü Denetim Görüşü</CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-6">
                  <div className="space-y-2">
                     <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 underline decoration-rose-200 underline-offset-4"><AlertCircle className="w-3 h-3" /> Vergi Müfettişi</span>
                     <p className="text-[11px] font-medium text-slate-600 italic leading-relaxed">"Kasa mevcudu işletme hacmine oranla aşırıdır. Ortaklara kullandırılan fonlar için adat faizi hesaplanmaması örtülü kazanç dağıtımıdır."</p>
                  </div>
                  <div className="space-y-2 border-t border-slate-50 pt-4">
                     <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 underline decoration-blue-200 underline-offset-4"><Info className="w-3 h-3" /> YMM Görüşü</span>
                     <p className="text-[11px] font-medium text-slate-600 italic leading-relaxed">"Yıl sonu tasdik raporunda kasa noksanlığı/fazlalığı için makul bir açıklama yapılamazsa 'Olumlu' görüş verilmesi zordur."</p>
                  </div>
                  <div className="space-y-2 border-t border-slate-50 pt-4">
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 underline decoration-emerald-200 underline-offset-4"><CheckCircle2 className="w-3 h-3" /> Bağımsız Denetçi</span>
                     <p className="text-[11px] font-medium text-slate-600 italic leading-relaxed">"Nakit ve nakit benzerleri kaleminde 'Geri alınamaz alacak' riski vardır. Karşılık ayrılması finansal tablolar için gereklidir."</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-slate-50 p-6 flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mb-4">
                  <PieChart className="w-8 h-8 text-slate-400" />
               </div>
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2">Kasa/Banka Dengesi</h4>
               <div className="w-full space-y-3 text-left">
                  <div className="space-y-1">
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>Nakit (Kasa)</span><span>%74</span></div>
                     <Progress value={74} className="h-1.5 bg-slate-200" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase"><span>Banka Mevcudu</span><span>%26</span></div>
                     <Progress value={26} className="h-1.5 bg-slate-200 text-blue-500" />
                  </div>
               </div>
               <p className="text-[10px] text-slate-400 font-bold mt-4 leading-relaxed">Nakit oranı sanayi ortalamasına göre %50 daha yüksektir.</p>
            </Card>
         </div>
      </div>

       {/* Final Control Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4 text-left">
             <div className="shrink-0 mt-1">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Kasa risk analizi; büyük tutarlı nakit hareketleri (VUK 7.000 TL sınırı) ve işletme hacmine oranla kasa mevcudu üzerinden gerçekleştirilmiştir. Ortaklar cari hesabı ile kasa bakiyeleri arasındaki geçişler "Örtülü Kazanç Dağıtımı" yönünden risk teşkil eder. Bu analiz teknik bir hesaplama olup, adat faizi oranlarının güncel MB faizlerine göre YMM tarafından onaylanması şarttır. Adat faizi faturası kesilmeden yapılan düzeltmeler beyanname uyumsuzluğu doğurabilir.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
