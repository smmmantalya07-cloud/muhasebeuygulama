import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, Landmark, ClipboardCheck, 
  Scale, ShieldAlert, AlertTriangle, 
  Search, Filter, Plus, FileText, CheckCircle2,
  Users, Briefcase, FileSearch, Sparkles, Send,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ActionBar } from '@/components/ActionBar';

type RiskLevel = 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';

interface AuditCase {
  id: string;
  firmName: string;
  transaction: string;
  amount: number;
  date: string;
  riskLevel: RiskLevel;
  inspectorView: string;
  ymmView: string;
  auditorView: string;
  score: number;
}

const SAMPLE_CASES: AuditCase[] = [
  {
    id: '1',
    firmName: 'ABC İnşaat Ltd. Şti.',
    transaction: 'İlişkili Taraf - Arsa Alımı',
    amount: 12500000.00,
    date: '10.05.2026',
    riskLevel: 'Kritik',
    score: 88,
    inspectorView: "Emsal bedelin altında alım yapılarak örtülü kazanç dağıtımı şüphesi bulunmaktadır. Transfer fiyatlandırması raporu eksiktir.",
    ymmView: "İşlem tutarı yüksek olduğu için değerleme raporu şarttır. Tasdik raporunda 'şartlı' olarak belirtilmesi önerilir.",
    auditorView: "Önemli yanlışlık riski yüksektir. Finansal tablolarda ilişkili taraf açıklamaları VUK ve TMS uyumlu değildir."
  },
  {
    id: '2',
    firmName: 'Gama Medikal A.Ş.',
    transaction: 'Dönem Sonu Kasa Sayım Farkı',
    amount: 450000.00,
    date: '20.05.2026',
    riskLevel: 'Yüksek',
    score: 72,
    inspectorView: "Kasa fazlası, faturalanmamış satışların göstergesi kabul edilir. KDV ve Kurumlar Vergisi yönünden inceleme sebebidir.",
    ymmView: "Adatlandırma yapılarak faiz geliri hesaplanmalı ve KDV beyan edilmelidir. Aksi takdirde rapor yazılamaz.",
    auditorView: "Kasa mutabakatı sağlanamamıştır. İç kontrol zayıflığı olarak bildirilmelidir."
  }
];

export function TripleAuditPage() {
  const [selectedCase, setSelectedCase] = useState<AuditCase | null>(SAMPLE_CASES[0]);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Kritik': return 'bg-red-500';
      case 'Yüksek': return 'bg-orange-500';
      case 'Orta': return 'bg-amber-500';
      case 'Düşük': return 'bg-blue-500';
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Kritik': return <Badge className="bg-red-100 text-red-700 border-none font-bold text-[10px] tracking-wide">KRİTİK RİSK</Badge>;
      case 'Yüksek': return <Badge className="bg-orange-100 text-orange-700 border-none font-bold text-[10px] tracking-wide">YÜKSEK RİSK</Badge>;
      case 'Orta': return <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] tracking-wide">ORTA RİSK</Badge>;
      case 'Düşük': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] tracking-wide">DÜŞÜK RİSK</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-600">
             <Scale className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight text-left">Üçlü Denetim Paneli</h2>
             <p className="text-[13px] text-slate-500 font-medium text-left">Müfettiş, YMM ve Denetçi gözüyle 360 derece risk analizi</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 shadow-md gap-2">
             <Plus className="w-4 h-4" /> YENİ ANALİZ BAŞLAT
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="space-y-4">
           <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
              <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                 <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-500">Analiz Bekleyen Vakalar</CardTitle>
                 <Badge variant="outline" className="text-[10px] font-bold">{SAMPLE_CASES.length}</Badge>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-slate-100">
                    {SAMPLE_CASES.map(c => (
                       <div 
                         key={c.id} 
                         onClick={() => setSelectedCase(c)}
                         className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedCase?.id === c.id ? 'bg-indigo-50/50 ring-1 ring-inset ring-indigo-100' : ''}`}
                       >
                          <div className="flex items-center justify-between mb-2">
                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.date}</div>
                             <div className={`w-2 h-2 rounded-full ${getRiskColor(c.riskLevel)}`}></div>
                          </div>
                          <h4 className="text-[13px] font-bold text-slate-800 mb-1 truncate">{c.transaction}</h4>
                          <div className="text-[11px] font-bold text-slate-500">{c.amount.toLocaleString('tr-TR')} ₺</div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-start gap-4 text-left">
                 <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-[13px] font-black text-slate-800 uppercase mb-1">Müfettiş Algoritması</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                       Sistem, Vergi Denetim Kurulu'nun "Risk Analiz Merkezi" kriterlerini kullanarak çapraz sorgular yapar.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Detailed Analysis View */}
        <div className="lg:col-span-2 space-y-6">
           {selectedCase ? (
             <div className="space-y-6">
                <Card className="shadow-md border-indigo-100 bg-white overflow-hidden animate-in fade-in duration-300">
                   <CardHeader className="bg-slate-900 text-white py-5 px-6 border-b border-white/10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               {getRiskBadge(selectedCase.riskLevel)}
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DOSYA NO: {selectedCase.id}</span>
                            </div>
                            <CardTitle className="text-lg font-black tracking-tight">{selectedCase.transaction}</CardTitle>
                            <CardDescription className="text-slate-400 font-bold text-xs uppercase">{selectedCase.firmName}</CardDescription>
                         </div>
                         <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center min-w-[100px]">
                            <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">Risk Skoru</div>
                            <div className="text-2xl font-black text-white">%{selectedCase.score}</div>
                         </div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      {/* Three Perspective Boxes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                         {/* Inspector View */}
                         <div className="p-6 space-y-4 hover:bg-red-50/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                  <Landmark className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black text-red-800 uppercase tracking-widest">Vergi Müfettişi</span>
                            </div>
                            <p className="text-[12px] text-slate-600 font-bold leading-relaxed italic border-l-2 border-red-100 pl-3">
                               "{selectedCase.inspectorView}"
                            </p>
                            <div className="pt-4 border-t border-slate-50">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Olası Eleştiri</label>
                               <Badge variant="outline" className="border-red-200 text-red-700 bg-white text-[9px] font-black">VUK MD. 359 / KAÇAKÇILIK RİSKİ</Badge>
                            </div>
                         </div>

                         {/* YMM View */}
                         <div className="p-6 space-y-4 hover:bg-blue-50/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                  <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest">YMM Görüşü</span>
                            </div>
                            <p className="text-[12px] text-slate-600 font-bold leading-relaxed italic border-l-2 border-blue-100 pl-3">
                               "{selectedCase.ymmView}"
                            </p>
                            <div className="pt-4 border-t border-slate-50">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tasdik Durumu</label>
                               <Badge variant="outline" className="border-blue-200 text-blue-700 bg-white text-[9px] font-black uppercase">ŞARTLI TASDİK ÖNERİLİR</Badge>
                            </div>
                         </div>

                         {/* Auditor View */}
                         <div className="p-6 space-y-4 hover:bg-emerald-50/20 transition-colors group">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                  <ClipboardCheck className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Bağımsız Denetçi</span>
                            </div>
                            <p className="text-[12px] text-slate-600 font-bold leading-relaxed italic border-l-2 border-emerald-100 pl-3">
                               "{selectedCase.auditorView}"
                            </p>
                            <div className="pt-4 border-t border-slate-50">
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Finansal Etki</label>
                               <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-white text-[9px] font-black uppercase">ÖNEMLİ YANLIŞLIK RİSKİ</Badge>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                   <CardFooter className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">İşlem Tutarı</span>
                            <span className="text-sm font-black text-slate-900">{selectedCase.amount.toLocaleString('tr-TR')} ₺</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kanıt Gücü</span>
                            <span className="text-sm font-black text-indigo-600 uppercase">ORTA</span>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" className="h-10 border-slate-200 shadow-sm font-bold text-slate-700 gap-2">
                           <Send className="w-4 h-4" /> MÜKELLEFE SORU SOR
                         </Button>
                         <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md gap-2 uppercase tracking-widest text-[11px]">
                           GÖREV ATAMASI YAP <ArrowRight className="w-4 h-4" />
                         </Button>
                      </div>
                   </CardFooter>
                </Card>

                {/* Next Steps / Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Card className="border-slate-200 shadow-sm bg-white p-5 text-left">
                      <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileSearch className="w-4 h-4 text-indigo-500" /> İstenen Ek Kanıtlar
                      </h4>
                      <div className="space-y-2">
                         {[
                           'Transfer Fiyatlandırması Raporu',
                           'Emsal Bedel Değerleme Raporu',
                           'Banka Ödeme Dekontları (Sıralı)',
                           'Karşı Taraf Cari Mutabakat Yazısı'
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                             <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                             <span className="text-xs font-bold text-slate-600">{item}</span>
                           </div>
                         ))}
                      </div>
                   </Card>

                   <Card className="border-slate-200 shadow-sm bg-white p-5 text-left">
                      <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-500" /> Savunma Hazırlığı
                      </h4>
                      <div className="space-y-3">
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Müfettiş görüşünde belirtilen "Örtülü Kazanç" iddiasına karşı, emsal faiz oranları ve pazar veri raporları dosyaya eklenmelidir.
                         </p>
                         <Button variant="outline" className="w-full h-9 border-indigo-100 text-indigo-600 bg-indigo-50/30 font-bold text-[10px] uppercase">SAVUNMA TASLAĞI ÜRET &gt;</Button>
                      </div>
                   </Card>
                </div>
             </div>
           ) : (
             <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/20 text-center">
                <FileSearch className="w-12 h-12 text-slate-200 mb-4" />
                <h3 className="text-slate-400 font-bold text-sm tracking-wide">Analiz etmek için sol listeden bir vaka seçin.</h3>
             </div>
           )}
        </div>
      </div>

       {/* Floating Action Bar (Sticky) */}
       <ActionBar 
         onUpload={() => toast.info('Veri yükleme modülü açılıyor...')}
         onAnalyze={() => toast.success('Seçili vaka için derinlemesine analiz başlatıldı.')}
         onShowRisks={() => toast.info('Risk merkezi yükleniyor...')}
         onDownloadPdf={() => toast.success('Üçlü Denetim Raporu PDF olarak hazırlandı.')}
         onDownloadExcel={() => toast.success('Vaka verileri Excel e aktarıldı.')}
         onDownloadWord={() => toast.success('İzahat / Savunma taslağı Word olarak hazırlandı.')}
       />

       {/* Final Safety Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4 text-left">
             <div className="shrink-0 mt-1">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Üçlü Denetim Paneli'nde sunulan görüşler, yapay zeka tarafından Türk Vergi Mevzuatı, Tasdik Yönetmelikleri ve Bağımsız Denetim Standartları (BDS) simülasyonu üzerinden üretilmektedir. Bu görüşler bir "Ön Tahmin" niteliğindedir. Nihai karar, işlemin tüm hukuki ve fiili gerçeklikleri (Kanıt Merkezi verileriyle birlikte) dikkate alınarak sorumlu meslek mensubu tarafından verilmelidir. Sistem uydurma eleştiri üretmez ancak her olayın kendine özgü "İlliyet Bağı" mali müşavir tarafından bizzat kurulmalıdır.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
