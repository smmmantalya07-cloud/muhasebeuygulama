import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, CheckCircle2, AlertTriangle, 
  Search, Filter, Plus, FileText, 
  Scale, ShieldCheck, ArrowRight,
  ClipboardCheck, Eye, Download, Info,
  ExternalLink, ShieldAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExpenseItem {
  id: string;
  desc: string;
  amount: number;
  date: string;
  category: string;
  isAcceptable: 'Kabul' | 'KKEG' | 'Şüpheli';
  reason: string;
}

const SAMPLE_DATA: ExpenseItem[] = [
  { id: '1', desc: 'Binek Araç Bakım Onarım (Maliye Sınırı %70)', amount: 12500.00, date: '12.05.2026', category: 'Araç Gideri', isAcceptable: 'Şüpheli', reason: '%70 Kabul / %30 KKEG ayrımı mizan kayıtlarında kontrol edilmelidir.' },
  { id: '2', desc: 'Kurumsal İtibar Danışmanlığı', amount: 85000.00, date: '14.05.2026', category: 'Danışmanlık', isAcceptable: 'Kabul', reason: 'İşletme faaliyeti ile doğrudan bağlantılı, fatura ve ödeme tam.' },
  { id: '3', desc: 'Yemek ve Organizasyon (Belgesiz)', amount: 4200.00, date: '16.05.2026', category: 'Pazarlama', isAcceptable: 'KKEG', reason: 'VUK 227 uyarınca belgesi olmayan harcamalar kanunen kabul edilmeyen giderdir.' },
];

export function ExpenseAcceptancePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: ExpenseItem['isAcceptable']) => {
    switch (status) {
      case 'Kabul': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] gap-1"><CheckCircle2 className="w-3 h-3" /> KABUL EDİLEBİLİR</Badge>;
      case 'KKEG': return <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[10px] gap-1"><ShieldAlert className="w-3 h-3" /> KKEG (KABUL EDİLMEZ)</Badge>;
      case 'Şüpheli': return <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] gap-1"><AlertTriangle className="w-3 h-3" /> ŞÜPHELİ / KISMİ</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm text-blue-600">
             <Building2 className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gider Kabul Kontrolü</h2>
             <p className="text-[13px] text-slate-500 font-medium">GVK 40 ve VUK 227 çerçevesinde giderlerin vergisel analizi</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <ClipboardCheck className="w-4 h-4" /> KKEG LİSTESİ
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-md gap-2">
            <Plus className="w-4 h-4" /> YENİ GİDER ANALİZ ET
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
             <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-500">Gider Hareketleri & Analiz</CardTitle>
                <div className="flex items-center gap-2">
                   <div className="relative w-48">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Gider kalemlerinde ara..." 
                        className="w-full pl-8 pr-3 h-8 text-[11px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase"><Filter className="w-3.5 h-3.5 mr-1" /> FİLTRE</Button>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                   {SAMPLE_DATA.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                         <div className="flex items-start justify-between mb-3">
                            <div className="space-y-1">
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.category} • {item.date}</div>
                               <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{item.desc}</h3>
                            </div>
                            {getStatusBadge(item.isAcceptable)}
                         </div>
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-2 max-w-lg">
                               <p className="text-[12px] text-slate-600 font-bold leading-relaxed italic border-l-2 border-slate-200 pl-3">
                                  "{item.reason}"
                               </p>
                            </div>
                            <div className="text-right">
                               <span className="text-[10px] font-black text-slate-400 uppercase block mb-0.5">Tutar</span>
                               <span className="text-[16px] font-black text-slate-900">{item.amount.toLocaleString('tr-TR')} ₺</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-3 mt-4">
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 hover:bg-blue-50 gap-1.5"><Eye className="w-3.5 h-3.5" /> KANITI GÖR</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-slate-400 hover:text-amber-600 hover:bg-amber-50 gap-1.5"><Scale className="w-3.5 h-3.5" /> MEVZUAT DAYANAĞI</Button>
                            {item.isAcceptable !== 'KKEG' && (
                               <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase text-slate-400 hover:text-rose-600 hover:bg-rose-50 gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> KKEG OLARAK İŞARETLE</Button>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="shadow-sm border-slate-200 bg-white">
              <CardHeader className="py-4 border-b border-slate-50">
                 <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-800">Gider Kabul Kriterleri</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                 <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0 text-emerald-500">
                       <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">İşin genişletilmesi veya idamesi ile ilgili mi?</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0 text-emerald-500">
                       <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">VUK standartlarına uygun kanıtlayıcı belge var mı?</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0 text-amber-500">
                       <Info className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600">Şahsi harcama niteliği taşıyor mu?</span>
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200 bg-slate-900 text-white overflow-hidden text-left">
              <CardHeader className="py-4 border-b border-white/5">
                 <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-400" />
                    <CardTitle className="text-[12px] font-black uppercase tracking-widest text-blue-500">Vergi Müfettişi Yorumu</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-6">
                 <p className="text-[12px] text-slate-300 font-medium leading-relaxed italic mb-4">
                    "Vergi yargısı kararlarında giderin kabulü için 'illiyet bağı' şarttır. İşletmenin geliri ile gideri arasında mantıksal bir bağ kurulamazsa gider reddedilir."
                 </p>
                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <Badge variant="outline" className="text-[9px] border-blue-900 text-blue-400">GVK MD. 40</Badge>
                    <span className="text-[10px] font-bold text-slate-500 inline-flex items-center gap-1.5"><ExternalLink className="w-3 h-3" /> MEVZUAT GÖR</span>
                 </div>
              </CardContent>
           </Card>

           <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-[12px] font-black text-blue-800 uppercase mb-1">Gider Optimizasyonu</h4>
                    <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                       Şirket üzerine kayıtlı araçların gider sınırlandırmaları (Aylık kiralama sınırı: 24.000 TL) sistem tarafından otomatik kontrol edilmektedir.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

       {/* Final Control Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4">
             <div className="shrink-0 mt-1">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Giderlerin vergisel açıdan kabul edilebilirliği; GVK Madde 40, Kurumlar Vergisi Kanunu Madde 8 ve VUK 227-242 maddeleri çerçevesinde analiz edilmiştir. Belgesi olmayan, ticari faaliyetle bağlantısı kurulamayan veya şahsi nitelik taşıyan harcamalar sistem tarafından otomatik olarak KKEG (Kanunen Kabul Edilmeyen Gider) havuzuna yönlendirilir. Binek araç gider kısıtlaması ve amortisman sınırları mizan kayıtlarıyla çapraz kontrol edilmektedir. Nihai tercih ve sınıflandırma mali müşavir onayı ile kesinleşmelidir.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
