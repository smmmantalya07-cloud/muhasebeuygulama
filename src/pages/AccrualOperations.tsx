import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, AlertCircle, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AccrualOperationsPage() {
  const handleAccrue = (name: string) => {
    toast.success(`${name} için tahakkuk kaydı başarıyla oluşturuldu.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Calculator className="w-5 h-5 text-blue-600" />
             <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tahakkuk İŞLEMLERİ</h1>
           </div>
          <p className="text-slate-500 text-sm italic font-medium">Beyanname sonrası otomatik muhasebe tahakkuk kayıtları ve ödeme fişleri yönetimi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-xs uppercase tracking-widest">GİB'DEN SORGULA</Button>
          <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100"> TOPLU TAHAKKUK YAP </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm relative overflow-hidden bg-white">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Calculator className="w-20 h-20" />
           </div>
           <CardHeader>
              <CardTitle className="text-sm font-black uppercase text-slate-500 tracking-widest">BEKLEYEN TAHAKKUK</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-slate-900 tracking-tighter italic">18</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DOSYA</span>
              </div>
           </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm bg-blue-600 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <ShieldCheck className="w-20 h-20" />
           </div>
           <CardHeader>
              <CardTitle className="text-sm font-black uppercase text-blue-100 tracking-widest">TAHAKKUK EDİLEN TUTAR</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black tracking-tighter">1.840.250 <span className="text-sm font-medium">TL</span></span>
              </div>
           </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
           <CardHeader>
              <CardTitle className="text-sm font-black uppercase text-slate-500 tracking-widest">ÖDEME BEKLEYEN</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-rose-600 tracking-tighter italic">4</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">KRİTİK</span>
              </div>
           </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <CardTitle className="text-base font-bold uppercase tracking-tight italic">Tahakkuk Bekleyen Beyannameler</CardTitle>
           <CardDescription className="text-xs font-medium uppercase tracking-widest text-slate-500">Beyannamesi verilmiş ancak muhasebe kaydı atılmamış işlemler</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="divide-y divide-slate-100">
             {[
               { name: 'ABC İnşaat Ltd. Şti.', type: 'KDV 1', amount: '84.500 TL', period: '2026-04', dueDate: '26.05.2026', risk: 'Düşük' },
               { name: 'Gama Medikal A.Ş.', type: 'MUHSGK', amount: '122.300 TL', period: '2026-04', dueDate: '26.05.2026', risk: 'Düşük' },
               { name: 'Zeta Makine Sanayi', type: 'Geçici Vergi', amount: '450.000 TL', period: '2026-01', dueDate: '17.05.2026', risk: 'Yüksek' },
               { name: 'Delta Lojistik', type: 'Damga Vergisi', amount: '1.200 TL', period: '2026-04', dueDate: '26.05.2026', risk: 'Düşük' },
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.risk === 'Yüksek' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DÖNEM: {item.period}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                     <div>
                        <p className="text-sm font-black text-slate-900">{item.amount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">VADE: {item.dueDate}</p>
                     </div>
                     <Button 
                        size="sm" 
                        onClick={() => handleAccrue(item.name)}
                        className="h-9 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 rounded-lg flex items-center gap-2"
                     >
                        TAHAKKUK ET <ArrowRight className="w-3.5 h-3.5" />
                     </Button>
                  </div>
               </div>
             ))}
           </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 justify-center pt-6 opacity-30">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Resmi Mizan ile %100 Uyumlu Tahakkuk Sistemi</span>
      </div>
    </div>
  );
}
