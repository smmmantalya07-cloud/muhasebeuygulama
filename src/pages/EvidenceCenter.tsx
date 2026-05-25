import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  XCircle, Search, Filter, Download, Plus, 
  FileStack, Landmark, ScrollText, ClipboardCheck,
  Scale, ShieldAlert, MoreVertical, Eye,
  ArrowRight, ListChecks, FileSearch,
  Users, Briefcase, FileSignature
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

type EvidencePower = 'Güçlü' | 'Orta' | 'Zayıf' | 'Kanıt Yetersiz' | 'Kanıt Yok';

interface EvidenceDetail {
  type: string;
  exists: boolean;
  power: number; // 0-100
}

interface EvidenceItem {
  id: string;
  transaction: string;
  amount: number;
  date: string;
  details: EvidenceDetail[];
  power: EvidencePower;
  score: number;
  taxInspectorView: string;
  ymmView: string;
  auditorView: string;
  status: 'Tasdik Edilebilir' | 'İnceleme Gerekli' | 'Riskli' | 'Geliştirilmeli';
}

const SAMPLE_EVIDENCES: EvidenceItem[] = [
  {
    id: '1',
    transaction: 'Hammade Alımı - ABC Metal Ltd. Şti.',
    amount: 1250000.00,
    date: '10.05.2026',
    details: [
      { type: 'e-Fatura', exists: true, power: 100 },
      { type: 'Banka Dekontu', exists: true, power: 100 },
      { type: 'Sözleşme', exists: true, power: 90 },
      { type: 'e-İrsaliye', exists: true, power: 100 },
      { type: 'Cari Mutabakat', exists: true, power: 85 },
      { type: 'Teslim Tutanağı', exists: false, power: 0 },
    ],
    power: 'Güçlü',
    score: 92,
    status: 'Tasdik Edilebilir',
    taxInspectorView: "İşlem banka yoluyla ödenmiş, fatura ve irsaliye uyumlu. Teslim tutanağı eksikliği yan kanıtlarla (irsaliye) telafi edilebilir.",
    ymmView: "Karşıt inceleme olumlu dönmesi durumunda tam tasdik raporuna güvenle alınabilir.",
    auditorView: "Önemli yanlışlık riski düşük. Maddi doğrulama testleri başarılı."
  },
  {
    id: '2',
    transaction: 'Yazılım Danışmanlık Hizmeti - X Tech',
    amount: 240000.00,
    date: '15.05.2026',
    details: [
      { type: 'e-Arşiv Fatura', exists: true, power: 100 },
      { type: 'Banka Dekontu', exists: true, power: 100 },
      { type: 'Hizmet Kabul Tutanağı', exists: false, power: 0 },
      { type: 'Sözleşme', exists: false, power: 0 },
      { type: 'İş Teslim Belgesi', exists: false, power: 0 },
    ],
    power: 'Zayıf',
    score: 42,
    status: 'Riskli',
    taxInspectorView: "Hizmet ifasının ispatı yetersiz. Somut çıktı (kod, rapor, ekran görüntüsü) sunulamazsa gider reddedilebilir.",
    ymmView: "Hizmet teslimine dair kanıtlar tamamlanmadan KDV iadesi listesine dahil edilmesi sakıncalıdır.",
    auditorView: "Hizmetin gerçekliği konusunda 'Makul Güvence' sağlanamıyor. Kanıt yetersizliği mevcut."
  },
  {
    id: '3',
    transaction: 'Pazarlama Gideri - Sosyal Medya Reklam',
    amount: 45000.00,
    date: '18.05.2026',
    details: [
      { type: 'Kredi Kartı Slipleri', exists: true, power: 60 },
      { type: 'Ekran Görüntüleri', exists: true, power: 40 },
      { type: 'Fatura', exists: false, power: 0 },
    ],
    power: 'Kanıt Yetersiz',
    score: 25,
    status: 'Riskli',
    taxInspectorView: "VUK 227 uyarınca tevsik edici belge (fatura) yokluğu sebebiyle gider kabul edilmez.",
    ymmView: "Fatura aslı veya e-fatura kaydı olmadan tasdik raporuna konu edilemez.",
    auditorView: "Sistemik hata riski. Belge düzeni iç kontrol zayıflığına işaret ediyor."
  }
];

export function EvidenceCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);

  const getPowerColor = (power: EvidencePower) => {
    switch (power) {
      case 'Güçlü': return 'bg-emerald-500';
      case 'Orta': return 'bg-blue-500';
      case 'Zayıf': return 'bg-amber-500';
      case 'Kanıt Yetersiz': return 'bg-orange-500';
      case 'Kanıt Yok': return 'bg-rose-500';
    }
  };

  const getStatusBadge = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'Tasdik Edilebilir': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] gap-1"><CheckCircle2 className="w-3 h-3" /> TASDİK EDİLEBİLİR</Badge>;
      case 'İnceleme Gerekli': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] gap-1"><FileSearch className="w-3 h-3" /> İNCELEME GEREKLİ</Badge>;
      case 'Riskli': return <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[10px] gap-1"><ShieldAlert className="w-3 h-3" /> YÜKSEK RİSK</Badge>;
      case 'Geliştirilmeli': return <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] gap-1"><AlertTriangle className="w-3 h-3" /> GELİŞTİRİLMELİ</Badge>;
    }
  };

  const filteredData = SAMPLE_EVIDENCES.filter(item => 
    item.transaction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shadow-sm text-amber-600">
             <ShieldCheck className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Kanıt Merkezi</h2>
             <p className="text-[13px] text-slate-500 font-medium">İşlemlerin ispat gücü, belge tamlığı ve BDS/VUK uyum ölçümü</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2 uppercase tracking-widest text-[10px]">
             KANIT DOSYASI İNDİR
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            <Plus className="w-4 h-4" /> KANIT EKLE
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         {/* List View */}
         <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-800">İşlemler ve Kanıt Gücü</CardTitle>
                     <div className="relative w-48">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="İşlem ara..." 
                          className="w-full pl-8 pr-3 h-8 text-[11px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-amber-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                     {filteredData.map((item) => (
                        <div 
                           key={item.id} 
                           className={`p-5 cursor-pointer transition-all hover:bg-slate-50 ${selectedItem?.id === item.id ? 'bg-amber-50/50 border-r-4 border-amber-500' : ''}`}
                           onClick={() => setSelectedItem(item)}
                        >
                           <div className="flex items-start justify-between mb-3">
                              <h4 className="text-[13px] font-black text-slate-900 leading-tight uppercase mr-4">{item.transaction}</h4>
                              {getStatusBadge(item.status)}
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                                 <span>{item.date}</span>
                                 <span className="text-slate-900">{item.amount.toLocaleString('tr-TR')} ₺</span>
                              </div>
                              <div className="w-32 flex items-center gap-3">
                                 <Progress value={item.score} className={`h-1.5 ${getPowerColor(item.power)}`} />
                                 <span className="text-[11px] font-black text-slate-700">%{item.score}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Detailed Triple Review View */}
         <div className="lg:col-span-2 space-y-6">
            {selectedItem ? (
               <>
                  <Card className="shadow-sm border-slate-200 bg-white">
                     <CardHeader className="py-4 border-b border-slate-50">
                        <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-800">Kanıt Envanteri Analizi</CardTitle>
                     </CardHeader>
                     <CardContent className="p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                           {selectedItem.details.map((detail, idx) => (
                              <div key={idx} className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1.5 ${detail.exists ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100 opacity-60'}`}>
                                 {detail.exists ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                                 <span className={`text-[10px] font-black uppercase ${detail.exists ? 'text-emerald-800' : 'text-rose-800'}`}>{detail.type}</span>
                              </div>
                           ))}
                        </div>

                        <div className="grid gap-4">
                           <ViewBox title="Vergi Müfettişi Görüşü" content={selectedItem.taxInspectorView} role="Müfettiş" color="rose" />
                           <ViewBox title="YMM Görüşü" content={selectedItem.ymmView} role="YMM" color="blue" />
                           <ViewBox title="Bağımsız Denetçi Görüşü" content={selectedItem.auditorView} role="Denetçi" color="emerald" />
                        </div>
                     </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                     <Card className="p-4 border-slate-200 shadow-sm bg-slate-900 text-white">
                        <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Dosya Hazırlık Skoru</h5>
                        <div className="flex items-end justify-between">
                           <span className="text-3xl font-black">{selectedItem.score}</span>
                           <Badge variant="outline" className="border-white/20 text-white text-[9px] font-bold px-2 py-0.5">{selectedItem.power} KANIT</Badge>
                        </div>
                     </Card>
                     <Button className="h-auto bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-[11px] py-4 shadow-lg group">
                        MÜKELLEFE EKSİK BELGE SOR <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </div>
               </>
            ) : (
               <div className="h-full flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <FileSearch className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Analiz İçin Bir İşlem Seçin</h4>
                  <p className="text-[11px] text-slate-400 font-medium max-w-[240px] mt-2">İşlemin kanıt gücünü ve üçlü denetim perspektifini görmek için listeden seçim yapınız.</p>
               </div>
            )}
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
                   Kanıt Merkezi, her belge ve işlem için "Kanıt Gücü" ölçümü yapar. Sistem; Fatura, e-Defter kaydı, Banka dekontu, Sözleşme, Sipariş formu, İrsaliye ve Teslim tutanağı gibi 20'den fazla kanıt türünü çapraz sorgular. Kanıt yetersizse sistem kesin gider kabulü veya KDV indirimi yönünde hüküm vermez. Nihai değerlendirme için karşıt inceleme kanıtları, ticari ilişki olağanlığı ve ödeme zinciri mali müşavir veya denetçi tarafından kontrol edilmelidir.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function ViewBox({ title, content, role, color }: { title: string, content: string, role: string, color: 'rose' | 'blue' | 'emerald' }) {
   const colorMap = {
      rose: "border-rose-100 bg-rose-50/30 text-rose-900",
      blue: "border-blue-100 bg-blue-50/30 text-blue-900",
      emerald: "border-emerald-100 bg-emerald-50/30 text-emerald-900"
   };
   const labelColor = {
      rose: "bg-rose-600",
      blue: "bg-blue-600",
      emerald: "bg-emerald-600"
   };

   return (
      <div className={`p-4 border rounded-xl ${colorMap[color]} relative group hover:shadow-sm transition-all`}>
         <div className="flex items-center justify-between mb-2">
            <h5 className="text-[11px] font-black uppercase tracking-widest">{title}</h5>
            <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider ${labelColor[color]}`}>{role}</span>
         </div>
         <p className="text-[11px] font-medium leading-relaxed italic">"{content}"</p>
      </div>
   );
}
