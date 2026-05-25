import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileSearch, ShieldAlert, Clock, FolderOpen, 
  Plus, CheckCircle2, AlertTriangle, Scale,
  Eye, FileText, Download, MoreVertical,
  Calendar, Users, ClipboardList
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AuditFile {
  id: string;
  firmName: string;
  inspector: string;
  startDate: string;
  type: 'Tam İnceleme' | 'Sınırlı İnceleme' | 'KDV İadesi';
  status: 'Evrak Bekliyor' | 'Tutanak Aşamasında' | 'Tamamlandı' | 'Rapor Bekliyor';
  riskScore: number;
  documentsCount: number;
}

const AUDIT_FILES: AuditFile[] = [
  { id: '1', firmName: 'ABC İnşaat Ltd. Şti.', inspector: 'Vergi Müfettişi Selin Y.', startDate: '12.04.2026', type: 'Tam İnceleme', status: 'Evrak Bekliyor', riskScore: 85, documentsCount: 24 },
  { id: '2', firmName: 'Gama Medikal A.Ş.', inspector: 'Vergi Müfettişi Murat K.', startDate: '05.05.2026', type: 'KDV İadesi', status: 'Tutanak Aşamasında', riskScore: 20, documentsCount: 156 },
  { id: '3', firmName: 'Zeta Makine Ticaret', inspector: 'Müfettiş Yrd. Can B.', startDate: '10.05.2026', type: 'Sınırlı İnceleme', status: 'Rapor Bekliyor', riskScore: 45, documentsCount: 12 },
];

export function TaxAuditFilePage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const getStatusBadge = (status: AuditFile['status']) => {
    switch (status) {
      case 'Evrak Bekliyor': return <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] gap-1"><Clock className="w-3 h-3" /> EVRAK BEKLEYEN</Badge>;
      case 'Tutanak Aşamasında': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px] gap-1"><FileText className="w-3 h-3" /> TUTANAK AŞAMASI</Badge>;
      case 'Tamamlandı': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] gap-1"><CheckCircle2 className="w-3 h-3" /> TAMAMLANDI</Badge>;
      case 'Rapor Bekliyor': return <Badge className="bg-purple-100 text-purple-700 border-none font-bold text-[10px] gap-1"><FolderOpen className="w-3 h-3" /> RAPOR BEKLENİYOR</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-md text-white">
             <FileSearch className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Vergi İnceleme Dosyaları</h2>
             <p className="text-[13px] text-slate-500 font-medium">Müfettiş kontrolleri, tutanaklar ve inceleme süreci yönetimi</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <Download className="w-4 h-4" /> ARŞİVİ İNDİR
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-md gap-2">
            <Plus className="w-4 h-4" /> YENİ İNCELEME DOSYASI
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="shadow-sm border-slate-200 overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
               <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800">Aktif Vergi İncelemeleri</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                  {AUDIT_FILES.map((file) => (
                    <div 
                      key={file.id} 
                      className={`p-5 hover:bg-slate-50 transition-all cursor-pointer group ${selectedFile === file.id ? 'bg-blue-50/40 ring-1 ring-inset ring-blue-100' : ''}`}
                      onClick={() => setSelectedFile(file.id)}
                    >
                       <div className="flex items-start justify-between mb-2">
                          <div className="space-y-1">
                             <div className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{file.firmName}</div>
                             <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                                <Users className="w-3 h-3" /> {file.inspector}
                                <span className="before:content-['•'] before:mr-2">{file.type}</span>
                             </div>
                          </div>
                          {getStatusBadge(file.status)}
                       </div>
                       <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-6">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Başlangıç</span>
                                <span className="text-xs font-bold text-slate-700">{file.startDate}</span>
                             </div>
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belge Sayısı</span>
                                <span className="text-xs font-bold text-slate-700">{file.documentsCount} Adet</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="text-right mr-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Risk Skoru</span>
                                <span className={`text-sm font-black ${file.riskScore > 70 ? 'text-rose-600' : 'text-emerald-600'}`}>%{file.riskScore}</span>
                             </div>
                             <Button variant="ghost" size="sm" className="h-8 w-8"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>

          {selectedFile && (
            <Card className="shadow-lg border-blue-200 bg-white overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
               <CardHeader className="bg-slate-900 text-white py-4 px-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-blue-400" />
                        <CardTitle className="text-sm font-black uppercase tracking-widest">İnceleme Dosyası Detayları</CardTitle>
                     </div>
                     <Badge className="bg-blue-500/20 text-blue-100 border-none font-bold text-[10px]">DOSYA NO: 2026/A-412</Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-3 flex items-center gap-2">
                             <ClipboardList className="w-3.5 h-3.5" /> İstenen Belgeler Portalı
                           </h4>
                           <div className="space-y-2">
                              {[
                                { name: '2025 Yılı Yasal Defterler (e-Berat)', status: true },
                                { name: 'Satış Faturaları ve İrsaliyeler', status: true },
                                { name: 'İhracat GÇB ve Banka Dekontları', status: false },
                                { name: 'Ortaklar Cari Hesabı Adat Tablosu', status: false },
                              ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                                   <span className="text-xs font-bold text-slate-700">{doc.name}</span>
                                   {doc.status ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                           <h4 className="text-[11px] font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Scale className="w-3.5 h-3.5" /> Savunma Stratejisi
                           </h4>
                           <p className="text-[11px] text-blue-900 font-bold leading-relaxed mb-4">
                              "Müfettişin 'Örtülü Kazanç' şüphesi olan 131 nolu hesaptaki adatlandırma faiz oranları, güncel TCMB faiz oranları ve emsal faizlerle karşılaştırmalı olarak dosyaya eklenmelidir."
                           </p>
                           <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black shadow-none h-9">
                              SAVUNMA DİLEKÇESİ HAZIRLA
                           </Button>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-5 border border-rose-100">
                           <div className="flex items-center gap-2 mb-3">
                              <ShieldAlert className="w-4 h-4 text-rose-600" />
                              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest">Kritik Risk Uyarısı</h4>
                           </div>
                           <p className="text-[11px] text-rose-900 font-bold leading-relaxed">
                              "Stok noksanlığı ile ilgili teslim belgesi bulunamayan kalemlerde KDV ziyaı riski %90 seviyesindedir. Uzlaşma yoluna gidilmesi önerilir."
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
            <CardHeader className="bg-amber-600 text-white py-4 border-b border-amber-700">
               <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 <Calendar className="w-4 h-4" /> İnceleme Takvimi
               </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
               <div className="space-y-4">
                  <div className="border-l-2 border-amber-400 pl-4 py-1">
                     <p className="text-xs font-black text-slate-800">Defte-Belge İbraz Süresi</p>
                     <p className="text-[11px] text-slate-500 font-bold">28.05.2026 (Son 4 Gün)</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4 py-1">
                     <p className="text-xs font-black text-slate-800">Tutanak İmza Randevusu</p>
                     <p className="text-[11px] text-slate-500 font-bold">02.06.2026 - Saat 10:30</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4 py-1">
                     <p className="text-xs font-black text-slate-800">Ek Bilgi Sunum Süresi</p>
                     <p className="text-[11px] text-slate-500 font-bold">05.06.2026</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-slate-50 p-6 flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mb-4">
                <Users className="w-6 h-6 text-slate-400" />
             </div>
             <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2">VDK Mükellef Portalı</h4>
             <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-4">
                Vergi Denetim Kurulu sistemine doğrudan bağlanarak dosyaları eşleştirebilirsiniz.
             </p>
             <Button variant="outline" className="w-full h-10 border-slate-300 text-slate-700 font-bold text-[10px] uppercase">GİB PORTALA GİT</Button>
          </Card>
        </div>
      </div>

      {/* Final Safety Note */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
           <div className="shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 text-slate-400" />
           </div>
           <div>
              <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">Nihai Kontrol Notu</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                 Vergi inceleme süreçleri, VUK 134-141. maddeleri arasındaki usul ve esaslara tabidir. İstenilen defter ve belgelerin yasal süresi (genellikle 15 gün) içerisinde ibraz edilmemesi, re'sen takdir nedenidir ve vergi ziyaı cezası doğurur. Tutanak imzalamadan önce mutlaka "Tutanak Analiz" modülü ile olası eleştirilerin vergi yükü hesaplanmalıdır. İmzalanan tutanaklar sonrasında yapılabilecek savunmaların etkisi sınırlı olabilir.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
