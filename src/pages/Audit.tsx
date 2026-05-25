import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, FileCheck, Landmark, AlertTriangle, CheckCircle2, ChevronRight, Info, BarChart3 } from 'lucide-react';

export function AuditPage() {
  const riskScore = 65; // Example score for visual
  
  const getRiskColor = (score: number) => {
    if (score <= 30) return 'bg-emerald-500';
    if (score <= 60) return 'bg-amber-500';
    if (score <= 80) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { label: 'Düşük Risk', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score <= 60) return { label: 'İncelenmeli', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (score <= 80) return { label: 'Yüksek Risk', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Kritik Risk', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            Üçlü Denetim Motoru
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Yüklenen belgeleri Vergi Müfettişi, YMM ve Bağımsız Denetçi bakış açılarıyla ayrı ayrı analiz eder; birleşik risk değerlendirmesi üretir.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Vergi Müfettişi Bakışı */}
        <Card className="border-slate-200 shadow-sm flex flex-col h-full ring-1 ring-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base text-slate-800">Vergi Müfettişi Bakışı</CardTitle>
                <CardDescription className="text-[11px]">Resmi Denetim & İnceleme Odağı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 flex-1 flex flex-col">
            <ul className="space-y-3 mb-6">
              {[
                'Eksik beyan riski',
                'Kayıt dışı hasılat şüphesi',
                'Sahte belge veya yanıltıcı belge emaresi',
                'KDV indiriminin reddi riski',
                'Kasa fazlası riski',
                'Ortaklar cari hesabı riski',
                'Banka hareketleri ile satış kayıtları uyumu',
                'Beyanname ve defter kayıtları uyumu',
                'Vergi ziyaı ve özel usulsüzlük riski'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[13px] text-slate-600 group">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-orange-400 transition-colors shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Puanı</span>
                <p className="text-sm font-bold text-orange-600 mt-0.5">85/100</p>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kritik Bulgular</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">3 Adet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: YMM Tasdik Bakışı */}
        <Card className="border-slate-200 shadow-sm flex flex-col h-full ring-1 ring-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base text-slate-800">YMM Tasdik Bakışı</CardTitle>
                <CardDescription className="text-[11px]">Tasdik & KDV İadesi Odağı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 flex-1 flex flex-col">
            <ul className="space-y-3 mb-6">
              {[
                'Belgenin tasdike elverişliliği',
                'Kanıt yeterliliği',
                'Fatura, ödeme, sevk ve teslim ilişkisi',
                'İşlemin gerçekliği',
                'KDV indirimi için belge yeterliliği',
                'İade veya tasdik raporunda savunulabilirlik',
                'Eksik belge ihtiyacı',
                'Mükellef açıklamasının yeterliliği'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[13px] text-slate-600 group">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tasdik Uygunluk</span>
                <p className="text-sm font-bold text-blue-600 mt-0.5">Şartlı Uygun</p>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Eksik Kanıt</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">2 Belge</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Bağımsız Denetçi Bakışı */}
        <Card className="border-slate-200 shadow-sm flex flex-col h-full ring-1 ring-slate-200/50">
          <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base text-slate-800">Bağımsız Denetçi Bakışı</CardTitle>
                <CardDescription className="text-[11px]">Finansal Tablo & Risk Odağı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 flex-1 flex flex-col">
            <ul className="space-y-3 mb-6">
              {[
                'Finansal tablo etkisi',
                'Önemlilik düzeyi',
                'İç kontrol zafiyeti',
                'Hile riski',
                'Yönetim beyanı yeterliliği',
                'Denetim kanıtının yeterliliği',
                'Sınıflandırma, tahakkuk ve değerleme hatası',
                'Süreklilik riski',
                'Denetçi görüşünü etkileyebilecek bulgular'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[13px] text-slate-600 group">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition-colors shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Finansal Etki</span>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">Orta Düzey</p>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hile Riski</span>
                <p className="text-sm font-bold text-slate-700 mt-0.5">Düşük</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Card 4: Birleşik Risk Değerlendirmesi */}
      <Card className="border-blue-200 border-2 shadow-md bg-white overflow-hidden">
        <CardHeader className="pb-4 border-b border-blue-50 bg-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-800">Birleşik Risk Değerlendirmesi</CardTitle>
                <CardDescription className="text-xs">Üçlü Denetim Sentezi & Aksiyon Planı</CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskLevel.bg} ${riskLevel.color} border border-current/20`}>
                {riskLevel.label}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium italic">Son Analiz: 02.05.2026</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 border-r border-slate-100 pr-6 flex flex-col justify-center text-center">
               <div className="relative inline-flex items-center justify-center mx-auto">
                 <svg className="w-32 h-32 transform -rotate-90">
                   <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                   <circle className="text-blue-600 transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray={56 * 2 * Math.PI} strokeDashoffset={56 * 2 * Math.PI * (1 - riskScore / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                   <span className="text-3xl font-black text-slate-800">{riskScore}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Genel Skor</span>
                 </div>
               </div>
               <p className="mt-4 text-[13px] font-semibold text-slate-700">Analiz Tamamlandı</p>
               <p className="text-[11px] text-slate-500 mt-1 truncate">Mükellef: Polat Teknoloji Ltd.</p>
            </div>
            
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    En Kritik 5 Bulgu
                  </h5>
                  <ul className="space-y-2">
                    {[
                      'Kayıt dışı nakit girişi emareleri (Banka vs Kasa)',
                      'İlişkili taraf işlemlerinde emsal bedeli belirsizliği',
                      'KDV devrindeki olağandışı artış (900k+ TL)',
                      'Stok sayım noksanı (Kanıt yetersiz)',
                      'Ortaklar hesabı adat faizi işletilmemesi'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <ChevronRight className="w-3 h-3 text-blue-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Önerilen Aksiyon Planı
                  </h5>
                  <ul className="space-y-2">
                    {[
                      'Banka ekstreleri ile muavin mutabakatı yapın',
                      'İlişkili kişi beyan formunu hazırlayın',
                      'Stok düşüm tutanaklarını tamamlayın',
                      'Adat hesabı için düzeltme kaydı atın',
                      'Mükelleften sözleşme asıllarını talep edin'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <ChevronRight className="w-3 h-3 text-blue-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:col-span-2 mt-2 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">Mali Müşavir Nihai Kontrol Notu</h5>
                    <p className="text-[11px] text-slate-500 italic leading-relaxed">
                      "Belgelerde vergi incelemesi açısından yüksek riskli kalemler tespit edildi. Tasdik için ek kanıtlar temin edilmeden raporun kapatılması önerilmez."
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Onay: Mali Müşavir Tarafından Onaylandı
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-1">Yasal Uyarı</h4>
          <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
            Bu analiz yapay zekâ destekli ön değerlendirme niteliğindedir. Nihai mali, vergisel ve denetim görüşü yetkili mali müşavir incelemesi ve onayı sonrasında oluşturulmalıdır. Oluşabilecek vergisel sonuçlardan sistem sorumlu tutulamaz.
          </p>
        </div>
      </div>
    </div>
  );
}
