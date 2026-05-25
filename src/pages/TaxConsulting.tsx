import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Scale, Send, Sparkles, BookOpen, AlertCircle, 
  History, Download, Copy, ShieldCheck, Search,
  ChevronRight, Filter, FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

const QUICK_SUBJECTS = [
  { id: 'env', label: 'Enflasyon Düzeltmesi', category: 'VUK' },
  { id: 'kdv-ist', label: 'İhracat KDV İstisnası', category: 'KDV' },
  { id: 'invest', label: 'Yatırım Teşvikleri', category: 'KVK' },
  { id: 'exp', label: 'Gider Kısıtlamaları', category: 'GVK' },
  { id: 'electronics', label: 'e-Belge Zorunluluğu', category: 'VUK' }
];

const CATEGORIES = ['Genel', 'VUK', 'KDV', 'GVK', 'KVK', 'ÖTV', 'Damga Vergisi', 'Hukuk'];

export function TaxConsultingPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Genel');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAsk = async (textToAsk?: string, catToUse?: string) => {
    const finalQuery = textToAsk || query;
    const finalCategory = catToUse || category;
    
    if (!finalQuery.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    toast.info('Yapay zeka mevzuat kütüphanesini tarıyor...');
    
    try {
      const response = await fetch('/api/tax-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery, category: finalCategory })
      });

      if (!response.ok) throw new Error('Sunucu yanıt vermedi.');
      
      const data = await response.json();
      setResult(data.text);
      toast.success('Danışmanlık raporu başarıyla oluşturuldu.');
    } catch (error) {
      console.error(error);
      toast.error('Rapor hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
             <Scale className="w-6 h-6 text-indigo-600" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight text-left">Vergi Danışmanlığı & Mevzuat Analizi</h2>
             <p className="text-[13px] text-slate-500 font-medium text-left">Resmî dayanaklı, uydurma veri içermeyen, yüksek güvenlikli mevzuat motoru</p>
           </div>
        </div>
        <div className="flex items-center gap-2 hidden sm:flex">
           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1.5 px-3">
             <ShieldCheck className="w-3.5 h-3.5" /> Mevzuat Doğrulama Aktif
           </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30">
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Yeni Danışmanlık Talebi</CardTitle>
                    <CardDescription>Olayı, şartları ve spesifik sorularınızı detaylandırın.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-slate-400 mr-1 uppercase">KATEGORİ:</span>
                     <select 
                       value={category} 
                       onChange={(e) => setCategory(e.target.value)}
                       className="text-xs font-bold bg-white border border-slate-200 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-700 shadow-sm"
                     >
                       {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Textarea 
                placeholder="Örn: Serbest bölgelerde %100 ihracat şartıyla sağlanan kurumlar vergisi istisnasında, yan faaliyet gelirlerinin durumu nedir?" 
                className="min-h-[120px] text-[14px] leading-relaxed resize-none border-slate-200 focus:border-indigo-300 focus:ring-indigo-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                 <div className="flex flex-wrap gap-2">
                    {QUICK_SUBJECTS.map(sub => (
                       <button 
                         key={sub.id} 
                         onClick={() => {
                           setQuery(sub.label);
                           setCategory(sub.category);
                           handleAsk(sub.label, sub.category);
                         }}
                         className="text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors"
                       >
                         {sub.label}
                       </button>
                    ))}
                 </div>
                 <Button 
                   onClick={() => handleAsk()} 
                   disabled={!query.trim() || isLoading} 
                   className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6 shadow-md transition-all active:scale-95 w-full sm:w-auto"
                 >
                   {isLoading ? (
                     <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Analiz Ediliyor...</>
                   ) : (
                     <><Search className="w-4 h-4 mr-2" /> Analiz Et & Raporla</>
                   )}
                 </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="border-slate-200 shadow-lg bg-white overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="bg-slate-900 border-b border-white/10 text-white py-4 px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                       <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[14px] font-black uppercase tracking-widest">Danışmanlık Raporu</CardTitle>
                      <CardDescription className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Kategori: {category} • Tarih: {new Date().toLocaleDateString('tr-TR')}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => {
                        toast.success("Rapor kopyalandı!");
                        navigator.clipboard.writeText(result);
                     }}>
                        <Copy className="w-3.5 h-3.5" />
                     </Button>
                     <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:text-white">
                        <Download className="w-3.5 h-3.5" />
                     </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wider prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-indigo-700">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
                
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mevzuat Doğrulanmış Yanıt</span>
                   </div>
                   <div className="text-[11px] font-bold text-slate-400 italic">
                      Yasal Uyarı: Bu analiz mali müşavir onayı olmadan tek başına kullanılmamalıdır.
                   </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30 text-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 opacity-50">
                  <BookOpen className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-slate-400 font-bold text-sm tracking-wide">Henüz bir analiz yapılmadı.</h3>
               <p className="text-slate-400 text-xs mt-1">Sol taraftaki alanı kullanarak veya hızlı başlıkları seçerek başlayabilirsiniz.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-50">
              <div className="flex items-center gap-2">
                 <History className="w-4 h-4 text-slate-400" />
                 <CardTitle className="text-[13px] font-black uppercase tracking-wider">Geçmiş Analizler</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-3">
              <div className="space-y-1">
                {[
                  'Binek Araç Gider Kısıtlaması 2026',
                  'İhracatta KDV İadesi Süreci',
                  'E-Ticaret Vergi Avantajları',
                  'Kur Farkı Kayıt Yöntemleri'
                ].map((item, i) => (
                  <button key={i} className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group flex items-start gap-3">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 mt-0.5 transition-colors" />
                    <div>
                      <div className="text-[12px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{item}</div>
                      <div className="text-[10px] text-slate-400 font-medium">12.05.2026 • Analiz Tamamlandı</div>
                    </div>
                  </button>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">TÜM GEÇMİŞİ GÖR</Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-indigo-900 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-16 h-16" />
             </div>
             <CardHeader className="pb-2">
                <CardTitle className="text-[14px] font-black uppercase tracking-widest">Akıllı İpucu</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-[12px] text-indigo-100 leading-relaxed font-medium">
                  Yapay zeka motoru sunucuları taşınarak güvenliği artırıldı. Türk Vergi Mevzuatı (VUK, KDV, GVK, KVK) odaklı, uydurma madde üretilmeyen ve resmî dayanaklı bir yapıya kavuşturuldu.
                </p>
                <div className="mt-4 flex flex-col gap-1.5 p-2 bg-indigo-800/50 rounded border border-indigo-700/50">
                   <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-300 flex-shrink-0" />
                      <span className="text-[10px] text-indigo-200 font-bold leading-tight uppercase">Güncel Mevzuat Kapsamı:</span>
                   </div>
                   <div className="text-[9px] text-indigo-200/80 font-medium pl-5">
                      VUK, KDV, GVK, KVK, ÖTV, MTV, Damga Vergisi, Harçlar K., İYUK
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
