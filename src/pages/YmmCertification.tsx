import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, Landmark, CheckCircle2, 
  AlertTriangle, Search, Filter, Plus, 
  FileText, Scale, ShieldAlert, Clock,
  ArrowRight, ClipboardCheck, Eye, Download,
  FolderLock, UserCheck, ScrollText, Binary
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CertificationCase {
  id: string;
  firmName: string;
  reportType: string;
  period: string;
  status: 'Taslak' | 'İncelemede' | 'İmal Edildi' | 'Teslim Edildi';
  confidenceScore: number;
  missingEvidences: number;
}

const SAMPLE_DATA: CertificationCase[] = [
  { id: '1', firmName: 'ABC İnşaat Ltd. Şti.', reportType: 'Gelir Vergisi Tasdik Raporu', period: '2025/Yıllık', status: 'İncelemede', confidenceScore: 82, missingEvidences: 3 },
  { id: '2', firmName: 'Gama Medikal A.Ş.', reportType: 'KDV İadesi Tasdik Raporu', period: '2026/Nisan', status: 'Taslak', confidenceScore: 45, missingEvidences: 12 },
  { id: '3', firmName: 'Zeta Makine Ticaret', reportType: 'Öz Sermaye Tespit Raporu', period: '2026/Mayıs', status: 'İmal Edildi', confidenceScore: 98, missingEvidences: 0 },
];

export function YmmCertificationPage() {
  const [selectedCase] = useState<CertificationCase>(SAMPLE_DATA[0]);

  const getStatusBadge = (status: CertificationCase['status']) => {
    switch (status) {
      case 'Taslak': return <Badge className="bg-slate-100 text-slate-700 border-none font-bold text-[10px] gap-1 uppercase tracking-wider"><Clock className="w-3 h-3" /> TASLAK</Badge>;
      case 'İncelemede': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] gap-1 uppercase tracking-wider"><ShieldCheck className="w-3 h-3" /> İNCELEMEDE</Badge>;
      case 'İmal Edildi': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] gap-1 uppercase tracking-wider"><UserCheck className="w-3 h-3" /> İMAL EDİLDİ</Badge>;
      case 'Teslim Edildi': return <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold text-[10px] gap-1 uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> TESLİM EDİLDİ</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-600">
             <FolderLock className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">YMM Tasdik Kontrolü</h2>
             <p className="text-[13px] text-slate-500 font-medium">Yeminli Mali Müşavir tam tasdik ve iade raporu hazırlık süreçleri</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <Binary className="w-4 h-4" /> KARŞIT İNCELEME
          </Button>
          <Button className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            TASDİK RAPORU OLUŞTUR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatItem label="Aktif Dosyalar" value="24" color="blue" />
         <StatItem label="Eksik Belgeli" value="15" color="amber" />
         <StatItem label="Tasdik Edilebilir" value="8" color="emerald" />
         <StatItem label="Geciken Raporlar" value="1" color="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 text-left">
          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
             <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800">Tasdik Hazırlık Listesi</CardTitle>
                <div className="flex items-center gap-2">
                   <div className="relative w-48">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Rapor ara..." 
                        className="w-full pl-8 pr-3 h-8 text-[11px] border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                   </div>
                   <Button variant="outline" size="sm" className="h-8 text-[11px] font-black uppercase"><Filter className="w-3.5 h-3.5 mr-1" /> FİLTRE</Button>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                   {SAMPLE_DATA.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-slate-50 transition-all group">
                         <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1">
                               <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.period}</div>
                               <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{item.firmName}</h3>
                               <p className="text-[12px] text-slate-500 font-bold uppercase">{item.reportType}</p>
                            </div>
                            {getStatusBadge(item.status)}
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0">
                                     <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black text-slate-400 uppercase">Karşı Karşıt İnceleme</span>
                                     <span className="text-[11px] font-bold text-slate-700">Tamamlandı (%100)</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shrink-0">
                                     <AlertTriangle className={`w-4 h-4 ${item.missingEvidences > 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black text-slate-400 uppercase">Eksik Kanıt / Belge</span>
                                     <span className="text-[11px] font-bold text-slate-700">{item.missingEvidences} Adet Bekleniyor</span>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-3">
                               <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Tasdik Güvence Skoru</span>
                                  <span className={`text-[13px] font-black ${item.confidenceScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>%{item.confidenceScore}</span>
                               </div>
                               <Progress value={item.confidenceScore} className={`h-2 ${item.confidenceScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                               <div className="flex items-center gap-2 pt-3">
                                  <Button variant="ghost" size="sm" className="h-8 text-[11px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 gap-1.5"><Eye className="w-3.5 h-3.5" /> DOSYAYI AÇ</Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-[11px] font-black uppercase text-slate-400 hover:text-blue-600 hover:bg-blue-50 gap-1.5"><Download className="w-3.5 h-3.5" /> TASLAK İNDİR</Button>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-6 text-left">
           <Card className="shadow-sm border-slate-200 bg-white">
              <CardHeader className="py-4 border-b border-slate-50">
                 <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-800">YMM Onay Akışı</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                 <div className="relative pl-6 border-l-2 border-slate-100 flex flex-col gap-8">
                    <div className="relative">
                       <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-1 ring-slate-100"></div>
                       <h5 className="text-[12px] font-black text-slate-800 uppercase leading-none mb-1">Mali Müşavir Kontrolü</h5>
                       <p className="text-[10px] font-bold text-slate-400">12.05.2026 - İbrahim Ç. Onayladı</p>
                    </div>
                    <div className="relative">
                       <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm ring-1 ring-slate-100"></div>
                       <h5 className="text-[12px] font-black text-slate-800 uppercase leading-none mb-1">YMM Denetim Ekibi</h5>
                       <p className="text-[10px] font-bold text-blue-500">Devam Ediyor - Kanıt Merkezi Teyidi</p>
                    </div>
                    <div className="relative">
                       <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-sm ring-1 ring-slate-100"></div>
                       <h5 className="text-[12px] font-black text-slate-300 uppercase leading-none mb-1">YMM Nihai İmza</h5>
                       <p className="text-[10px] font-bold text-slate-300 italic">Rapor İmalatı Bekleniyor</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200 bg-indigo-900 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ScrollText className="w-16 h-16" />
              </div>
              <h4 className="text-[13px] font-black uppercase tracking-widest text-indigo-400 mb-4">Tasdik Şartı Uyarısı</h4>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mb-4 italic">
                 "KDV iadesi raporlarında karşıt inceleme teyit oranı %80'in altında kalan firmalar için iade süreci durdurulur."
              </p>
              <Button variant="outline" className="w-full h-10 border-indigo-700 bg-indigo-800/50 text-white font-bold text-[10px] uppercase">MEVZUAT DETAYI</Button>
           </Card>

           <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm text-left">
              <div className="flex items-start gap-4 text-left">
                 <Binary className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-[12px] font-black text-slate-800 uppercase mb-1">Karşıt İnceleme Robotu</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                       Sistem, alt tedarikçilerin GİB üzerindeki aktiflik durumlarını ve e-Belge kayıtlarını otomatik olarak sorgular.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

       {/* Final Safety Note */}
       <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6">
          <div className="flex items-start gap-4">
             <div className="shrink-0 mt-1">
                <ShieldAlert className="w-5 h-5 text-slate-400" />
             </div>
             <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed text-left">
                   YMM Tasdik Kontrolü modülü; 3568 Sayılı Kanun ve ilgili Tasdik Yönetmelikleri çerçevesinde rapor hazırlık sürecine dijital asistanlık yapmaktadır. Sistem tarafından hesaplanan "Güvence Skoru", Kanıt Merkezi'ndeki belgelerin tamlığına ve mizan-fatura uyumuna dayanmaktadır. Nihai tasdik raporunun sorumluluğu tamamen raporu imzalayan Yeminli Mali Müşavir'e aittir. Karşıt inceleme tutanaklarının imzalı asılları fiziksel arşivde veya e-İmza ile doğrulanmış olarak saklanmalıdır.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string, value: string, color: 'blue' | 'amber' | 'emerald' | 'rose' }) {
  const colorMap = {
     blue: "text-blue-600",
     amber: "text-amber-600",
     emerald: "text-emerald-600",
     rose: "text-rose-600"
  };

  return (
    <Card className="shadow-sm border-slate-200 hover:border-slate-300 transition-all">
       <CardContent className="p-4 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <h4 className={`text-2xl font-black ${colorMap[color]}`}>{value}</h4>
       </CardContent>
    </Card>
  );
}
