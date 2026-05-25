import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle2, Clock, Info, Search, Filter, ChevronRight, AlertCircle, Eye, MessageSquare, ClipboardCheck, ArrowUpRight, Building2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function RiskReportsPage() {
  const [filterCompany, setFilterCompany] = useState('');
  const [filterLevel, setFilterLevel] = useState('Hepsi');

  const riskCategories = [
    { category: 'Sahte Belge Riski', score: 85, level: 'Kritik', companies: 2, lastUpdate: '10.05.2026' },
    { category: 'Yanıltıcı Belge Riski', score: 65, level: 'Yüksek', companies: 4, lastUpdate: '09.05.2026' },
    { category: 'KDV İndirim Riski', score: 45, level: 'İncelenmeli', companies: 12, lastUpdate: '11.05.2026' },
    { category: 'KDV İade Riski', score: 20, level: 'Düşük', companies: 5, lastUpdate: '12.05.2026' },
    { category: 'Kasa Fazlası Riski', score: 92, level: 'Kritik', companies: 3, lastUpdate: '08.05.2026' },
    { category: 'Ortaklar Cari Hesabı Riski', score: 78, level: 'Yüksek', companies: 6, lastUpdate: '07.05.2026' },
    { category: 'Banka-Kasa Uyumsuzluğu', score: 35, level: 'İncelenmeli', companies: 8, lastUpdate: '01.05.2026' },
    { category: 'Beyanname-Defter Uyumsuzluğu', score: 15, level: 'Düşük', companies: 20, lastUpdate: '12.05.2026' },
    { category: 'Bağlantısız Gider Riski', score: 55, level: 'İncelenmeli', companies: 15, lastUpdate: '10.05.2026' },
    { category: 'Ticari Teamüle Aykırı İşlem Riski', score: 70, level: 'Yüksek', companies: 2, lastUpdate: '05.05.2026' },
    { category: 'Örtülü Kazanç Riski', score: 40, level: 'İncelenmeli', companies: 4, lastUpdate: '04.05.2026' },
    { category: 'Transfer Fiyatlandırması Riski', score: 25, level: 'Düşük', companies: 1, lastUpdate: '03.05.2026' },
    { category: 'Stok Farkı Riski', score: 60, level: 'Yüksek', companies: 7, lastUpdate: '02.05.2026' },
    { category: 'Bordro ve SGK Uyumsuzluğu', score: 10, level: 'Düşük', companies: 25, lastUpdate: '12.05.2026' },
    { category: 'Vergi İncelemesi Riski', score: 88, level: 'Kritik', companies: 3, lastUpdate: '11.05.2026' },
    { category: 'İzaha Davet Riski', score: 75, level: 'Yüksek', companies: 5, lastUpdate: '10.05.2026' },
    { category: 'İç Kontrol Zafiyeti', score: 50, level: 'İncelenmeli', companies: 10, lastUpdate: '09.05.2026' },
    { category: 'Hile Riski', score: 30, level: 'İncelenmeli', companies: 2, lastUpdate: '08.05.2026' },
    { category: 'Kanıt Yetersizliği Riski', score: 68, level: 'Yüksek', companies: 9, lastUpdate: '11.05.2026' },
  ];

  const companyRisks = [
    { name: 'Polat Teknoloji Ltd.', score: 85, level: 'Kritik', criticalRisk: 'Sahte belge emaresi', missingDocs: 3, pendingAction: 'Savunma Hazırla', lastSync: '02.05.2026' },
    { name: 'Demir Lojistik A.Ş.', score: 65, level: 'Yüksek', criticalRisk: 'KDV devrinde olağandışı artış', missingDocs: 5, pendingAction: 'Belge İste', lastSync: '01.05.2026' },
    { name: 'Gama Medikal Sistemleri', score: 45, level: 'İncelenmeli', criticalRisk: 'Kasa fazlası', missingDocs: 2, pendingAction: 'Mükellef Sorusu', lastSync: '30.04.2026' },
    { name: 'Zeta Makine Sanayi', score: 78, level: 'Yüksek', criticalRisk: 'Ortaklar hesabı adat riski', missingDocs: 4, pendingAction: 'Adat Hesapla', lastSync: '28.04.2026' },
    { name: 'Alfa Tekstil İç ve Dış Tic.', score: 35, level: 'İncelenmeli', criticalRisk: 'Banka hareketi açıklama eksikliği', missingDocs: 8, pendingAction: 'Ekstre Mutabakatı', lastSync: '25.04.2026' },
    { name: 'Delta Gıda ve Tarım Ür.', score: 20, level: 'Düşük', criticalRisk: 'Kanıt yetersizliği (Hafif)', missingDocs: 1, pendingAction: 'Arşivle', lastSync: '20.04.2026' },
  ];

  const urgentAlerts = [
    { title: 'Kritik Vergi Riski', company: 'Polat Teknoloji Ltd.', level: 'Kritik', deadline: '24 Saat', action: 'Savunma Hazırla', status: 'Açık' },
    { title: 'Eksik Belge Uyarısı', company: 'Demir Lojistik A.Ş.', level: 'Yüksek', deadline: '3 Gün', action: 'Belge İste', status: 'İncelemede' },
    { title: 'Süresi Yaklaşan İzaha Davet', company: 'Gama Medikal', level: 'Yüksek', deadline: '2 Gün', action: 'Dilekçe Yaz', status: 'Açık' },
    { title: 'Beyanname Son Günü', company: 'Tüm Şirketler', level: 'Bilgilendirme', deadline: 'Bugün', action: 'Kontrol Et', status: 'Açık' },
    { title: 'KDV Uyumsuzluğu', company: 'Alfa Tekstil', level: 'İncelenmeli', deadline: '5 Gün', action: 'Düzeltme Kaydı', status: 'Ertelendi' },
    { title: 'Kasa Fazlası Uyarısı', company: 'Zeta Makine', level: 'Yüksek', deadline: '4 Gün', action: 'Adat Çalışması', status: 'Tamamlandı' },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Kritik': return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-500' };
      case 'Yüksek': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-500' };
      case 'İncelenmeli': return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500' };
      case 'Düşük': return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500' };
      default: return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500' };
    }
  };

  const statusColors = {
    'Açık': 'bg-rose-100 text-rose-700',
    'İncelemede': 'bg-blue-100 text-blue-700',
    'Tamamlandı': 'bg-emerald-100 text-emerald-700',
    'Ertelendi': 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
            Risk ve Uyarı Merkezi
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Firma bazlı risk skorlarını, kritik bulguları, eksik belgeleri, yaklaşan süreleri ve acil aksiyon gerektiren uyarıları tek merkezde takip edin.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="shadow-sm bg-white" onClick={() => toast.info('Rapor oluşturuluyor...')}>
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Rapor Üret
           </Button>
           <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm" onClick={() => toast.success('Tüm uyarılar güncellendi.')}>
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Hepsini Kontrol Et
           </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Toplam Riskli Firma', value: '12 Firma', icon: <Building2 className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kritik Riskli Dosya', value: '4 Dosya', icon: <AlertCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Eksik Belge Uyarısı', value: '9 Dosya', icon: <MessageSquare className="w-5 h-5" />, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Acil Aksiyon Gerekenler', value: '6 Kayıt', icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((card, i) => (
          <Card key={i} className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-lg font-bold text-slate-800">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Area */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input 
                placeholder="Firma adına göre filtrele..." 
                className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                value={filterCompany}
                onChange={e => setFilterCompany(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {['Hepsi', 'Kritik', 'Yüksek', 'İncelenmeli'].map(level => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    filterLevel === level 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <Button variant="outline" className="text-slate-600 text-xs font-semibold h-9 px-4">
              <Filter className="w-3.5 h-3.5 mr-2" />
              Gelişmiş Filtre
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Categories List */}
        <div className="lg:col-span-12 xl:col-span-8">
          <Card className="shadow-sm border-slate-200 h-full overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Risk Kategorileri</CardTitle>
                  <CardDescription className="text-xs">Sistem genelinde tespit edilen risk alanları</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-bold uppercase tracking-widest">Tümünü Gör</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto flex-1 h-[600px] custom-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 sticky top-0 z-10">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Kategorisi</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Risk Puanı</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Seviyesi</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Firma Sayısı</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Son Güncelleme</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Detay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {riskCategories.map((risk, idx) => {
                    const colors = getLevelColor(risk.level);
                    return (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{risk.category}</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center">
                             <div className="w-12 h-6 bg-slate-100 rounded-full relative overflow-hidden flex items-center justify-center">
                               <div className={`absolute top-0 left-0 bottom-0 ${risk.score > 80 ? 'bg-rose-500' : risk.score > 60 ? 'bg-orange-500' : risk.score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${risk.score}%` }}></div>
                               <span className="relative text-[10px] font-bold text-slate-800 drop-shadow-sm">{risk.score}</span>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}>
                             {risk.level}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="text-sm font-bold text-slate-600">{risk.companies}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs text-slate-400 font-medium">{risk.lastUpdate}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                             <ChevronRight className="w-4 h-4" />
                           </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-12 xl:col-span-4">
           <Card className="shadow-sm border-slate-200 h-full flex flex-col bg-white">
             <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6 shrink-0">
               <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <ClipboardCheck className="w-5 h-5 text-blue-600" />
                 Önerilen Aksiyonlar
               </CardTitle>
               <CardDescription className="text-xs text-slate-500 font-medium">Risk profilini iyileştirmek için yapılması gerekenler</CardDescription>
             </CardHeader>
             <CardContent className="p-0 overflow-auto flex-1 custom-scrollbar h-[600px]">
               <div className="divide-y divide-slate-100">
                 {[
                   { task: 'Banka ekstresi ile muavin hesap mutabakatı yap', focus: 'Alfa Tekstil', priority: 'Orta', time: '2 Gün' },
                   { task: 'Eksik sevk irsaliyelerini talep et', focus: 'Polat Teknoloji', priority: 'Yüksek', time: '24 Saat' },
                   { task: 'KDV indirimi için belge zincirini tamamla', focus: 'Demir Lojistik', priority: 'Kritik', time: '8 Saat' },
                   { task: 'Mükelleften sözleşme aslını iste', focus: 'Gama Medikal', priority: 'Düşük', time: '1 Hafta' },
                   { task: 'Ortaklar cari hesabı için adat hesapla', focus: 'Zeta Makine', priority: 'Kritik', time: '12 Saat' },
                   { task: 'Stok düşüm tutanaklarını tamamla', focus: 'Stok Riskli Firmalar', priority: 'Yüksek', time: '2 Gün' },
                   { task: 'Beyanname ile mizan uyum kontrolü yap', focus: 'Tüm Şirketler', priority: 'Kritik', time: '3 Saat' },
                   { task: 'İzaha davet cevabı için belge klasörü hazırla', focus: 'Gama Medikal', priority: 'Yüksek', time: 'Bugün' },
                   { task: 'Kur farkı kayıtlarını kontrol et', focus: 'Dövizli Firmalar', priority: 'Orta', time: '3 Gün' },
                   { task: 'Amortisman listelerini onayla', focus: 'Demirbaşlı Firmalar', priority: 'Düşük', time: '1 Hafta' }
                 ].map((action, i) => (
                   <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-all cursor-pointer group relative">
                     <div className="flex justify-between items-start mb-1.5">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{action.focus}</span>
                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${action.priority === 'Kritik' ? 'bg-rose-100 text-rose-700' : action.priority === 'Yüksek' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                         {action.priority}
                       </span>
                     </div>
                     <p className="text-[13px] font-semibold text-slate-700 leading-snug group-hover:text-blue-600 transition-colors">{action.task}</p>
                     <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {action.time}
                          </span>
                        </div>
                        <button className="text-[10px] font-bold text-blue-600 hover:underline opacity-0 group-hover:opacity-100 transition-all">Görevi Ata</button>
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
             <div className="p-4 border-t border-slate-100 shrink-0">
               <Button className="w-full bg-blue-600 text-white font-bold h-10 rounded-lg shadow-sm hover:bg-blue-700 transition-all text-xs uppercase tracking-widest">Yeni Görev Oluştur</Button>
             </div>
           </Card>
        </div>

        {/* Company Based Risk Table */}
        <div className="lg:col-span-12">
           <Card className="shadow-sm border-slate-200 overflow-hidden">
             <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6">
                <CardTitle className="text-lg font-bold text-slate-800">Firma Bazlı Risk Durumu</CardTitle>
                <CardDescription className="text-xs">Mükellef portföyündeki firma riskleri ve bekleyen kritik işlemler</CardDescription>
             </CardHeader>
             <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Firma Adı</th>
                      <th className="px-6 py-3">Genel Risk Skoru</th>
                      <th className="px-6 py-3">Risk Seviyesi</th>
                      <th className="px-6 py-3">En Kritik Risk Başlığı</th>
                      <th className="px-6 py-3 text-center">Eksik Belge</th>
                      <th className="px-6 py-3">Bekleyen İşlem</th>
                      <th className="px-6 py-3">Son Analiz</th>
                      <th className="px-6 py-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {companyRisks.map((company, idx) => {
                      const colors = getLevelColor(company.level);
                      return (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-xs shrink-0`}>
                                {company.name.charAt(0)}
                              </div>
                              <span className="text-sm font-bold text-slate-700">{company.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full ${company.score > 80 ? 'bg-rose-500' : company.score > 60 ? 'bg-orange-500' : 'bg-amber-500'}`} style={{ width: `${company.score}%` }}></div>
                               </div>
                               <span className="text-xs font-bold text-slate-600">{company.score}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
                               {company.level}
                             </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-600 italic whitespace-nowrap bg-slate-50 px-2 py-1 rounded border border-slate-100">{company.criticalRisk}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-xs font-bold ${company.missingDocs > 4 ? 'text-rose-600' : 'text-orange-600'}`}>
                              {company.missingDocs} Belge
                            </span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-xs font-bold text-blue-600 underline cursor-pointer">{company.pendingAction}</span>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-[11px] text-slate-400 font-medium">{company.lastSync}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <Button variant="ghost" size="icon" title="Mesaj Yaz" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                 <MessageSquare className="w-4 h-4" />
                               </Button>
                               <Button variant="ghost" size="icon" title="Belge İste" className="h-8 w-8 text-slate-400 hover:text-orange-600 hover:bg-orange-50">
                                 <Download className="w-4 h-4" />
                               </Button>
                               <Button variant="ghost" size="icon" title="Detaylı Analiz" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                 <Eye className="w-4 h-4" />
                               </Button>
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </CardContent>
           </Card>
        </div>

        {/* Urgent Alerts Timeline */}
        <div className="lg:col-span-12">
           <Card className="shadow-sm border-slate-200 overflow-hidden">
             <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  Acil Uyarılar
                </CardTitle>
                <CardDescription className="text-xs font-medium">Müdahale bekleyen ve süresi yaklaşan riskli olaylar</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 divide-x divide-y divide-slate-100">
                  {urgentAlerts.map((alert, idx) => {
                    const colors = getLevelColor(alert.level);
                    return (
                      <div key={idx} className="p-6 hover:bg-slate-50/80 transition-all flex flex-col h-full group">
                         <div className="flex items-center justify-between mb-4">
                           <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${colors.bg} ${colors.text} border ${colors.border}`}>
                             {alert.level}
                           </span>
                           <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusColors[alert.status as keyof typeof statusColors]}`}>
                             {alert.status}
                           </span>
                         </div>
                         <h4 className="text-base font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{alert.title}</h4>
                         <p className="text-xs font-bold text-slate-500 mb-4">{alert.company}</p>
                         
                         <div className="mt-auto space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium border-t border-slate-100 pt-3">
                               <span className="text-slate-400">Kritik Süre:</span>
                               <span className="text-rose-600 font-bold flex items-center gap-1">
                                 <Clock className="w-3.5 h-3.5" />
                                 {alert.deadline}
                               </span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                               <span className="text-slate-400">Gerekli Aksiyon:</span>
                               <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 underline decoration-blue-300 underline-offset-2 cursor-pointer">{alert.action}</span>
                            </div>
                            <div className="pt-2">
                               <Button size="sm" variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest h-8 border-slate-200 group-hover:border-blue-200 group-hover:text-blue-600">İşlemi Başlat</Button>
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
             </CardContent>
           </Card>
        </div>

      </div>

      {/* Professional Warning Footer */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
           <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-1">Mesleki Değerlendirme Notu</h4>
          <p className="text-[12px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
            Risk ve uyarı değerlendirmeleri yapay zekâ destekli ön analiz niteliğindedir. Nihai mesleki değerlendirme ve işlem önceliği mali müşavir kontrolü ve onayı doğrultusunda belirlenmelidir.
          </p>
        </div>
      </div>
    </div>
  );
}

