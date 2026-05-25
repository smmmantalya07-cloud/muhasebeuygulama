import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileSignature, Send, Download, FileText, 
  Search, Filter, Plus, CheckCircle2, 
  Clock, AlertTriangle, Scale, ShieldCheck,
  History, Mail, ExternalLink, ArrowRight,
  ClipboardList, Building2, Package
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface VerificationTask {
  id: string;
  firmName: string;
  taxNumber: string;
  totalAmount: number;
  invoiceCount: number;
  status: 'Beklemede' | 'Gönderildi' | 'Cevap Geldi' | 'İmzalandı' | 'Reddedildi';
  priority: 'Yüksek' | 'Orta' | 'Düşük';
  dueDate: string;
  evidenceScore: number;
}

const SAMPLE_TASKS: VerificationTask[] = [
  {
    id: '1',
    firmName: 'Global Enerji Çözümleri A.Ş.',
    taxNumber: '4050678912',
    totalAmount: 1450000.00,
    invoiceCount: 4,
    status: 'Beklemede',
    priority: 'Yüksek',
    dueDate: '25.05.2026',
    evidenceScore: 85
  },
  {
    id: '2',
    firmName: 'Anadolu Lojistik Hizmetleri Ltd.',
    taxNumber: '1234567890',
    totalAmount: 850000.00,
    invoiceCount: 12,
    status: 'Gönderildi',
    priority: 'Orta',
    dueDate: '28.05.2026',
    evidenceScore: 45
  },
  {
    id: '3',
    firmName: 'Mega İnşaat Malzemeleri Sanayi',
    taxNumber: '9988776655',
    totalAmount: 3200000.00,
    invoiceCount: 1,
    status: 'Cevap Geldi',
    priority: 'Yüksek',
    dueDate: '22.05.2026',
    evidenceScore: 92
  }
];

export function VerificationPreparationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: VerificationTask['status']) => {
    switch (status) {
      case 'Beklemede': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Gönderildi': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Cevap Geldi': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'İmzalandı': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Reddedildi': return 'bg-rose-100 text-rose-600 border-rose-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm tracking-tight text-left">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm text-indigo-600">
             <FileSignature className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Karşıt İnceleme Hazırlığı</h2>
             <p className="text-[13px] text-slate-500 font-medium">YMM Tasdik ve KDV İadesi için tedarikçi teyit ve tutanak süreci</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2 uppercase tracking-widest text-[10px]">
             TOPLU TUTANAK DÖKÜMÜ
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            <Plus className="w-4 h-4" /> YENİ TUTANAK OLUŞTUR
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         {/* Sidebar Stats */}
         <div className="space-y-4">
            <Card className="shadow-sm border-slate-200 bg-white">
               <CardHeader className="py-4 border-b border-slate-50">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-800">Süreç Özeti</CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                  <StatusMetric label="Bekleyen Talepler" value="12" total="45" color="slate" />
                  <StatusMetric label="Cevap Bekleyen" value="18" total="45" color="blue" />
                  <StatusMetric label="Tamamlanan" value="15" total="45" color="emerald" />
                  
                  <div className="pt-4 border-t border-slate-100">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">KDV İadesi Etkisi (Tahmini)</span>
                     <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <span className="text-2xl font-black text-indigo-700">4.5M ₺</span>
                        <p className="text-[11px] font-bold text-indigo-500 mt-1">İade Tutarı Kanıtı</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 shadow-sm text-left">
               <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                     <h4 className="text-[11px] font-black text-amber-800 uppercase mb-1">Geciken Yanıtlar</h4>
                     <p className="text-[11px] text-amber-700 font-medium">8 tedarikçiden 10 günden fazladır karşıt inceleme yanıtı gelmemiştir.</p>
                     <Button variant="link" className="p-0 h-auto text-[10px] font-black text-amber-800 uppercase mt-2 hover:no-underline flex items-center gap-1">HATIRLATMA GÖNDER <ArrowRight className="w-3 h-3" /></Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Main List */}
         <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
               <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                     type="text" 
                     placeholder="Firma veya vergi no ara..." 
                     className="w-full pl-10 pr-4 h-10 text-[13px] border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="h-10 px-4 text-[11px] font-black uppercase border-slate-200"><Filter className="w-3.5 h-3.5 mr-2" /> FİLTRELE</Button>
                  <Button variant="outline" size="sm" className="h-10 px-4 text-[11px] font-black uppercase border-slate-200"><History className="w-3.5 h-3.5 mr-2" /> ARŞİV</Button>
               </div>
            </div>

            <div className="grid gap-4">
               {SAMPLE_TASKS.map(task => (
                  <Card key={task.id} className="shadow-sm border-slate-200 bg-white hover:border-slate-300 transition-all text-left">
                     <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                           <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                                 <Building2 className="w-5 h-5 text-slate-400" />
                              </div>
                              <div className="min-w-0">
                                 <h4 className="text-[14px] font-bold text-slate-900 truncate uppercase">{task.firmName}</h4>
                                 <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tight">
                                    <span>VKN: {task.taxNumber}</span>
                                    <span className="before:content-['•'] before:mr-3">{task.invoiceCount} Fatura</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-6">
                              <div className="text-right">
                                 <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Toplam İşlem</span>
                                 <span className="text-[14px] font-black text-slate-900">{task.totalAmount.toLocaleString('tr-TR')} ₺</span>
                              </div>
                              
                              <div className="w-24">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Kanıt Gücü</span>
                                 <div className="flex items-center gap-2">
                                    <Progress value={task.evidenceScore} className={`h-1 flex-1 ${task.evidenceScore > 70 ? 'bg-emerald-500' : task.evidenceScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                    <span className="text-[10px] font-black text-slate-700">%{task.evidenceScore}</span>
                                 </div>
                              </div>

                              <Badge className={`text-[10px] font-black uppercase px-2.5 py-1 border-none ${getStatusColor(task.status)}`}>
                                 {task.status}
                              </Badge>

                              <div className="flex items-center gap-2">
                                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"><Mail className="w-4 h-4" /></Button>
                                 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"><Download className="w-4 h-4" /></Button>
                                 <Button className="h-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-none font-black text-[10px] uppercase px-3">Detay &lt;</Button>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </div>

      {/* Footer Instructions */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm mt-6 text-left">
         <div className="flex items-start gap-4">
            <div className="shrink-0 mt-1">
               <ClipboardList className="w-5 h-5 text-slate-400" />
            </div>
            <div>
               <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1">YMM Karşıt İnceleme Rehberi (Seri No: 20 S. Tebliğ)</h4>
               <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                  Karşıt inceleme, mükelleflerin beyanlarının doğruluğunun saptanması için alt mükelleflerin (tedarikçilerin) defter kayıtları ve belgeleri üzerinden yapılan bir doğrulamadır. Sistem, Kanıt Merkezi üzerinden fatura ve ödeme kanıtlarını otomatik eşleştirir. Tutanak hazırlığı aşamasında, firmanın faaliyet konusu ile işlemin uyumu, ödeme kanalları ve karşı tarafın vergi mükellefiyeti durumu sistem tarafından ön analizden geçirilir. Yanıtı gelmeyen veya kanıt gücü %50'nin altında olan karşıt incelemeler YMM tasdik raporunda "Kritik Eksik" olarak işaretlenmelidir.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatusMetric({ label, value, total, color }: { label: string, value: string, total: string, color: 'slate' | 'blue' | 'emerald' }) {
   const colorStyles = {
      slate: "bg-slate-50 text-slate-600",
      blue: "bg-blue-50 text-blue-600",
      emerald: "bg-emerald-50 text-emerald-600"
   };

   return (
      <div className={`p-4 rounded-xl border border-transparent shadow-sm ${colorStyles[color]} flex items-center justify-between`}>
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
            <span className="text-xl font-black">{value}</span>
         </div>
         <span className="text-[10px] font-black opacity-40">/ {total} TOPLAM</span>
      </div>
   );
}
