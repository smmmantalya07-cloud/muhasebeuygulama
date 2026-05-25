import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, PieChart, TrendingDown, TrendingUp, 
  Download, Send, Share2, Calendar, 
  AlertTriangle, CheckCircle2, DollarSign,
  Briefcase, ShieldCheck, Mail, Printer, FileText, Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ClientReport {
  month: string;
  year: string;
  firmName: string;
  totalTax: number;
  taxBreakdown: { name: string, amount: number }[];
  riskSummary: { title: string, level: 'Düşük' | 'Orta' | 'Yüksek' }[];
  opportunities: string[];
}

const SAMPLE_REPORT: ClientReport = {
  month: 'Nisan',
  year: '2026',
  firmName: 'ABC İnşaat Ltd. Şti.',
  totalTax: 342500.00,
  taxBreakdown: [
    { name: 'KDV 1 (İnceleme Öncesi)', amount: 142500.00 },
    { name: 'Muhtasar (MUHSGK)', amount: 48000.00 },
    { name: 'Geçici Vergi (Puanlama)', amount: 152000.00 }
  ],
  riskSummary: [
    { title: 'Kasa Fazlası Riski', level: 'Yüksek' },
    { title: 'Tevkifat Uygulama Hatası', level: 'Orta' },
    { title: 'Gider Belgesi Eksikliği', level: 'Düşük' }
  ],
  opportunities: [
    { text: 'Yatırım teşvik revizesi ile %10 ek indirim.', icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { text: 'Genç girişimci istisnası kapsamı kontrolü.', icon: <TrendingDown className="w-3.5 h-3.5" /> },
    { text: 'Sene sonu amortisman hızlandırma planı.', icon: <TrendingDown className="w-3.5 h-3.5" /> }
  ] as any
};

export function MonthlyClientReportPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    toast.info('PDF raporu hazırlanıyor...');
    setTimeout(() => {
      setIsExporting(false);
      toast.success('Rapor başarıyla indirildi.');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-100 shadow-sm text-teal-600">
             <BarChart3 className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Aylık Mükellef Bilgilendirme Raporu</h2>
             <p className="text-[13px] text-slate-500 font-medium">Finansal durum, vergi yükü ve risklerin yönetici özeti</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2" onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4" /> PDF İNDİR
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-10 shadow-md gap-2">
            <Send className="w-4 h-4" /> MÜKELLEFE GÖNDER
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           {/* Summary Stats */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <Card className="shadow-sm border-slate-200 bg-teal-600 text-white">
                 <CardContent className="p-6">
                    <p className="text-[10px] font-black text-teal-100 uppercase tracking-widest mb-1">Toplam Tahakkuk Eden Vergi</p>
                    <h3 className="text-3xl font-black">{SAMPLE_REPORT.totalTax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</h3>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                       <TrendingUp className="w-4 h-4 text-teal-200" />
                       <span className="text-[11px] font-bold">Geçen aya göre %8 daha yüksek</span>
                    </div>
                 </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200 bg-white">
                 <CardContent className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dosya Hazırlık Skoru</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-3xl font-black text-slate-800">92</h3>
                       <span className="text-sm font-bold text-slate-400">/ 100</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight">Kritik Belgeler Tamam</span>
                    </div>
                 </CardContent>
              </Card>
           </div>

           {/* Tax Breakdown */}
           <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-50">
                 <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-teal-500" /> Vergi Kırılımı
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="space-y-4">
                    {SAMPLE_REPORT.taxBreakdown.map((item, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                            <span>{item.name}</span>
                            <span>{item.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500" style={{ width: `${(item.amount / SAMPLE_REPORT.totalTax) * 100}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           {/* AI Opportunities */}
           <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-lg border-indigo-200 bg-indigo-50/50 overflow-hidden text-left">
                 <CardHeader className="py-4 bg-indigo-600 text-white">
                    <div className="flex items-center gap-2">
                       <Sparkles className="w-4 h-4" />
                       <CardTitle className="text-[12px] font-black uppercase tracking-widest">Akıllı Vergi Tasarruf Önerileri</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent className="p-5 space-y-3">
                    {SAMPLE_REPORT.opportunities.map((opp: any, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 bg-white border border-indigo-100 rounded-lg shadow-sm">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                            {opp.icon}
                         </div>
                         <p className="text-[12px] text-slate-700 font-bold leading-snug">{opp.text}</p>
                      </div>
                    ))}
                 </CardContent>
              </Card>
           </div>
        </div>

        <div className="space-y-6">
           <Card className="shadow-sm border-slate-200 bg-white">
              <CardHeader className="py-4 border-b border-slate-50">
                 <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-800">Mevcut Risk Haritası</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                 {SAMPLE_REPORT.riskSummary.map((risk, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div className="space-y-0.5 text-left">
                        <div className="text-[12px] font-bold text-slate-800 leading-tight">{risk.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{risk.level} RİSK</div>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        risk.level === 'Yüksek' ? 'bg-rose-500 animate-pulse' : 
                        risk.level === 'Orta' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></div>
                   </div>
                 ))}
                 <Button variant="ghost" className="w-full text-[11px] font-black text-slate-400 hover:text-teal-600 mt-2">TÜM ANALİZİ GÖR</Button>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200 bg-slate-900 text-white overflow-hidden text-left">
              <CardHeader className="py-4 border-b border-white/5">
                 <CardTitle className="text-[12px] font-black uppercase tracking-widest text-teal-400">Danışman Notu</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="flex gap-3 mb-4">
                    <Briefcase className="w-5 h-5 text-teal-500 shrink-0" />
                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic">
                      "Nisan ayı mizan kontrollerinizde kasa bakiyesinin yüksekliği dikkat çekmektedir. Ay sonuna kadar ortaklardan alacakların adatlandırılması vergisel açıdan elzemdir."
                    </p>
                 </div>
                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">Mali Müşavir</span>
                    <span className="text-[10px] font-bold text-slate-300">İbrahim Çelik & Ekibi</span>
                 </div>
              </CardContent>
           </Card>

           <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full h-11 border-slate-200 font-bold text-slate-600 gap-2 shadow-sm">
                 <Printer className="w-3.5 h-3.5" /> YAZDIR
              </Button>
              <Button variant="outline" className="w-full h-11 border-slate-200 font-bold text-slate-600 gap-2 shadow-sm">
                 <Share2 className="w-3.5 h-3.5" /> LİNK OLARAK PAYLAŞ
              </Button>
           </div>
        </div>
      </div>

       {/* Final Safety Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4 text-left">
             <div className="shrink-0 mt-1">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Aylık mükellef raporu, cari ay içerisindeki muhasebe kayıtları ve verilen beyannameler üzerinden özetlenmiştir. Raporun doğruluğu, sisteme sunulan belgelerin (Kanıt Merkezi) tamlığına bağlıdır. Vergi tasarruf önerileri genel nitelikte olup, uygulamaya geçmeden önce mükellef bazında spesifik durumların YMM veya mali müşavir tarafından onaylanması şarttır. Bu rapor resmi bir mali tablo yerine geçmez.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
