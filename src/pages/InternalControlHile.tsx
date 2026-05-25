import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, Fingerprint, Search, AlertCircle, 
  Lock, Unlock, ShieldCheck, Flame, 
  Zap, ArrowRight, TrendingUp, AlertTriangle,
  Scale, FileSearch, ShieldUser, History,
  LayoutGrid, List, Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RiskIndicator {
  id: string;
  title: string;
  category: 'Yetki Denetimi' | 'Hile Emareti' | 'Süreç Zayıflığı' | 'Veri Manipülasyonu';
  riskLevel: 'Kritik' | 'Yüksek' | 'Orta' | 'Düşük';
  score: number;
  description: string;
  inspectorView: string;
  auditorView: string;
  action: string;
}

const FRAUD_RISKS: RiskIndicator[] = [
  {
    id: '1',
    title: 'Mesai Dışı Kayıt Yoğunluğu',
    category: 'Yetki Denetimi',
    riskLevel: 'Yüksek',
    score: 82,
    description: 'Yevmiye kayıtlarının %15\'i hafta sonu veya gece saatlerinde girilmiş.',
    inspectorView: "Kayıtların mesai dışı girilmesi, denetimden kaçma veya sahte işlem kurgulama emaresi olabilir. Kayıtları giren kullanıcıların yetkileri incelenmeli.",
    auditorView: "İç kontrol ortamında 'Management Override' (Yönetimin Kontrolleri İhlali) riski. İşletme saatleri dışındaki işlemlerin nedenleri açıklanmalı.",
    action: 'Audit Log İncelemesi Başlat'
  },
  {
    id: '2',
    title: 'Ardışık Küçük Montanlı Giderler',
    category: 'Veri Manipülasyonu',
    riskLevel: 'Orta',
    score: 55,
    description: 'Banka limitleri altına düşürülmüş (7.000 TL altı) çok sayıda nakit kasa ödemesi tespit edildi.',
    inspectorView: "Tevsik zorunluluğundan (banka yoluyla ödeme) kaçınmak amacıyla işlemler parçalara ayrılmış olabilir. VUK mükerrer 355-356 riskleri.",
    auditorView: "Ödeme döngüsünde parçalama riski. Toplamda önemli bir tutara ulaşan bu giderlerin gerçekliği test edilmeli.",
    action: 'Kasa Hareketlerini Analiz Et'
  },
  {
    id: '3',
    title: 'Pasif Tedarikçiden Ani Alım',
    category: 'Hile Emareti',
    riskLevel: 'Kritik',
    score: 94,
    description: 'Son 2 yıldır hiçbir işlem yapılmayan tedarikçiye tek seferde 2.500.000 TL ödeme yapılmış.',
    inspectorView: "Atıl kalmış veya 'sahte belge düzenleyicisine' dönüşmüş bir firma üzerinden haksız gider veya KDV yaratma riski. En yüksek öncelikli risk.",
    auditorView: "Satın alma döngüsünde hile riski. Tedarikçinin varlığı ve hizmetin ifası yerinde incelenmeli.",
    action: 'Karşıt İnceleme Dosyası Hazırla'
  }
];

export function InternalControlHilePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRisk, setSelectedRisk] = useState<RiskIndicator | null>(null);

  const getRiskColor = (level: RiskIndicator['riskLevel']) => {
    switch (level) {
      case 'Kritik': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Yüksek': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Orta': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Düşük': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shadow-sm text-rose-600">
             <Fingerprint className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">İç Kontrol & Hile Riski</h2>
             <p className="text-[13px] text-slate-500 font-medium tracking-tight">Sistemik zayıflıklar, yönetim ihlali ve hileli işlem emareleri analizi</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 text-[11px] font-black uppercase tracking-widest gap-2 bg-slate-50 border-slate-200">
             GENEL RİSK SKORU: %68
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 shadow-md gap-2 text-[11px] uppercase tracking-widest">
            <Flame className="w-4 h-4" /> KRİTİK TARAMA YAP
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <MetricCard label="İç Kontrol Kalitesi" value="%72" subValue="Standart Altı" status="warning" />
         <MetricCard label="Hile Riski Olasılığı" value="%24" subValue="Dikkat Gerekli" status="danger" />
         <MetricCard label="Tespit Edilen Zayıflık" value="14" subValue="7'si Kritik" status="danger" />
         <MetricCard label="Yetki İhlali Sayısı" value="8" subValue="Yönetici Seviyesi" status="warning" />
      </div>

      {/* Risk Grid */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-rose-500" /> KIRMIZI BAYRAK TESPİTLERİ
            </h3>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
               <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('grid')}
               >
                  <LayoutGrid className="w-4 h-4" />
               </Button>
               <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
               >
                  <List className="w-4 h-4" />
               </Button>
            </div>
         </div>

         <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-4"}>
            {FRAUD_RISKS.map((risk) => (
               <Card key={risk.id} className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-all overflow-hidden flex flex-col items-stretch text-left group">
                  <div className="h-1 bg-rose-500 w-full"></div>
                  <CardHeader className="py-4 px-5">
                     <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={`text-[9px] font-black uppercase ${getRiskColor(risk.riskLevel)}`}>{risk.riskLevel} RİSK</Badge>
                        <span className="text-[10px] font-black text-slate-400 tracking-widest">{risk.category}</span>
                     </div>
                     <CardTitle className="text-[15px] font-black text-slate-900 uppercase group-hover:text-rose-600 transition-colors">{risk.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 py-0 flex-1">
                     <p className="text-[12px] text-slate-600 font-medium mb-4 leading-relaxed line-clamp-2">{risk.description}</p>
                     
                     <div className="space-y-4">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic font-medium text-[11px] text-slate-500">
                           <span className="font-black text-rose-600 mr-2 uppercase">Müfettiş:</span>
                           "{risk.inspectorView}"
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic font-medium text-[11px] text-slate-500">
                           <span className="font-black text-blue-600 mr-2 uppercase">Auditor:</span>
                           "{risk.auditorView}"
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter className="p-5 mt-auto border-t border-slate-50">
                     <Button className="w-full h-10 bg-slate-900 border-none hover:bg-slate-800 text-[11px] font-black uppercase tracking-widest group">
                        {risk.action} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </CardFooter>
               </Card>
            ))}
         </div>
      </div>

       {/* Footer Note */}
       <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl mt-6 text-left">
          <div className="flex items-start gap-5">
             <div className="shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <ShieldUser className="w-6 h-6 text-rose-400" />
             </div>
             <div>
                <h4 className="text-[14px] font-black text-rose-400 uppercase tracking-widest mb-2">Denetim ve Hile Standartları Notu (BDS 240 / ISA 240)</h4>
                <p className="text-[12px] text-slate-400 font-medium leading-relaxed opacity-80">
                   Bu modül, Bağımsız Denetim Standartları'nın (BDS 240) hile risklerinin belirlenmesi ve değerlendirilmesi gerekliliklerine uygun olarak tasarlanmıştır. İç kontrol zayıflıkları, yetki sınırlarının aşılması ve olağan dışı finansal hareketler "Kırmızı Bayrak" (Red Flag) metodolojisi ile analiz edilmektedir. Sistemdeki uyarılar birer hile kanıtı değil, "Yüksek Riskli Odak Alanı" olarak kabul edilmelidir. Nihai kararlar için somut belge incelemesi ve yönetim beyanları esas alınmalıdır.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function MetricCard({ label, value, subValue, status }: { label: string, value: string, subValue: string, status: 'success' | 'warning' | 'danger' }) {
  const statusColors = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger: 'text-rose-600'
  };

  return (
    <Card className="shadow-sm border-slate-200 bg-white hover:border-slate-300 transition-all text-left">
      <CardContent className="p-5">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
         <div className="flex items-end justify-between">
            <div>
               <h4 className={`text-2xl font-black ${statusColors[status]}`}>{value}</h4>
               <p className="text-[11px] font-bold text-slate-500 mt-1">{subValue}</p>
            </div>
            <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${statusColors[status]}`}>
               {status === 'danger' ? <Zap className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
