import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FolderLock, ShieldCheck, FileText, 
  Search, Filter, Plus, Eye, 
  Download, Share2, Trash2, 
  HardDrive, Cloud, ShieldAlert,
  Upload, FileCheck, Lock, MoreVertical
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface VaultFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status: 'Şifreli' | 'Güvenli' | 'İncelemede';
  category: string;
}

const SAMPLE_FILES: VaultFile[] = [
  { id: '1', name: '2025_Kurumlar_Vergisi_Beyani.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '12.05.2026', status: 'Şifreli', category: 'Beyannameler' },
  { id: '2', name: 'Nisan_Mizan_Detayli.xlsx', size: '1.1 MB', type: 'Excel', uploadedAt: '15.05.2026', status: 'Güvenli', category: 'Mali Tablolar' },
  { id: '3', name: 'Sözleşme_Protokol_V1.pdf', size: '4.8 MB', type: 'PDF', uploadedAt: '18.05.2026', status: 'Şifreli', category: 'Sözleşmeler' },
  { id: '4', name: 'İmza_Sirküleri_2026.jpg', size: '850 KB', type: 'Image', uploadedAt: '20.05.2026', status: 'Güvenli', category: 'Resmi Belgeler' },
];

export function DocumentVaultPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-4 sm:px-0 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-xl text-white">
             <FolderLock className="w-6 h-6" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Doküman Kasası</h2>
             <p className="text-[13px] text-slate-500 font-medium">Kvkk uyumlu, AES-256 şifreli güvenli belge deposu</p>
           </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-10 border-slate-200 font-bold text-slate-600 gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> GÜVENLİK TARAMASI
          </Button>
          <Button className="bg-slate-900 hover:bg-black text-white font-bold h-10 shadow-md gap-2 uppercase tracking-widest text-[11px]">
            <Upload className="w-4 h-4" /> DOSYA YÜKLE
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
         {/* Categories Sidebar */}
         <div className="space-y-4">
            <Card className="shadow-sm border-slate-200 bg-white">
               <CardHeader className="py-4 border-b border-slate-50">
                  <CardTitle className="text-[12px] font-black uppercase tracking-widest text-slate-500">Kategoriler</CardTitle>
               </CardHeader>
               <CardContent className="p-2">
                  <div className="space-y-1">
                     <CategoryItem label="Tüm Dosyalar" icon={<FileText className="w-4 h-4" />} count={156} active />
                     <CategoryItem label="Beyannameler" icon={<FileCheck className="w-4 h-4" />} count={48} />
                     <CategoryItem label="Sözleşmeler" icon={<Lock className="w-4 h-4" />} count={12} />
                     <CategoryItem label="Mali Tablolar" icon={<HardDrive className="w-4 h-4" />} count={34} />
                     <CategoryItem label="Resmi Belgeler" icon={<ShieldCheck className="w-4 h-4" />} count={62} />
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-indigo-50/50 p-6">
               <div className="flex items-center gap-3 mb-4">
                  <Cloud className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-indigo-900">Depolama Alanı</h4>
               </div>
               <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-600 w-[42%]"></div>
               </div>
               <div className="flex justify-between text-[10px] font-bold text-indigo-400">
                  <span>8.4 GB Kullanıldı</span>
                  <span>20 GB Toplam</span>
               </div>
            </Card>
         </div>

         {/* File Explorer */}
         <div className="lg:col-span-3 space-y-4">
            <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
               <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                           type="text" 
                           placeholder="Kasadaki dosyayı ara..." 
                           className="w-full pl-10 pr-3 h-9 text-xs border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-slate-400"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <Button variant="ghost" size="sm" className="h-9 px-3 text-[11px] font-black uppercase gap-1.5"><Filter className="w-3.5 h-3.5" /> FİLTRE</Button>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Görünüm:</span>
                     <Button variant="ghost" size="sm" className="h-8 w-8 bg-white border border-slate-200 shadow-sm"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <table className="w-full border-collapse">
                     <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                           <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosya Adı</th>
                           <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                           <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Boyut</th>
                           <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                           <th className="px-6 py-3"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {SAMPLE_FILES.map((file) => (
                           <tr key={file.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors">
                                       {file.type === 'PDF' ? <FileText className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-[13px] font-bold text-slate-900">{file.name}</span>
                                       <span className="text-[10px] text-slate-400 font-medium">{file.uploadedAt}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-500 uppercase px-2 py-0.5">{file.category}</Badge>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="text-[11px] font-bold text-slate-500">{file.size}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${file.status === 'Şifreli' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                    <span className="text-[11px] font-bold text-slate-600">{file.status}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:text-blue-600"><Eye className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:text-emerald-600"><Download className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Share2 className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </CardContent>
            </Card>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
               <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-[13px] font-black text-slate-800 uppercase mb-1">Güvenlik Notu</h4>
                  <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                     Sistemdeki tüm dosyalar bankacılık seviyesinde AES-256 şifreleme ile saklanmaktadır. "Şifreli" statüsündeki dosyalar sadece yetkili mali müşavir onayıyla görüntülenebilir. Belgeler, vergi incelemelerinde veya YMM tasdik süreçlerinde doğrudan "Kanıt Merkezi"ne aktarılabilir özelliktedir. Dosya silme işlemleri geri alınamaz ve işlem geçmişi (Audit-Log) üzerinden kaydedilir.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function CategoryItem({ label, icon, count, active = false }: { label: string, icon: React.ReactNode, count: number, active?: boolean }) {
   return (
      <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
         <div className="flex items-center gap-3">
            <span className={active ? 'text-indigo-400' : 'text-slate-400'}>{icon}</span>
            <span className="text-[12px] font-bold">{label}</span>
         </div>
         <Badge variant={active ? 'secondary' : 'outline'} className={`text-[10px] font-black border-none ${active ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</Badge>
      </div>
   );
}
