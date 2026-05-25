import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert, Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function FakeDocumentDetectionPage() {
  const [vkn, setVkn] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<'none' | 'clean' | 'risky'>('none');

  const handleSearch = () => {
    if (!vkn) return;
    setIsSearching(true);
    setResult('none');
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      // Random result for demo
      if (vkn.startsWith('1') || vkn.startsWith('2')) {
         setResult('risky');
         toast.error('Riskli firma tespit edildi!');
      } else {
         setResult('clean');
         toast.success('Firma temiz görünüyor.');
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-600" />
          Sahte Belge Tespiti (SMİYB)
        </h1>
        <p className="text-slate-500 text-sm">Fatura aldığınız / kestiğiniz firmaların kodda olup olmadığını veya risk taşıyıp taşımadığını önceden analiz edin.</p>
      </div>

      <Card className="max-w-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tedarikçi Risk Sorgulama</CardTitle>
          <CardDescription>İncelemek istediğiniz firmanın VKN veya TCKN bilgisini girin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex gap-3">
             <Input 
               placeholder="Vergi Kimlik No / TC Kimlik No" 
               className="font-mono"
               value={vkn}
               onChange={(e) => setVkn(e.target.value)}
               maxLength={11}
             />
             <Button className="bg-slate-900 hover:bg-slate-800 text-white" disabled={!vkn || isSearching} onClick={handleSearch}>
               {isSearching ? 'Sorgulanıyor...' : <><Search className="w-4 h-4 mr-2" /> Sorgula</>}
             </Button>
           </div>

           {result === 'clean' && (
             <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                   <h4 className="font-bold text-emerald-900">Risk Tespit Edilmedi</h4>
                   <p className="text-sm text-emerald-700 mt-1">Bu firmaya ait bilinen bir özel esas (kod) kaydı veya sahte belge düzenleme raporu (VTR) açık kaynaklarda / bağlı verilerde bulunamadı.</p>
                </div>
             </div>
           )}

           {result === 'risky' && (
             <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                   <h4 className="font-bold text-red-900">Yüksek Risk! (Özel Esaslar)</h4>
                   <p className="text-sm text-red-700 mt-1">Dikkat: Bu VKN, sistemdeki riskli firmalar örüntüsüne uyuyor. Sahte belge / Kod 1 veya Kod 2 şüphesi olabilir. Bu firmadan alınan faturaları beyannamelere dahil ederken YMM veya GİB ekranlarından detaylı tasdik yapılması önerilir.</p>
                </div>
             </div>
           )}
        </CardContent>
      </Card>
      
      <div className="text-xs text-slate-500 max-w-2xl px-2">
        * Not: Bu sorgulama bilgilendirme amaçlı yapay zeka ve kümülatif veri analizine dayanır. Resmi GİB Görüntüleme sisteminin yerine geçmez.
      </div>
    </div>
  );
}
