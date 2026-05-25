import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Download, Send, Sparkles, 
  Copy, History, ShieldCheck, CornerDownRight,
  Gavel, FileCheck, ShieldAlert, Trash2, Printer
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';

const PETITION_TYPES = [
  'Özel Usulsüzlük Cezası İtirazı',
  'Ödeme Emrine İtiraz (7 Gün)',
  'Vergi Ziyaı Cezası (Uzlaşma Talebi)',
  'VUK 376 - İndirim Talebi',
  'İzaha Davet Cevap Yazısı',
  'Takdir Komisyonu Kararı İtirazı'
];

export function DefensePetitionPage() {
  const [taxOffice, setTaxOffice] = useState('');
  const [firmName, setFirmName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [noticeNumber, setNoticeNumber] = useState('');
  const [petitionType, setPetitionType] = useState(PETITION_TYPES[0]);
  const [caseDetails, setCaseDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!taxOffice || !firmName || !caseDetails) {
      toast.error('Lütfen zorunlu alanları (VD, Firma, Olay Özeti) doldurunuz.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    toast.info('Hukuki AI taslağı hazırlıyor...');

    try {
      const response = await fetch('/api/petition-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taxOffice, firmName, taxNumber, noticeNumber, petitionType, caseDetails 
        })
      });

      if (!response.ok) throw new Error('Sunucu hatası.');
      const data = await response.json();
      setResult(data.text);
      toast.success('Dilekçe taslağı başarıyla oluşturuldu.');
    } catch (error) {
      console.error(error);
      toast.error('Dilekçe oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 shadow-sm text-rose-600">
             <Gavel className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Savunma & İtiraz Dilekçesi Üretici</h2>
             <p className="text-[13px] text-slate-500 font-medium">Hukuki dayanaklı, kurumsal dilde profesyonel vergi dilekçeleri</p>
           </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
           <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 gap-1.5 py-1.5 px-3">
             <FileCheck className="w-3.5 h-3.5" /> Resmi Yazışma Formatı Standart
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800">Dilekçe Parametreleri</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
               <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Vergi Dairesi Müdürlüğü</label>
                  <Input 
                    placeholder="Örn: Antalya Kurumlar VD." 
                    className="h-9 px-3 text-[13px] border-slate-200"
                    value={taxOffice}
                    onChange={(e) => setTaxOffice(e.target.value)}
                  />
               </div>
               <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Firma / Mükellef Ünvanı</label>
                  <Input 
                    placeholder="Tam ünvan yazınız..." 
                    className="h-9 px-3 text-[13px] border-slate-200"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                  />
               </div>
               <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">VKN / TCKN</label>
                     <Input 
                       placeholder="10 Haneli" 
                       className="h-9 px-3 text-[13px] border-slate-200"
                       value={taxNumber}
                       onChange={(e) => setTaxNumber(e.target.value)}
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">İhbarname No</label>
                     <Input 
                       placeholder="Varsa giriniz" 
                       className="h-9 px-3 text-[13px] border-slate-200"
                       value={noticeNumber}
                       onChange={(e) => setNoticeNumber(e.target.value)}
                     />
                  </div>
               </div>
               <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">İtiraz Türü</label>
                  <select 
                    value={petitionType}
                    onChange={(e) => setPetitionType(e.target.value)}
                    className="flex h-9 w-full rounded border border-slate-200 bg-white px-3 py-1 text-[13px] font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    {PETITION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Olay ve Savunma Özeti</label>
                  <Textarea 
                    placeholder="Cezanın haksızlık nedenlerini, maddi hataları veya itiraz gerekçelerinizi kısaca yazın..." 
                    className="min-h-[100px] text-[13px] leading-relaxed resize-none border-slate-200 focus:ring-rose-50"
                    value={caseDetails}
                    onChange={(e) => setCaseDetails(e.target.value)}
                  />
               </div>
               <Button 
                onClick={handleGenerate} 
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold h-11 mt-4 shadow-md gap-2 uppercase text-[11px] tracking-widest"
               >
                 {isLoading ? <><Sparkles className="w-4 h-4 animate-spin" /> Hazırlanıyor...</> : <><Send className="w-4 h-4" /> Dilekçeyi Oluştur</>}
               </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-slate-50">
             <CardHeader className="py-4">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-500">Mevzuat Desteği</CardTitle>
             </CardHeader>
             <CardContent className="px-5 pb-5 space-y-3 text-left">
                <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded bg-white flex items-center justify-center border border-slate-200 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium leading-normal">VUK 376 indirim maddesi her dilekçede alternatif olarak sunulur.</p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="w-6 h-6 rounded bg-white flex items-center justify-center border border-slate-200 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                   </div>
                   <p className="text-[11px] text-slate-500 font-medium leading-normal">7440 sayılı yapılandırma yasası uyarıları aktif hale getirildi.</p>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <Card className="border-slate-200 shadow-lg bg-white overflow-hidden animate-in zoom-in-95 duration-500">
               <CardHeader className="bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between py-3 px-6">
                  <div className="flex items-center gap-2">
                     <FileText className="w-4 h-4 text-rose-600" />
                     <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Dilekçe Ön İzleme</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:bg-slate-100" onClick={() => {
                       toast.success("Kopyalandı!");
                       navigator.clipboard.writeText(result);
                     }}>
                        <Copy className="w-3.5 h-3.5" />
                     </Button>
                     <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:bg-slate-100">
                        <Printer className="w-3.5 h-3.5" />
                     </Button>
                     <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-slate-200 gap-1.5 ml-2">
                        <Download className="w-3.5 h-3.5 text-blue-600" /> WORD TASLAĞI İNDİR
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-10 bg-slate-50/20">
                  <div className="bg-white shadow-2xl border border-slate-100 p-12 min-h-[600px] text-left mx-auto max-w-2xl ring-1 ring-slate-100">
                     <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-800 prose-p:leading-relaxed">
                        <ReactMarkdown>{result}</ReactMarkdown>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/20 text-center">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6 opacity-40">
                  <FileText className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-slate-400 font-bold text-base tracking-wide">Dilekçe henüz üretilmedi.</h3>
               <p className="text-slate-400 text-sm mt-1 max-w-xs">Sol taraftaki bilgileri doldurarak sistemin profesyonel bir savunma metni hazırlamasını sağlayabilirsiniz.</p>
               <div className="mt-8 flex gap-4 opacity-40">
                  <div className="flex flex-col items-center">
                     <div className="w-10 h-1 bg-slate-200 rounded-full mb-1"></div>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">BAŞLIK</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-10 h-1 bg-slate-200 rounded-full mb-1"></div>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">İLGİLİ KANUN</span>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="w-10 h-1 bg-slate-200 rounded-full mb-1"></div>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">TALEP</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl text-left">
        <div className="flex items-start gap-4">
           <div className="shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
           </div>
           <div>
              <h4 className="text-[13px] font-black text-white uppercase tracking-wider mb-2">Hukuki Sorumluluk Reddİ</h4>
              <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                 Sistem tarafından üretilen dilekçe taslağı sadece bir "yardımcı metin" niteliğindedir. Vergi davaları ve itirazları ciddi süre kısıtlarına (Örn: 30 gün içinde dava açma süresi) ve teknik detaylara tabidir. Bu taslağın resmî makamlara sunulmadan önce mutlaka meslek mensubu (Mali Müşavir, YMM) veya bir Vergi Avukatı tarafından incelenmesi ve imzalanması gerekmektedir. AI Studio sistemi tarafından oluşturulan metinlerin kullanılmasından doğabilecek hak kayıplarından sistem sorumlu tutulamaz.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
