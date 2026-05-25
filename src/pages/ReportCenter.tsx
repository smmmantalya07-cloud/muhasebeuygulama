import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Plus, 
  History, 
  Eye, 
  Download, 
  FileEdit, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Info,
  Archive,
  MoreVertical,
  Printer,
  FileCode,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

type ReportStatus = 'Taslak' | 'İncelemede' | 'Revize Edilecek' | 'Mali Müşavir Tarafından Onaylandı' | 'Müşteriye Sunulabilir' | 'Arşivlendi';

interface Report {
  id: string;
  name: string;
  company: string;
  type: string;
  riskLevel: 'Düşük' | 'İncelenmeli' | 'Yüksek' | 'Kritik';
  date: string;
  status: ReportStatus;
}

export function ReportCenterPage() {
  const reportTypes = [
    'Ön Denetim Raporu',
    'Üçlü Denetim Sonuç Raporu',
    'Risk Analiz Raporu',
    'İzaha Davet Cevap Taslağı',
    'Vergi İnceleme Savunma Taslağı',
    'KDV Kontrol Raporu',
    'Sahte Belge Risk Raporu',
    'Kasa Fazlası Risk Raporu',
    'Ortaklar Cari Hesap Risk Raporu',
    'Banka Hareketleri Analiz Raporu',
    'Beyanname-Defter Uyum Raporu',
    'YMM Tasdik Kontrol Raporu',
    'Bağımsız Denetim Bulguları Raporu',
    'İç Kontrol Zafiyeti Raporu',
    'Firma Risk Skoru Raporu',
    'Yönetici Özeti',
    'Aylık Mali Risk Raporu',
    'Müşteri Bilgilendirme Notu',
    'Mali Müşavir Nihai Görüş Taslağı'
  ];

  const recentReportsList: Report[] = [
    { id: '1', name: 'ABC İnşaat Ön Denetim Raporu', company: 'ABC İnşaat Ltd.', type: 'Ön Denetim Raporu', riskLevel: 'Yüksek', date: '02.05.2026', status: 'Mali Müşavir Tarafından Onaylandı' },
    { id: '2', name: 'KDV Risk Analizi - Mayıs', company: 'Demir Lojistik A.Ş.', type: 'Risk Analiz Raporu', riskLevel: 'İncelenmeli', date: '01.05.2026', status: 'İncelemede' },
    { id: '3', name: 'İzaha Davet Cevap Taslağı', company: 'Gama Medikal', type: 'İzaha Davet Cevap Taslağı', riskLevel: 'Kritik', date: '30.04.2026', status: 'Revize Edilecek' },
    { id: '4', name: 'Üçlü Denetim Sonuç Raporu', company: 'Polat Teknoloji', type: 'Üçlü Denetim Sonuç Raporu', riskLevel: 'Yüksek', date: '28.04.2026', status: 'Taslak' },
    { id: '5', name: 'Kasa Fazlası Risk Raporu', company: 'Zeta Makine', type: 'Kasa Fazlası Risk Raporu', riskLevel: 'Kritik', date: '25.04.2026', status: 'Arşivlendi' },
  ];

  const [reportType, setReportType] = useState('Ön Denetim Raporu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [reportsList, setReportsList] = useState<Report[]>(recentReportsList);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    toast.info('Rapor taslağı oluşturuluyor...');
    
    setTimeout(() => {
      const newContent = {
        title: reportType,
        company: 'Polat Teknoloji Ltd. Şti.',
        date: '03.05.2026',
        riskScore: 78,
        findings: [
          'Kasa bakiyesinde işletme hacmiyle uyumsuz artış tespiti.',
          'İlişkili taraf transferlerinde emsal bedeli belirsizliği.',
          'KDV devrinin 6 aydır sürekli artış eğiliminde olması.'
        ],
        missingDocs: [
          'Son 3 aylık banka ekstreleri (İmzalı/Mühürlü)',
          'Stok sayım tutanağı',
          'Ortaklar cari hesabı adat tablosu'
        ]
      };
      setPreviewContent(newContent);
      setEditedContent(newContent);
      setIsGenerating(false);
      toast.success('Rapor taslağı başarıyla oluşturuldu.');
    }, 1500);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedContent({ ...previewContent });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    setPreviewContent({ ...editedContent });
    setIsEditing(false);
    toast.success('Değişiklikler kaydedildi.');
  };

  const handleArchiveReport = () => {
    const newReport: Report = {
      id: (reportsList.length + 1).toString(),
      name: `${previewContent.company} ${previewContent.title}`,
      company: previewContent.company,
      type: previewContent.title,
      riskLevel: 'Yüksek',
      date: '03.05.2026',
      status: 'Arşivlendi'
    };
    setReportsList([newReport, ...reportsList]);
    setPreviewContent(null);
    setIsEditing(false);
    toast.success('Rapor başarıyla onaylandı ve arşive eklendi.');
  };

  const handleCancelPreview = () => {
    setPreviewContent(null);
    setIsEditing(false);
    toast.info('Rapor taslağı iptal edildi.');
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'Taslak': return 'bg-slate-100 text-slate-700';
      case 'İncelemede': return 'bg-blue-100 text-blue-700';
      case 'Revize Edilecek': return 'bg-amber-100 text-amber-700';
      case 'Mali Müşavir Tarafından Onaylandı': return 'bg-emerald-100 text-emerald-700';
      case 'Müşteriye Sunulabilir': return 'bg-indigo-100 text-indigo-700';
      case 'Arşivlendi': return 'bg-slate-200 text-slate-500';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Kritik': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Yüksek': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'İncelenmeli': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Rapor Merkezi
          </h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-tight font-medium">
            Profesyonel mali müşavirlik rapor taslakları ve denetim çıktıları oluşturun.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Taslak Raporlar', value: '8 Rapor', icon: <FileEdit className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Onay Bekleyenler', value: '3 Rapor', icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Revize Edilecekler', value: '2 Rapor', icon: <History className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Onaylanan Raporlar', value: '12 Rapor', icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((card, i) => (
          <Card key={i} className="shadow-sm border-slate-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <p className="text-lg font-bold text-slate-800">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Report Config Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Yeni Rapor Oluştur
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Rapor Türü Seçin</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  {reportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Firma / Mükellef</label>
                <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option>Polat Teknoloji Ltd. Şti.</option>
                  <option>ABC İnşaat Ltd. Şti.</option>
                  <option>Gama Medikal A.Ş.</option>
                  <option>Demir Lojistik A.Ş.</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Rapor Dili</label>
                    <select className="w-full h-9 px-2 rounded border border-slate-200 bg-white text-xs">
                      <option>Teknik / Mesleki</option>
                      <option>Müşteri Bilgilendirme</option>
                      <option>İdareye Sunulacak</option>
                      <option>Yönetici Özeti</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Detay Seviyesi</label>
                    <select className="w-full h-9 px-2 rounded border border-slate-200 bg-white text-xs">
                      <option>Standart Rapor</option>
                      <option>Kısa Özet</option>
                      <option>Detaylı Analiz</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block border-b border-slate-100 pb-2">Rapor İçeriği</label>
                <div className="grid grid-cols-2 gap-y-2">
                  {[
                    'Mevzuat Dayanağı',
                    'Eksik Belge Listesi',
                    'Risk Skoru',
                    'Üçlü Denetim Sonucu',
                    'Mali Müşavir Notu'
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600" />
                      <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-600 transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-3 mt-4">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-[11px] font-bold text-blue-800">Güvenli Mod Aktif</p>
                   <p className="text-[10px] text-blue-600 font-medium">Hassas veri kontrolü ve maskeleme önerileri uygulanacaktır.</p>
                </div>
              </div>

              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-xs h-11 shadow-md shadow-blue-100"
              >
                {isGenerating ? <><Clock className="w-4 h-4 mr-2 animate-spin" /> HAZIRLANIYOR...</> : <><Plus className="w-4 h-4 mr-2" /> RAPOR OLUŞTUR</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-7">
          <Card className="shadow-sm border-slate-200 h-full flex flex-col bg-slate-50/30">
            <CardHeader className="pb-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Rapor Önizleme</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-tighter">İndirmeden önce taslağı inceleyin</CardDescription>
                </div>
                {previewContent && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all uppercase tracking-widest"
                          onClick={handleSaveEdit}
                        >
                           <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> KAYDET
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest text-slate-500"
                          onClick={() => setIsEditing(false)}
                        >
                           VAZGEÇ
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest text-blue-600"
                          onClick={() => setIsEditing(true)}
                        >
                           <FileEdit className="w-3.5 h-3.5 mr-1" /> DÜZENLE
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest text-slate-600"
                          onClick={() => window.print()}
                        >
                           <Printer className="w-3.5 h-3.5 mr-1" /> YAZDIR
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
              {previewContent ? (
                <div id="report-printable-area" className="bg-white border border-slate-200 shadow-xl rounded-lg p-10 max-w-2xl mx-auto flex-1 h-full font-serif overflow-auto">
                   <div className="text-center mb-10 pb-6 border-b-2 border-slate-900/10">
                      {isEditing ? (
                        <input 
                          className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 w-full text-center border-b border-blue-200 focus:outline-none focus:border-blue-500"
                          value={editedContent.title}
                          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
                        />
                      ) : (
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">{previewContent.title}</h2>
                      )}
                      
                      {isEditing ? (
                        <input 
                          className="text-sm font-bold text-slate-600 uppercase tracking-widest w-full text-center border-b border-blue-200 focus:outline-none focus:border-blue-500"
                          value={editedContent.company}
                          onChange={(e) => setEditedContent({...editedContent, company: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">{previewContent.company}</p>
                      )}
                      
                      <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Tarih: {previewContent.date}</span>
                        <span>•</span>
                        <span>Ref No: {Math.floor(Math.random() * 100000)}</span>
                      </div>
                   </div>

                   <div className="space-y-8">
                     <section>
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 underline decoration-blue-500/30 underline-offset-4">1. ANALİZ KAPSAMI</h3>
                       <p className="text-[13px] text-slate-600 leading-relaxed">
                         Bu rapor, söz konusu firmanın {new Date().getFullYear()} yılı mali kayıtları, beyannameleri ve ilgili belgelerinin Üçlü Denetim (Vergi Müfettişi, YMM, Bağımsız Denetçi) perspektifiyle incelenmesi sonucu oluşturulmuştur.
                       </p>
                     </section>

                     <section>
                        <div className="flex items-center justify-between mb-3">
                           <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider underline decoration-blue-500/30 underline-offset-4">2. RİSK DEĞERLENDİRMESİ</h3>
                           <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded border border-orange-200 uppercase tracking-widest">Risk Skoru: {previewContent.riskScore}/100</span>
                        </div>
                        <ul className="space-y-2">
                           {(isEditing ? editedContent : previewContent).findings.map((finding: string, idx: number) => (
                             <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-700 font-medium">
                               <div className="w-4 h-4 bg-orange-100 text-orange-600 rounded flex items-center justify-center shrink-0 text-[10px] mt-0.5">!</div>
                               {isEditing ? (
                                 <input 
                                   className="w-full bg-transparent border-b border-blue-100 focus:outline-none focus:border-blue-400"
                                   value={finding}
                                   onChange={(e) => {
                                     const newFindings = [...editedContent.findings];
                                     newFindings[idx] = e.target.value;
                                     setEditedContent({...editedContent, findings: newFindings});
                                   }}
                                 />
                               ) : finding}
                             </li>
                           ))}
                        </ul>
                     </section>

                     <section>
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 underline decoration-blue-500/30 underline-offset-4">3. EKSİK BELGE VE KANITLAR</h3>
                       <ul className="space-y-2">
                          {(isEditing ? editedContent : previewContent).missingDocs.map((doc: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 text-[13px] text-slate-600 italic">
                               <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
                               {isEditing ? (
                                 <input 
                                   className="w-full bg-transparent border-b border-blue-100 focus:outline-none focus:border-blue-400"
                                   value={doc}
                                   onChange={(e) => {
                                     const newDocs = [...editedContent.missingDocs];
                                     newDocs[idx] = e.target.value;
                                     setEditedContent({...editedContent, missingDocs: newDocs});
                                   }}
                                 />
                               ) : doc}
                            </li>
                          ))}
                       </ul>
                     </section>

                     <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mali Müşavir Nihai Onayı Bekleniyor</p>
                        <div className="w-32 h-1 bg-slate-100 mx-auto rounded-full mb-10"></div>
                        
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded text-left">
                           <p className="text-[10px] text-slate-500 italic leading-relaxed">
                            <span className="font-bold text-slate-700 not-italic uppercase tracking-tight block mb-1">Onay Notu & Sorumluluk Reddi:</span>
                            Bu rapor yapay zekâ destekli ön analiz ve taslak çalışma niteliğindedir. Nihai mali, vergisel, hukuki ve denetim görüşü yerine geçmez. Raporun mesleki sorumluluk doğuracak şekilde kullanılabilmesi için yetkili mali müşavir tarafından incelenmesi, düzeltilmesi ve onaylanması gerekir.
                           </p>
                        </div>
                     </div>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl m-10">
                   <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Rapor Önizleme Hazır Değil</h3>
                   <p className="text-xs text-slate-400 max-w-xs mt-2 font-medium">
                     Soldaki formu doldurarak bir rapor taslağı oluşturun. Önizleme bu alanda görünecektir.
                   </p>
                </div>
              )}
            </CardContent>
            {previewContent && (
              <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <Button 
                  variant="ghost" 
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
                  onClick={handleCancelPreview}
                >
                  Vazgeç
                </Button>
                <Button 
                  variant="outline" 
                  className="text-xs font-bold text-blue-600 border-blue-100 hover:bg-blue-50 transition-all uppercase tracking-widest h-9"
                  onClick={() => {
                    toast.success('Rapor PDF olarak hazırlanıyor...');
                    setTimeout(() => {
                      toast.success('PDF indirme tamamlandı.');
                    }, 1500);
                  }}
                >
                  <Download className="w-3.5 h-3.5 mr-2" /> PDF İNDİR
                </Button>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-md shadow-emerald-50 transition-all uppercase tracking-widest"
                  onClick={handleArchiveReport}
                >
                  <FileCheck className="w-4 h-4 mr-2" /> ONAYLA VE ARŞİVLE
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Reports List */}
        <div className="lg:col-span-12">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-800">Son Raporlar</CardTitle>
                <CardDescription className="text-xs">Oluşturulan ve üzerinde çalışılan taslaklar</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input placeholder="Rapor ara..." className="pl-9 h-8 w-48 text-[11px] bg-slate-50 border-slate-200 focus:bg-white transition-all" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold text-slate-600 border-slate-200 uppercase tracking-widest">
                   <Filter className="w-3 h-3 mr-2" /> FİLTRELE
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Rapor Adı</th>
                    <th className="px-6 py-3">Firma</th>
                    <th className="px-6 py-3">Rapor Türü</th>
                    <th className="px-6 py-3">Risk</th>
                    <th className="px-6 py-3">Tarih</th>
                    <th className="px-6 py-3">Durum</th>
                    <th className="px-6 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reportsList.map(report => (
                    <tr key={report.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <FileCode className="w-5 h-5 text-blue-500 shrink-0" />
                           <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{report.company}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{report.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRiskBadge(report.riskLevel)}`}>
                          {report.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] text-slate-400 font-medium">{report.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            onClick={() => {
                              setPreviewContent({
                                title: report.type,
                                company: report.company,
                                date: report.date,
                                riskScore: report.riskLevel === 'Kritik' ? 95 : (report.riskLevel === 'Yüksek' ? 78 : 45),
                                findings: ['Önceki rapor bulgusu 1', 'Önceki rapor bulgusu 2'],
                                missingDocs: ['Önceki rapor belgesi 1']
                              });
                              setEditedContent({
                                title: report.type,
                                company: report.company,
                                date: report.date,
                                riskScore: report.riskLevel === 'Kritik' ? 95 : (report.riskLevel === 'Yüksek' ? 78 : 45),
                                findings: ['Önceki rapor bulgusu 1', 'Önceki rapor bulgusu 2'],
                                missingDocs: ['Önceki rapor belgesi 1']
                              });
                              toast.info(`${report.name} önizlemeye yüklendi.`);
                            }}
                          >
                             <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                            onClick={() => {
                              toast.success(`${report.name} indiriliyor...`);
                            }}
                          >
                             <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            onClick={() => {
                              const newList = reportsList.map(r => r.id === report.id ? {...r, status: 'Arşivlendi' as ReportStatus} : r);
                              setReportsList(newList);
                              toast.success(`${report.name} arşivlendi.`);
                            }}
                          >
                             <Archive className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <div className="p-4 border-t border-slate-50 flex items-center justify-center">
               <Button variant="ghost" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-50">TÜMÜNÜ GÖRÜNTÜLE</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Security Info Card */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">Veri Güvenliği ve Raporlama Standartları</h4>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
              Rapor oluşturulmadan önce TCKN, VKN, IBAN, adres, personel bilgisi ve müşteri özel bilgileri için veri maskeleme kontrolü yapılması önerilir. Oluşturulan her rapor, mesleki bağımsızlık ve etik kurallar çerçevesinde bir "ön analiz taslağı" olarak kabul edilmelidir.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
