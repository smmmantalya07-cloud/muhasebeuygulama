import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, AlertTriangle, Search, Filter, 
  FileWarning, Scale, ShieldCheck, ArrowRight,
  Eye, Download, ClipboardList, Send,
  AlertCircle, CheckCircle2, XCircle, Info,
  SearchCode, FileSearch
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

type IndicatorStatus = 'Yüksek Risk' | 'Orta Risk' | 'Düşük Risk' | 'Kontrol Edildi';

interface FakeDocumentCase {
  id: string;
  firmName: string;
  vendorName: string;
  totalAmount: number;
  date: string;
  riskScore: number;
  status: IndicatorStatus;
  indicators: string[];
  inspectorNotes: string;
}

const SAMPLE_DATA: FakeDocumentCase[] = [
  {
    id: '1',
    firmName: 'ABC İnşaat Ltd. Şti.',
    vendorName: 'XYZ Yapı Malzemeleri San. Tic.',
    totalAmount: 1450000.00,
    date: '10.05.2026',
    riskScore: 82,
    status: 'Yüksek Risk',
    indicators: [
      'Tedarikçi faaliyet konusu ile fatura açıklaması uyumsuzluğu',
      'Banka ödemesi bulunmayan yüksek tutarlı işlem',
      'Teslim tutanağı ve irsaliye kayıtları eksik',
      'Yeni kurulan şirketten alış yapılmış olması'
    ],
    inspectorNotes: "Sahte veya muhteviyatı itibarıyla yanıltıcı belge emareleri tespit edilmiştir. Nihai değerlendirme için belge, ödeme, teslim, hizmet ifası ve ticari ilişki kanıtları incelenmelidir."
  },
  {
    id: '2',
    firmName: 'Gama Medikal A.Ş.',
    vendorName: 'Lojistik Sistemleri Hizmetleri',
    totalAmount: 24000.00,
    date: '15.05.2026',
    riskScore: 35,
    status: 'Düşük Risk',
    indicators: [
      'Yinelenen fatura numarası denemesi'
    ],
    inspectorNotes: "İnceleme gerektiren belge emareleri mevcuttur. Mükelleften teslim kanıtı istenmesi önerilir."
  }
];

export function FakeDocumentIndicatorsPage() {
  const [selectedCase, setSelectedCase] = useState<FakeDocumentCase>(SAMPLE_DATA[0]);

  const getStatusColor = (status: IndicatorStatus) => {
    switch (status) {
      case 'Yüksek Risk': return 'bg-red-500';
      case 'Orta Risk': return 'bg-orange-500';
      case 'Düşük Risk': return 'bg-blue-500';
      case 'Kontrol Edildi': return 'bg-emerald-500';
    }
  };

  const getStatusBadge = (status: IndicatorStatus) => {
    switch (status) {
      case 'Yüksek Risk': return <Badge className="bg-red-100 text-red-700 border-none font-bold text-[10px] tracking-wide">YÜKSEK RİSK</Badge>;
      case 'Orta Risk': return <Badge className="bg-orange-100 text-orange-700 border-none font-bold text-[10px] tracking-wide">ORTA RİSK</Badge>;
      case 'Düşük Risk': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] tracking-wide">DÜŞÜK RİSK</Badge>;
      case 'Kontrol Edildi': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] tracking-wide">KONTROL EDİLDİ</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shadow-sm text-rose-600">
             <FileWarning className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sahte Belge Emareleri</h2>
             <p className="text-[13px] text-slate-500 font-medium">SMİYB (Sahte Belge) risk tarama ve doğruluğu ispat analizleri</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <SearchCode className="w-4 h-4" /> KOD 4 SORGULA
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            TAM TARAMA BAŞLAT
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         {/* Risk List */}
         <div className="space-y-4">
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
               <CardHeader className="py-4 border-b border-slate-50">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-500">Riskli Tedarikçiler / Faturalar</CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                     {SAMPLE_DATA.map(c => (
                        <div 
                          key={c.id} 
                          className={`p-4 cursor-pointer hover:bg-slate-50 transition-all ${selectedCase.id === c.id ? 'bg-rose-50/30 ring-1 ring-inset ring-rose-100' : ''}`}
                          onClick={() => setSelectedCase(c)}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase">{c.date}</span>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(c.status)}`}></div>
                           </div>
                           <h4 className="text-[13px] font-bold text-slate-800 mb-1 truncate">{c.vendorName}</h4>
                           <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-500">{c.totalAmount.toLocaleString('tr-TR')} ₺</span>
                              <span className={`text-[11px] font-black ${c.riskScore > 70 ? 'text-rose-600' : 'text-amber-500'}`}>%{c.riskScore} RİSK</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldAlert className="w-16 h-16" />
               </div>
               <h4 className="text-[13px] font-black uppercase tracking-widest text-rose-400 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Mevzuat Uyarısı
               </h4>
               <p className="text-[11px] text-slate-300 font-bold leading-relaxed mb-4">
                  "Mal veya hizmetin gerçekten alınmadığına dair emareler (VUK 359), KDV indiriminin reddi ve 3 kat vergi ziyaı cezası riskini doğurur."
               </p>
               <div className="pt-4 border-t border-white/10 text-[10px] font-bold text-slate-500 uppercase">
                  VUK MADDE 359/1-b
               </div>
            </div>
         </div>

         {/* Analysis Details */}
         <div className="lg:col-span-2 space-y-6 text-left">
            <Card className="shadow-lg border-rose-100 bg-white overflow-hidden animate-in fade-in duration-500">
               <CardHeader className="bg-white border-b border-slate-100 py-6 px-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           {getStatusBadge(selectedCase.status)}
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedCase.firmName}</span>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 tracking-tight text-left">{selectedCase.vendorName}</CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-500 uppercase mt-1">İşlem Bazlı Risk Haritası</CardDescription>
                     </div>
                     <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 min-w-[120px]">
                         <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Risk Skoru</span>
                         <span className={`text-2xl font-black ${selectedCase.riskScore > 70 ? 'text-rose-600' : 'text-amber-600'}`}>%{selectedCase.riskScore}</span>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-8">
                  {/* Indicators Checklist */}
                  <div className="space-y-4">
                     <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-rose-600" /> Tespit Edilen Risk Emareleri
                     </h5>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCase.indicators.map((ind, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-rose-50 bg-rose-50/10 hover:bg-rose-50/20 transition-colors">
                              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                              <span className="text-[11px] font-bold text-slate-600 leading-snug">{ind}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Inspector Analysis (Structured Language) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                           <FileSearch className="w-5 h-5" />
                        </div>
                        <div>
                           <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Ön Denetim Değerlendirmesi</h5>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Resmi Dil Standartları Aktif</span>
                        </div>
                     </div>
                     <p className="text-[13px] text-slate-700 font-bold leading-relaxed italic border-l-4 border-rose-500 pl-4 py-1">
                        "{selectedCase.inspectorNotes}"
                     </p>
                  </div>

                  {/* Action Step */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-100 shrink-0">
                           <ShieldCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                           <h6 className="text-[13px] font-black text-blue-900 uppercase">Kanıt Toplama Aksiyonu</h6>
                           <p className="text-[11px] text-blue-800 font-medium mt-1">Bu işlemin gerçekliğini kanıtlamak için Sözleşme, Teslim Tutanağı ve Banka Ödeme Dekontu'nu derhal talep edin.</p>
                        </div>
                     </div>
                     <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 shadow-md gap-2 whitespace-nowrap">
                        BELGE İSTE <Send className="w-4 h-4" />
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="shadow-sm border-slate-200 bg-white p-5 text-left">
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <ClipboardList className="w-4 h-4 text-slate-400" /> Onay Bekleyenler
                  </h4>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between p-2 rounded bg-slate-50 text-[11px] font-bold text-slate-600">
                        <span>YMM Kontrolü Bekleyen</span>
                        <Badge variant="outline" className="text-[9px]">4 BELGE</Badge>
                     </div>
                     <div className="flex items-center justify-between p-2 rounded bg-slate-50 text-[11px] font-bold text-slate-600">
                        <span>Mükellef Açıklaması Bekleyen</span>
                        <Badge variant="outline" className="text-[9px]">2 BELGE</Badge>
                     </div>
                  </div>
               </Card>
               <Card className="shadow-sm border-slate-200 bg-white p-5 text-left flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 text-rose-600">
                     <XCircle className="w-4 h-4" />
                     <h4 className="text-[12px] font-black uppercase tracking-widest">Kritik Engelleme</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                     SMİYB riski %80 üzeri olan belgeler "Beyanname Önizleme" modülünden otomatik olarak çıkartılmış ve KDV indirimi reddedilmiştir.
                  </p>
               </Card>
            </div>
         </div>
      </div>

       {/* Final Safety Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4 text-left">
             <div className="shrink-0 mt-1">
                <AlertCircle className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Sistem kesinlikle "bu belge sahtedir" şeklinde bir hukuki hüküm vermez. Tüm analizler "Emare", "Risk" ve "İnceleme Gerekliliği" çerçevesinde sunulur. Bir belgenin sahte olup olmadığı sadece Vergi Müfettişi tarafından yapılan fiili bir inceleme ve düzenlenen "Vergi Tekniği Raporu" ile kesinleşebilir. Bu modülün amacı, mali müşavir ve mükellefi potansiyel inceleme risklerine karşı önceden uyarmak ve ispat gücünü (Kanıt Merkezi) artırmaktır.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
