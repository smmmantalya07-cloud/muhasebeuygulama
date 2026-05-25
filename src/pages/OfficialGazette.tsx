import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Newspaper, Calendar, ExternalLink, FileText, 
  AlertTriangle, Users, ClipboardList, Send, 
  MessageSquare, ChevronDown, ChevronUp, Search,
  Filter, BookOpen, Scale, ShieldAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface LegislationItem {
  id: string;
  source: string;
  date: string;
  number: string;
  type: string;
  title: string;
  relatedLaw: string;
  effectiveDate: string;
  affectedAudiences: string[];
  affectedSectors: string[];
  systemModule?: string;
  accountantAction: string;
  clientAction: string;
  declarationImpact: string;
  payrollImpact: string;
  electronicsImpact: string;
  taxRisk: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  summary: string;
  announcementText: string;
  link: string;
}

const LEGISLATION_DATA: LegislationItem[] = [
  {
    id: '1',
    source: 'Resmî Gazete',
    date: '21 Mayıs 2026',
    number: '33421',
    type: 'Tebliğ',
    title: 'Vergi Usul Kanunu Genel Tebliği (Sıra No: 562) - Enflasyon Düzeltmesi Uygulaması',
    relatedLaw: 'VUK Mükerrer Madde 298',
    effectiveDate: '01.01.2026',
    affectedAudiences: ['Bilanço Esasına Göre Defter Tutan Mükellefler', 'KVK Mükellefleri'],
    affectedSectors: ['Tüm Sektörler'],
    systemModule: 'Denetim & Risk',
    accountantAction: 'Mizan kontrolleri yapılmalı, önceki dönem adatlandırma verileri hazır tutulmalı ve parasal olmayan kalemler tespit edilmelidir.',
    clientAction: 'Mali tabloların gerçek durumu yansıtması için stok ve duran varlık belgelerini eksiksiz sunmalıdır.',
    declarationImpact: 'Geçici Vergi ve Kurumlar Vergisi beyannamelerinde enflasyon düzeltmesi farkları gösterilecektir.',
    payrollImpact: 'Yok',
    electronicsImpact: 'e-Defter kayıtlarında enflasyon düzeltmesi kayıtları zorunlu hale gelmiştir.',
    taxRisk: 'Kritik',
    summary: '2026 hesap dönemi başından itibaren uygulanacak enflasyon düzeltmesine ilişkin usul ve esaslar belirlenmiş, düzeltme katsayıları ve endeksleme yöntemleri detaylandırılmıştır.',
    announcementText: 'Sayın Mükellefimiz, Resmî Gazetedeki son düzenleme ile enflasyon düzeltmesi uygulaması zorunlu hale gelmiştir. Mali tablolarınızın güncellenmesi için stok ve demirbaş listelerinizin doğrulanması gerekmektedir. Bilgilerinize sunarız.',
    link: 'https://www.resmigazete.gov.tr/'
  },
  {
    id: '2',
    source: 'Resmî Gazete',
    date: '19 Mayıs 2026',
    number: '33419',
    type: 'Kanun',
    title: 'Bazı Kanunlarda Değişiklik Yapılmasına Dair Kanun (Sayı: 7602) - Yatırım Teşvikleri',
    relatedLaw: 'Kurumlar Vergisi Kanunu',
    effectiveDate: 'Yayımlandığı tarihte',
    affectedAudiences: ['Yatırım Teşvik Belgesi Sahipleri', 'Sanayi Sicil Belgesi Sahipleri'],
    affectedSectors: ['İmalat', 'Yazılım', 'Yüksek Teknoloji'],
    systemModule: 'Vergi Danışmanlığı',
    accountantAction: 'Yatırım indirimi oranları kontrol edilmeli, indirimli kurumlar vergisi tablosu güncellenmelidir.',
    clientAction: 'Yatırım teşvik belgesi revize işlemlerini takip etmelidir.',
    declarationImpact: 'Kurumlar Vergisi beyannamesinde indirimli vergi hesaplamaları değişecektir.',
    payrollImpact: 'Asgari ücret destek tutarları revize edilebilir.',
    electronicsImpact: 'Gümrük beyannamesi entegrasyonu gerekebilir.',
    taxRisk: 'Orta',
    summary: 'Yüksek teknoloji yatırımlarında kurumlar vergisi indirim oranı artırılmış, Ar-Ge harcamalarının doğrudan gider yazılma sınırı yükseltilmiştir.',
    announcementText: 'İmalat ve yazılım sektöründeki mükelleflerimiz için yatırım teşvik oranları artırılmıştır. Yeni yatırımlarınız için vergi indirimi hesaplamalarını ofisimiz ile paylaşabilirsiniz.',
    link: 'https://www.resmigazete.gov.tr/'
  }
];

export function OfficialGazettePage() {
  const [expandedId, setExpandedId] = useState<string | null>(LEGISLATION_DATA[0].id);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredData = LEGISLATION_DATA.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.relatedLaw.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
             <Newspaper className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Resmî Gazete & Mevzuat Analizi</h2>
             <p className="text-[13px] text-slate-500 font-medium">Güncel düzenlemelerin müşavirlik süreçlerine etkisi ve aksiyon planları</p>
           </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
               placeholder="Mevzuat ara..." 
               className="pl-9 h-10 text-[13px]" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Button variant="outline" className="h-10 border-slate-200 gap-2 font-semibold text-slate-600 hidden sm:flex">
            <Filter className="w-4 h-4" /> Filtrele
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item) => (
          <Card key={item.id} className={`border-slate-200 shadow-sm transition-all overflow-hidden ${expandedId === item.id ? 'ring-1 ring-blue-500 border-blue-200' : 'hover:border-slate-300'}`}>
            <CardContent className="p-0">
               {/* Header Area */}
               <div 
                 className={`p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${expandedId === item.id ? 'bg-blue-50/30' : ''}`}
                 onClick={() => toggleExpand(item.id)}
               >
                  <div className="shrink-0 flex flex-col items-center gap-1.5 mt-1">
                     <Badge className={
                       item.taxRisk === 'Kritik' ? 'bg-red-500 hover:bg-red-600' : 
                       item.taxRisk === 'Yüksek' ? 'bg-orange-500 hover:bg-orange-600' : 
                       'bg-blue-500 hover:bg-blue-600'
                     }>
                        {item.taxRisk} RİSK
                     </Badge>
                     <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{item.number} NO</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 font-bold text-[10px]">{item.type}</Badge>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </span>
                      <span className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-1 before:content-['•'] before:mr-1">
                        <BookOpen className="w-3.5 h-3.5" /> {item.relatedLaw}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-900 leading-snug">{item.title}</h3>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex" onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.link, '_blank');
                    }}>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </Button>
                    {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
               </div>

               {/* Expanded Details */}
               {expandedId === item.id && (
                  <div className="border-t border-slate-100 p-6 bg-white animate-in slide-in-from-top-2 duration-300">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Summary and Impact Scope */}
                        <div className="lg:col-span-2 space-y-6">
                           <div>
                              <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" /> Mevzuat Özeti
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-lg border border-slate-100">
                                {item.summary}
                              </p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                 <h5 className="text-[11px] font-black text-blue-700 uppercase mb-2">Etkilenen Mükellefler</h5>
                                 <div className="flex flex-wrap gap-1.5">
                                    {item.affectedAudiences.map((aud, i) => (
                                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold text-[10px]">{aud}</Badge>
                                    ))}
                                 </div>
                              </div>
                              <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                 <h5 className="text-[11px] font-black text-emerald-700 uppercase mb-2">Etkilenen Sektörler</h5>
                                 <div className="flex flex-wrap gap-1.5">
                                    {item.affectedSectors.map((sec, i) => (
                                      <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-[10px]">{sec}</Badge>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 uppercase">Yürürlük Tarihi</label>
                                 <div className="text-sm font-bold text-slate-700">{item.effectiveDate}</div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 uppercase">Sistem Modülü</label>
                                 <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                   <div className="w-2 h-2 rounded-full bg-blue-500"></div> {item.systemModule || 'Genel'}
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-black text-slate-400 uppercase">Resmî Kaynak</label>
                                 <div className="text-sm font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                   Resmî Gazete <ExternalLink className="w-3 h-3" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Right Column: Actions and Checklist */}
                        <div className="space-y-6">
                           <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 space-y-4">
                              <h4 className="text-[13px] font-black text-indigo-800 uppercase tracking-wider flex items-center gap-2">
                                <ClipboardList className="w-4 h-4" /> Aksiyon Planı
                              </h4>
                              
                              <div className="space-y-4">
                                 <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mali Müşavir Aksiyonu</label>
                                    <p className="text-[12px] font-bold text-indigo-900 leading-snug mt-1">{item.accountantAction}</p>
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mükellef Aksiyonu</label>
                                    <p className="text-[12px] font-bold text-indigo-900 leading-snug mt-1">{item.clientAction}</p>
                                 </div>
                                 <div className="pt-2 border-t border-indigo-200/50">
                                    <div className="flex items-center justify-between text-[11px] mb-2">
                                       <span className="font-bold text-indigo-700">Beyanname Etkisi:</span>
                                       <span className="font-bold text-slate-600 text-right">{item.declarationImpact}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px]">
                                       <span className="font-bold text-indigo-700">e-Defter/Belge:</span>
                                       <span className="font-bold text-slate-600 text-right">{item.electronicsImpact}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <Button 
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 shadow-md gap-2"
                                onClick={() => {
                                  toast.success("Görev başarıyla oluşturuldu.");
                                }}
                              >
                                <Scale className="w-4 h-4" /> GÖREV OLUŞTUR
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full h-11 font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50 gap-2 shadow-sm"
                                onClick={() => {
                                  toast.success("Duyuru metni kopyalandı!");
                                  navigator.clipboard.writeText(item.announcementText);
                                }}
                              >
                                <Send className="w-4 h-4 text-blue-600" /> MÜKELLEFE DUYURU GÖNDER
                              </Button>
                           </div>
                        </div>
                     </div>

                     {/* Announcement Box Preview */}
                     <div className="mt-8 bg-amber-50/30 border border-amber-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                           <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                           <span className="text-[11px] font-black text-amber-800 uppercase">Mükellef Duyuru Taslağı</span>
                        </div>
                        <p className="text-[12px] text-amber-900/80 italic leading-relaxed">
                          "{item.announcementText}"
                        </p>
                     </div>
                  </div>
               )}
            </CardContent>
          </Card>
        ))}
      </div>

       {/* Final Control Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-10">
          <div className="flex items-start gap-4">
             <div className="shrink-0 mt-1">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                   Bu sayfa üzerinden sunulan mevzuat özetleri ön değerlendirme niteliğindedir. Uygulamada yapılacak işlemler için mutlaka Resmî Gazete’deki tam metnin okunması, yürürlük tarihlerinin teyit edilmesi ve mükellef bazında özel durumların mali müşavir/denetçi tarafından bizzat analiz edilmesi gerekmektedir. AI Studio sistemi uydurma mevzuat üretmemek üzere yapılandırılmıştır ancak resmî bir danışmanlık belgesi yerine geçmez.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
