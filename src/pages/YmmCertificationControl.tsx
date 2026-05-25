import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  FileText, 
  Table, 
  ShieldCheck, 
  BarChart3,
  Scale,
  Building2,
  Clock,
  ArrowRight,
  Plus,
  Info,
  Archive
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function YmmCertificationControlPage() {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const riskMetrics = [
    { label: 'KDV Oran Uyum Riski', value: '%12', status: 'Düşük', color: 'text-emerald-600' },
    { label: 'Fiktif Alış Emareleri', value: '3 Adet', status: 'Orta', color: 'text-amber-600' },
    { label: 'Gider Kabul Uyumu', value: '%88', status: 'Yüksek', color: 'text-blue-600' },
    { label: 'Genel Tasdik Skoru', value: '82/100', status: 'Güçlü', color: 'text-emerald-700' },
  ];

  const auditFindings = [
    {
      id: 1,
      title: 'Kasa Hesabı Faiz Adatlandırma Eksikliği',
      type: 'VERGİSEL RİSK',
      desc: '100 Kasa hesabı bakiyesi yıl içinde 50.000 TL sınırını sürekli aşmış ancak adatlandırma yapılmamıştır.',
      mufettis: 'Adat faizi hesaplanmalı ve KDV beyan edilmelidir, aksi halde vergi ziyaı cezalı tarhiyat riski vardır.',
      ymm: 'Tasdik raporunda belirtilmesi gerekir. Dönem sonuna kadar adat kaydı atılması önerilir.',
      denetci: 'İlişkili taraf işlemi olarak dipnotlarda açıklanmalı, finansal tablolarda faiz geliri tahakkuku gerektirir.',
      status: 'Açık'
    },
    {
      id: 2,
      title: 'İndirimli Oran KDV İadesi Yüklenim Listesi',
      type: 'TASDİK KRİTERİ',
      desc: 'İndirimli orana tabi işlemlerde stoktan sarf edilen hammadde KDV\'leri ile iade talep edilen tutar %5 uyumsuz.',
      mufettis: 'İncelemede yüklenilen KDV reddedilebilir. Sarfiyat reçeteleri ile fatura eşleşmesi istenecektir.',
      ymm: 'Yüklenim listesi revize edilmeden tasdik raporu imzalanmamalıdır. Kanıt gücü test edilmelidir.',
      denetci: 'Dönensellik ve ölçüm ilkesi gereği stok maliyetleri ile iade alacağı mutabık olmalıdır.',
      status: 'Kontrol Gerekli'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">YMM Tam Tasdik Ön Kontrolü</h1>
            <p className="text-slate-500 font-bold text-sm tracking-tight uppercase">Tasdik raporu öncesi profesyonel risk ve kanıt analizi</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-widest bg-white">
            <Archive className="w-4 h-4 mr-2" /> ARŞİVİ GÖR
          </Button>
          <Button className="h-12 px-10 rounded-xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200">
            <Search className="w-4 h-4 mr-2" /> YERİNDE DENETİM BAŞLAT
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {riskMetrics.map((m, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
            <div className="p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{m.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{m.status}</span>
              </div>
            </div>
            <div className="h-1 w-full bg-slate-50 relative overflow-hidden">
               <div className={`absolute left-0 top-0 h-full transition-all duration-1000 w-[65%] ${m.color.replace('text', 'bg')}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">KRİTİK DENETİM BULGULARI</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOPLAM 12 BULGU</span>
          </div>

          <div className="space-y-4">
            {auditFindings.map((finding) => (
              <Card key={finding.id} className="border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all group">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded uppercase tracking-tighter">{finding.type}</span>
                        <h4 className="text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{finding.title}</h4>
                      </div>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{finding.desc}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0"> <ArrowRight className="w-5 h-5" /> </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative pt-8">
                       <span className="absolute top-3 left-4 text-[8px] font-black text-rose-600 uppercase tracking-widest">Vergi Müfettişi Görüşü</span>
                       <p className="text-[11px] font-bold text-slate-700 leading-normal uppercase">{finding.mufettis}</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 relative pt-8">
                       <span className="absolute top-3 left-4 text-[8px] font-black text-blue-600 uppercase tracking-widest">YMM Tasdik Görüşü</span>
                       <p className="text-[11px] font-bold text-slate-700 leading-normal uppercase">{finding.ymm}</p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 relative pt-8">
                       <span className="absolute top-3 left-4 text-[8px] font-black text-emerald-600 uppercase tracking-widest">Bağımsız Denetçi Görüşü</span>
                       <p className="text-[11px] font-bold text-slate-700 leading-normal uppercase">{finding.denetci}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-t border-slate-100">
                  <div className="flex gap-4">
                     <button className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest">DÜZELTME ÖNER</button>
                     <button className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">GÖREV ATA</button>
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic font-mono">STATUS: {finding.status.toUpperCase()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-900 text-white">
            <CardHeader className="pb-2 border-b border-white/10">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> KANIT MERKEZİ SKORU
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-8">
                  <div className="text-4xl font-black italic tracking-tighter">74 <span className="text-sm font-normal text-slate-500 not-italic">/100</span></div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">DURUM: ŞARTLI TASDİK</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Eksik belgeler mevcut</p>
                  </div>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Bankalar & Finans', val: '%95', strength: 'Güçlü' },
                    { label: 'Cari Mutabakatlar', val: '%60', strength: 'Zayıf' },
                    { label: 'Stok Hareketleri', val: '%82', strength: 'Orta' }
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                          <span>{s.label}</span>
                          <span className={s.strength === 'Zayıf' ? 'text-rose-400' : 'text-emerald-400'}>{s.val}</span>
                       </div>
                       <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full ${s.strength === 'Zayıf' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: s.val }} />
                       </div>
                    </div>
                  ))}
               </div>
               <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] uppercase tracking-widest h-12 rounded-xl">
                  KANITLARI İNCELE
               </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
             <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Mükellef Soruları</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                   {[
                     'Cari mutabakat farklarının sebebi nedir?',
                     '131 hesap adatlandırması neden yapılmadı?',
                     'Stok sayım tutanakları hazır mı?'
                   ].map((q, i) => (
                     <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-tight leading-snug pr-4">{q}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"> <Plus className="w-3.5 h-3.5 text-blue-600" /> </Button>
                     </div>
                   ))}
                </div>
                <div className="p-4 border-t border-slate-100">
                   <Button variant="outline" className="w-full border-slate-200 font-black text-[10px] uppercase tracking-widest h-10 rounded-lg">SORULARI GÖNDER</Button>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="text-center pt-10">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto">
          Nihai tasdik raporu için YMM mesleki kanaati ve tebliğlerdeki iade limitleri her zaman asıl esastır. Bu sistem bir ön denetim ve risk belirleme aracıdır.
        </p>
      </div>
    </div>
  );
}
