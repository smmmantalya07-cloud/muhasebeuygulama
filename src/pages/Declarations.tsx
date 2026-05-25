import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, CheckCircle2, Clock, 
  AlertCircle, Search, Filter, 
  Download, Send, Eye, MoreVertical,
  Calendar, ShieldAlert, CheckCircle,
  FileCheck, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type DecStatus = 'Tamamlandı' | 'İşlemde' | 'Bekliyor' | 'Eksik Evrak' | 'Hata';

interface Declaration {
  id: string;
  firmName: string;
  type: 'KDV1' | 'KDV2' | 'MUHSGK' | 'Kurumlar' | 'Geçici' | 'Damga';
  period: string;
  dueDate: string;
  status: DecStatus;
  preparedBy: string;
  taxAmount: number;
}

const SAMPLE_DATA: Declaration[] = [
  { id: '1', firmName: "ABC İnşaat Ltd. Şti.", type: "KDV1", period: "Nisan 2026", dueDate: "28.05.2026", status: "Tamamlandı", preparedBy: "Ahmet Y.", taxAmount: 14250.60 },
  { id: '2', firmName: "Gama Medikal A.Ş.", type: "MUHSGK", period: "Nisan 2026", dueDate: "26.05.2026", status: "İşlemde", preparedBy: "Selin K.", taxAmount: 8400.00 },
  { id: '3', firmName: "Zeta Makine Ticaret", type: "KDV1", period: "Nisan 2026", dueDate: "28.05.2026", status: "Bekliyor", preparedBy: "Mehmet A.", taxAmount: 0 },
  { id: '4', firmName: "Omega Lojistik Loj. Hiz.", type: "Kurumlar", period: "2025 Yılı", dueDate: "30.04.2026", status: "Eksik Evrak", preparedBy: "Fatma D.", taxAmount: 125000.00 },
  { id: '5', firmName: "Delta Teknoloji Yazılım", type: "Geçici", period: "2026/1", dueDate: "17.05.2026", status: "Hata", preparedBy: "Can B.", taxAmount: 45200.00 },
];

export function DeclarationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Hepsi');

  const getStatusBadge = (status: DecStatus) => {
    switch (status) {
      case 'Tamamlandı': return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-bold text-[10px] gap-1"><CheckCircle className="w-3 h-3" /> TAMAMLANDI</Badge>;
      case 'İşlemde': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-bold text-[10px] gap-1"><Clock className="w-3 h-3" /> İŞLEMDE</Badge>;
      case 'Bekliyor': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-bold text-[10px] gap-1"><Clock className="w-3 h-3" /> BEKLİYOR</Badge>;
      case 'Eksik Evrak': return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-bold text-[10px] gap-1"><AlertTriangle className="w-3 h-3" /> EKSİK EVRAK</Badge>;
      case 'Hata': return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none font-bold text-[10px] gap-1"><ShieldAlert className="w-3 h-3" /> HATALI</Badge>;
    }
  };

  const filteredData = SAMPLE_DATA.filter(d => 
    (d.firmName.toLowerCase().includes(searchTerm.toLowerCase()) || d.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'Hepsi' || d.type === filterType)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 text-left">
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
             <FileCheck className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Beyanname Takip & Kontrol</h2>
             <p className="text-[13px] text-slate-500 font-medium">KDV, Muhtasar ve Gelir/Kurumlar vergisi süreçleri</p>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
               placeholder="Firma veya tür ara..." 
               className="pl-9 h-10 text-[13px] border-slate-200" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <Filter className="w-4 h-4" /> Filtrele
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-md">
            YENİ BEYANNAME EKLE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <StatsCard label="Tamamlanan" value={42} color="emerald" icon={<CheckCircle2 />} />
         <StatsCard label="Bekleyen" value={14} color="blue" icon={<Clock />} />
         <StatsCard label="Eksik Evrak" value={3} color="amber" icon={<AlertTriangle />} />
         <StatsCard label="Hata/Risk" value={1} color="rose" icon={<ShieldAlert />} />
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] font-bold text-slate-800">Cari Dönem Beyanname Listesi</CardTitle>
            <div className="flex gap-2">
               <Badge variant="outline" className="text-[10px] font-bold">Toplam: {filteredData.length}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-[11px] uppercase text-slate-500 font-black border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Firma Ünvanı</th>
                  <th className="px-6 py-4">Beyan Türü</th>
                  <th className="px-6 py-4">Dönem</th>
                  <th className="px-6 py-4">Son Gün</th>
                  <th className="px-6 py-4">Tahakkuk</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                       <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.firmName}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center">
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <span className="font-bold text-slate-600 tracking-tight">{item.type}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{item.period}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" /> {item.dueDate}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="font-black text-slate-800">{item.taxAmount > 0 ? `${item.taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺` : '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                       {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Görüntüle"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600" title="Tahakkuk İndir"><Download className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Düzenle"><MoreVertical className="w-3.5 h-3.5" /></Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Cards */}
          <div className="md:hidden divide-y divide-slate-100">
             {filteredData.map((item) => (
               <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                     <div className="space-y-1">
                        <div className="text-[14px] font-bold text-slate-900">{item.firmName}</div>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-[10px] font-bold py-0">{item.type}</Badge>
                           <span className="text-[11px] text-slate-400 font-medium">{item.period}</span>
                        </div>
                     </div>
                     {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                     <div className="text-[11px] font-bold text-slate-400">Tahakkuk: <span className="text-slate-900 ml-1">{item.taxAmount > 0 ? `${item.taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺` : '-'}</span></div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-slate-200">İNDİR</Button>
                        <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-slate-200"><Send className="w-3 h-3 mr-1" /> GÖNDER</Button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4 text-left">
           <div className="shrink-0 mt-1">
              <ShieldAlert className="w-5 h-5 text-slate-400" />
           </div>
           <div>
              <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-1 text-left">Nihai Kontrol Notu</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed text-left">
                 Beyanname listesinde sunulan veriler, e-Beyanname ve e-Defter sistemlerinden çekilen anlık verilerdir. Nihai onaydan önce hesap planı kontrolleri (191, 391, 600 hesaplar), KDV oran uyumları ve KKEG kalemlerinin ilgili kanunlara (VUK, KDV, GVK) uygunluğu bizzat mali müşavir/denetçi tarafından kontrol edilmelidir. Onaylanmamış beyannamelerden dolayı oluşabilecek gecikme faizlerinden sistem sorumlu tutulamaz.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, color, icon }: { label: string, value: number, color: 'emerald' | 'blue' | 'amber' | 'rose', icon: React.ReactNode }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 p-1.5",
    blue: "bg-blue-50 text-blue-600 border-blue-100 p-1.5",
    amber: "bg-amber-50 text-amber-600 border-amber-100 p-1.5",
    rose: "bg-rose-50 text-rose-600 border-rose-100 p-1.5",
  };
  
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
               {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" } as any)}
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
               <p className="text-xl font-black text-slate-800">{value}</p>
            </div>
         </div>
         <div className="h-8 w-1 bg-slate-100 rounded-full hidden sm:block"></div>
      </CardContent>
    </Card>
  );
}
