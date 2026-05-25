import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  FileText, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSearch,
  Scale,
  ShieldAlert,
  ClipboardList,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type RiskLevel = 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';
type EvidencePower = 'Güçlü' | 'Orta' | 'Zayıf' | 'Yetersiz';

interface VATRisk {
  id: string;
  title: string;
  lawBasis: string;
  riskLevel: RiskLevel;
  evidencePower: EvidencePower;
  desc: string;
  amount?: number;
}

const VAT_RISKS: VATRisk[] = [
  { 
    id: '1', 
    title: 'KDV Oranı Uyumsuzluğu', 
    lawBasis: 'KDV Kanunu Madde 28', 
    riskLevel: 'Kritik', 
    evidencePower: 'Zayıf', 
    desc: 'Bazı satış faturalarında %20 yerine %18 KDV uygulanmış görünüyor. Oran indirimi sağlayan özelge kontrolü eksik.',
    amount: 124500.00
  },
  { 
    id: '2', 
    title: 'Tevkifat Kodu ve Oranı Hatası', 
    lawBasis: 'KDV Tebliği (Seri No: 1) / Madde 2', 
    riskLevel: 'Yüksek', 
    evidencePower: 'Orta', 
    desc: 'İnşaat taahhüt işlerinde (5/10 tevkifat) bazı alt taşeron faturalarında tevkifat uygulanmadığı tespit edilmiştir.',
    amount: 18600.50
  },
  { 
    id: '3', 
    title: 'İndirim İptali Gerekliliği', 
    lawBasis: 'KDV Kanunu Madde 30/c', 
    riskLevel: 'Orta', 
    evidencePower: 'Güçlü', 
    desc: 'Zayi olan ticari mallar (stok noksanı) için daha önce indirilen KDV\'nin "İlave Edilecek KDV" satırında beyan edilmesi gerekebilir.',
    amount: 4200.00
  }
];

export function VATControlCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Kritik': return 'bg-red-50 text-red-700 border-red-100';
      case 'Yüksek': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Orta': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Düşük': return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  const getEvidenceBadge = (power: EvidencePower) => {
    switch (power) {
      case 'Güçlü': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[9px]">GÜÇLÜ KANIT</Badge>;
      case 'Orta': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[9px]">ORTA KANIT</Badge>;
      case 'Zayıf': return <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[9px]">ZAYIF KANIT</Badge>;
      case 'Yetersiz': return <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px]">KANIT YETERSİZ</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm text-emerald-600">
             <Calculator className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">KDV Kontrol & Analiz Merkezi</h2>
             <p className="text-[13px] text-slate-500 font-medium">191 / 391 Çapraz denetim ve risk skorlama paneli</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <FileSearch className="w-4 h-4" /> GİB SORGULA
          </Button>
          <Button className="bg-slate-900 hover:bg-black text-white font-bold h-10 shadow-md gap-2">
            ANALİZİ YENİLE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <StatsCard label="İndirilecek KDV" value="1.254.300" trend="+12%" color="blue" />
         <StatsCard label="Hesaplanan KDV" value="840.200" trend="-5%" color="slate" />
         <StatsCard label="Devreden KDV" value="414.100" trend="+20%" color="emerald" />
         <StatsCard label="Ödenecek KDV" value="0" trend="-" color="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 text-left">
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800">Aktif Risk Analiz Raporu</CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400">Nisan 2026 Dönemi İçin Tespit Edilen Analizler</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 font-black text-[10px] uppercase gap-1.5"><BarChart3 className="w-4 h-4" /> TREND ANALİZİ</Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               {VAT_RISKS.map((risk) => (
                 <div key={risk.id} className="p-5 border border-slate-100 rounded-xl hover:border-blue-200 transition-all bg-white group">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                          <Badge className={`${getRiskColor(risk.riskLevel)} border-none font-bold text-[10px] tracking-wide`}>{risk.riskLevel} RİSK</Badge>
                          <h4 className="text-[14px] font-bold text-slate-900 leading-tight">{risk.title}</h4>
                       </div>
                       {getEvidenceBadge(risk.evidencePower)}
                    </div>
                    <div className="space-y-3">
                       <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-3">
                          "{risk.desc}"
                       </p>
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase block mb-0.5">Yasal Dayanak</span>
                            <span className="text-[11px] font-bold text-slate-700">{risk.lawBasis}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase block mb-0.5">Potansiyel Fark</span>
                            <span className="text-[12px] font-black text-slate-900">{risk.amount?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                          </div>
                       </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                       <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold text-blue-600 border-blue-100 hover:bg-blue-50 gap-1.5"><Scale className="w-3.5 h-3.5" /> DÜZELTME ÖNER</Button>
                       <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-slate-400 gap-1.5"><Eye className="w-3.5 h-3.5" /> KANITLARI GÖR</Button>
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
             <CardHeader className="py-4 border-b border-slate-50">
               <CardTitle className="text-[13px] font-black uppercase tracking-wider text-slate-800">KDV İade Süreç Takibi</CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                   <div className="flex items-center justify-between text-left">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                            <FileText className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-800">İhracat KDV İade Dosyası (Nisan 2026)</div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase">Dosya Hazırlık Durumu: %75</div>
                         </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px]">EKSİK BELGE VAR</Badge>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[75%]" />
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="text-center p-2 rounded border border-slate-100 bg-white">
                         <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Yüklenilen KDV</div>
                         <div className="text-xs font-bold text-slate-800">Hazır</div>
                      </div>
                      <div className="text-center p-2 rounded border border-slate-100 bg-white">
                         <div className="text-[9px] font-black text-slate-400 uppercase mb-1">İndirilecek KDV</div>
                         <div className="text-xs font-bold text-slate-800">Hazır</div>
                      </div>
                      <div className="text-center p-2 rounded border border-amber-100 bg-amber-50/10">
                         <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Gümrük Çıkış</div>
                         <div className="text-xs font-bold text-amber-600 italic">Eksik (2 Adet)</div>
                      </div>
                      <div className="text-center p-2 rounded border border-slate-100 bg-white">
                         <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Karşıt İnceleme</div>
                         <div className="text-xs font-bold text-slate-400 italic">Bekliyor</div>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-6 text-left">
          <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-3">
               <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-500">Üçlü Denetim Görüşü</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
               <div className="space-y-2 relative pt-3">
                  <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Vergi Müfettişi</span>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">"KDV iade taleplerinde 'Yüklenilen KDV' listesindeki faturaların teslim/hizmet uyumu en sık eleştiri alan konudur. İrsaliyeler tam olmalı."</p>
               </div>
               <div className="space-y-2 relative pt-3 border-t border-slate-100">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> YMM Görüşü</span>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">"İade raporunda karşıt inceleme tutanakları eksik olan firmalar 'şüpheli' olarak değerlendirilmelidir. Tasdik güvencesi için banka dekontu şart."</p>
               </div>
               <div className="space-y-2 relative pt-3 border-t border-slate-100">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5"><ClipboardList className="w-3 h-3" /> Bağımsız Denetçi</span>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">"Finansal tablolarda gösterilen 'Devreden KDV' alacağının tahsil kabiliyeti (iade alınabilirliği) önemlilik riski oluşturmaktadır."</p>
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 p-6 bg-indigo-900 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle className="w-16 h-16" />
             </div>
             <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-5 h-5 text-indigo-300" />
                <h4 className="text-xs font-black uppercase tracking-widest">Kırmızı Bayrak Uyarısı</h4>
             </div>
             <p className="text-[11px] text-indigo-100/80 font-medium leading-relaxed mb-4">
                ABC İnşaat LTD ŞTİ için son 3 ayda devreden KDV tutarı %40 artarken, KDV matrahı %10 azalmıştır. Bu durum vergi incelemesi için bir "Kırmızı Bayrak" işaretidir.
             </p>
             <Button variant="outline" className="w-full h-10 border-indigo-700/50 text-white bg-indigo-800/50 hover:bg-indigo-800 font-bold text-[10px] uppercase">ANALİZİ İNDİR</Button>
          </Card>
        </div>
      </div>

      {/* Final Safety Note */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
        <div className="flex items-start gap-4 text-left">
           <div className="shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 text-slate-400" />
           </div>
           <div>
              <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                 KDV analizi; 191, 391 ve 190 nolu hesapların mizan-beyanname uyumu üzerinden gerçekleştirilmiştir. İade dosyalarında kanıt yeterliliği için mutlaka banka ödeme dekontları, GÇB'ler ve sözleşmeler "Kanıt Merkezi" üzerinden teyit edilmelidir. KDV tevkifatlı işlemlerde alıcının/teslim alanın tevkifat yükümlülüğünü yerine getirip getirmediği GİB üzerinden kontrol edilmelidir. Bu rapor mali müşavir onayı olmadan tek başına bir kanıt niteliği taşımaz.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, trend, color }: { label: string, value: string, trend: string, color: 'blue' | 'slate' | 'emerald' | 'rose' }) {
  const colorMap = {
    blue: "text-blue-600",
    slate: "text-slate-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600"
  };

  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-all">
      <CardContent className="p-5 text-left">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</p>
         <div className="flex items-baseline justify-between">
            <h3 className={`text-xl font-black ${colorMap[color]}`}>{value} <span className="text-[10px] font-bold text-slate-400 ml-1">₺</span></h3>
            <span className={`text-[11px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{trend}</span>
         </div>
      </CardContent>
    </Card>
  );
}
