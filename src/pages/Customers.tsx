import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, Search, Plus, Filter, MoreHorizontal, 
  Building2, MapPin, Phone, Mail, FileText, 
  ShieldAlert, Calculator, TrendingUp, ChevronRight,
  Globe, Bell, Download, Pencil, Trash2, Building, Wallet
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { FirmContextData } from '@/components/AiAssistant';

export function CustomersPage({ 
  firms, 
  onAddFirm,
  onUpdateFirm,
  onDeleteFirm,
  onNavigate,
  onFirmChange
}: { 
  firms: FirmContextData[], 
  onAddFirm: (firm: any) => Promise<any> | void,
  onUpdateFirm: (firm: FirmContextData) => void,
  onDeleteFirm: (id: string) => void,
  onNavigate?: (tab: string) => void,
  onFirmChange?: (firmId: string) => void
}) {
  console.log("CustomersPage received firms size:", firms.length);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newFirm, setNewFirm] = useState({ name: '', vkn: '', vd: '', manager: '', contact: '' });
  const [editingFirm, setEditingFirm] = useState<FirmContextData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [firmToDelete, setFirmToDelete] = useState<{ id: string, name: string } | null>(null);
  const [detailedFirm, setDetailedFirm] = useState<FirmContextData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getDynamicCount = (id: string, max: number, min: number = 0) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return (Math.abs(hash) % (max - min + 1)) + min;
  };

  const handleAddFirm = async () => {
    if (!newFirm.name || !newFirm.vkn) {
      toast.error('Lütfen ünvan ve VKN alanlarını doldurun.');
      return;
    }
    const success = await onAddFirm(newFirm);
    if (success !== false) {
      setNewFirm({ name: '', vkn: '', vd: '', manager: '', contact: '' });
      setIsAddModalOpen(false);
      toast.success('Firma sisteme başarıyla kaydedildi.');
    }
  };

  const handleEditClick = (firm: FirmContextData) => {
    setEditingFirm({ ...firm });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingFirm) {
      if (!editingFirm.name || !editingFirm.vkn) {
        toast.error('Lütfen ünvan ve VKN alanlarını doldurun.');
        return;
      }
      onUpdateFirm(editingFirm);
      setIsEditModalOpen(false);
      setEditingFirm(null);
      toast.success('Firma bilgileri güncellendi.');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setFirmToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (firmToDelete) {
      onDeleteFirm(firmToDelete.id);
      setIsDeleteModalOpen(false);
      setFirmToDelete(null);
      toast.success('Firma başarıyla silindi.');
    }
  };

  const filteredFirms = firms.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f?.vkn && f.vkn.includes(searchTerm))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-600" />
            MÜKELLEF 360° YÖNETİMİ
          </h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1">
            Firma detayları, risk geçmişi, beyanname takibi ve KEP/Tebligat arşivi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Ünvan veya VKN ile ara..." 
              className="pl-10 h-11 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="default" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 border-none" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> YENİ FİRMA EKLE
          </Button>
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Firma Ekle</DialogTitle>
            <DialogDescription>
              Sisteme yeni bir mükellef kaydetmek için bilgileri doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Firma Ünvanı</label>
              <Input 
                id="name" 
                value={newFirm.name} 
                onChange={(e) => setNewFirm({...newFirm, name: e.target.value})} 
                placeholder="Örn: ABC A.Ş." 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="vkn" className="text-sm font-medium text-slate-700">VKN veya TCKN</label>
              <Input 
                id="vkn" 
                value={newFirm.vkn} 
                onChange={(e) => setNewFirm({...newFirm, vkn: e.target.value})} 
                placeholder="10 veya 11 haneli numara" 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="vd" className="text-sm font-medium text-slate-700">Vergi Dairesi</label>
              <Input 
                id="vd" 
                value={newFirm.vd} 
                onChange={(e) => setNewFirm({...newFirm, vd: e.target.value})} 
                placeholder="Örn: Marmara Kurumlar" 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="manager" className="text-sm font-medium text-slate-700">Yönetici</label>
              <Input 
                id="manager" 
                value={newFirm.manager} 
                onChange={(e) => setNewFirm({...newFirm, manager: e.target.value})} 
                placeholder="Örn: Ahmet Yılmaz" 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="contact" className="text-sm font-medium text-slate-700">İletişim Bilgileri</label>
              <Input 
                id="contact" 
                value={newFirm.contact} 
                onChange={(e) => setNewFirm({...newFirm, contact: e.target.value})} 
                placeholder="Örn: 0555 123 4567" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>İptal</Button>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold uppercase tracking-widest text-xs" onClick={handleAddFirm}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Firma Bilgilerini Güncelle</DialogTitle>
            <DialogDescription>
              Firma bilgilerini buradan düzenleyebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          {editingFirm && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Firma Ünvanı</label>
                <Input 
                  value={editingFirm.name} 
                  onChange={(e) => setEditingFirm({...editingFirm, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">VKN veya TCKN</label>
                <Input 
                  value={editingFirm.vkn} 
                  onChange={(e) => setEditingFirm({...editingFirm, vkn: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Vergi Dairesi</label>
                <Input 
                  value={editingFirm.vd || ''} 
                  onChange={(e) => setEditingFirm({...editingFirm, vd: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Yönetici</label>
                <Input 
                  value={editingFirm.manager || ''} 
                  onChange={(e) => setEditingFirm({...editingFirm, manager: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">İletişim Bilgileri</label>
                <Input 
                  value={editingFirm.contact || ''} 
                  onChange={(e) => setEditingFirm({...editingFirm, contact: e.target.value})} 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>İptal</Button>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold uppercase tracking-widest text-xs" onClick={handleSaveEdit}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Firmayı Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. <strong>{firmToDelete?.name}</strong> isimli firmayı silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>İptal</Button>
            <Button className="bg-rose-600 text-white hover:bg-rose-700 font-bold uppercase tracking-widest text-xs" onClick={confirmDelete}>Evet, Sil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFirms.map((firm) => (
          <Card key={firm.id} className="border-slate-200 shadow-sm hover:border-indigo-300 transition-all group overflow-hidden bg-white">
            <CardHeader className="p-5 border-b border-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-700 transition-colors truncate max-w-[180px]" title={firm.name}>
                      {firm.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className="text-[10px] font-bold border-slate-200 bg-slate-50/50 uppercase">{firm.vd || 'Genel V.D.'}</Badge>
                       <span className="text-[11px] font-bold text-slate-400 font-mono tracking-tighter">VKN: {firm.vkn}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEditClick(firm)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => handleDeleteClick(firm.id, firm.name)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Risk Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">RİSK SKORU</span>
                  <span className={`text-[11px] font-black leading-none ${firm.risk === 'Kritik' ? 'text-rose-600' : firm.risk === 'Yüksek' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {firm.risk || 'Düşük Risk'}
                  </span>
                </div>
                <Progress 
                  value={firm.risk === 'Kritik' ? 95 : firm.risk === 'Yüksek' ? 75 : 15} 
                  className={`h-1.5 bg-slate-100 ${firm.risk === 'Kritik' ? '[&>div]:bg-rose-500' : firm.risk === 'Yüksek' ? '[&>div]:bg-rose-400' : '[&>div]:bg-emerald-500'}`} 
                />
              </div>

              {/* Manager & Contact */}
              {(firm.manager || firm.contact) && (
                <div className="flex flex-col gap-1 py-2 border-y border-slate-50">
                   {firm.manager && (
                     <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> 
                        <span className="font-bold text-slate-700">{firm.manager}</span> (Yönetici)
                     </div>
                   )}
                   {firm.contact && (
                     <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {firm.contact}
                     </div>
                   )}
                </div>
              )}

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    <Calculator className="w-3 h-3" /> BEYANNAME
                  </div>
                  <p className="text-[12px] font-bold text-slate-700">{getDynamicCount(firm.id, 3)} Bekleyen</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    <Bell className="w-3 h-3" /> KEP/TEBLİGAT
                  </div>
                  <p className="text-[12px] font-bold text-slate-700">{getDynamicCount(firm.id, 5, 0)} Yeni</p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">AKTİF</span>
                </div>
                <Button variant="ghost" onClick={() => setDetailedFirm(firm)} className="h-9 text-[11px] font-black text-indigo-600 hover:bg-indigo-50 uppercase tracking-widest px-4 group/btn">
                  DETAYLI KART <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!detailedFirm} onOpenChange={(open) => !open && setDetailedFirm(null)}>
        <DialogContent className="sm:max-w-[700px] bg-slate-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-lg font-black text-slate-900 leading-tight block">{detailedFirm?.name}</span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-white">MÜKELLEF KARTI</Badge>
                  VKN: {detailedFirm?.vkn}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> KURUMSAL BİLGİLER</div>
                  <div className="space-y-3">
                     <div>
                       <span className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5">Vergi Dairesi</span>
                       <span className="font-medium text-slate-800">{detailedFirm?.vd || 'Belirtilmedi'}</span>
                     </div>
                     <div>
                       <span className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5">Sektör / Faaliyet</span>
                       <span className="font-medium text-slate-800">{detailedFirm?.sector || 'Belirtilmedi'}</span>
                     </div>
                  </div>
               </div>
               
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> İLETİŞİM & YÖNETİM</div>
                  <div className="space-y-3">
                     <div>
                       <span className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5">Yönetici / Yetkili</span>
                       <span className="font-medium text-slate-800">{detailedFirm?.manager || 'Belirtilmedi'}</span>
                     </div>
                     <div>
                       <span className="block text-[10px] uppercase text-slate-400 font-bold mb-0.5">Telefon / E-Posta</span>
                       <span className="font-medium text-slate-800">{detailedFirm?.contact || 'Belirtilmedi'}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> FİNANS & RİSK ÖZETİ</div>
              <div className="space-y-4">
                 <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                       <span className="block text-[11px] font-black text-slate-600 mb-1">Mizan Analiz Sonucu</span>
                       <span className="text-sm font-medium text-slate-600 leading-relaxed text-balance line-clamp-2" title={detailedFirm?.mizanSummary}>{detailedFirm?.mizanSummary || 'Özel bir finansal risk tespiti bulunamadı.'}</span>
                    </div>
                    <Badge className={`${detailedFirm?.risk === 'Kritik' ? 'bg-rose-100 text-rose-700' : detailedFirm?.risk === 'Yüksek' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'} border-none uppercase tracking-wider font-bold`}>{detailedFirm?.risk || 'DÜŞÜK RİSK'}</Badge>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
               <Button 
                 variant="outline" 
                 onClick={() => {
                   if (detailedFirm?.id) {
                     onFirmChange?.(detailedFirm.id);
                     onNavigate?.('declarations');
                   }
                 }}
                 className="w-full h-11 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold tracking-widest text-[10px] uppercase"
               >
                 <FileText className="w-3.5 h-3.5 mr-2" /> Beyannameler
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   if (detailedFirm?.id) {
                     onFirmChange?.(detailedFirm.id);
                     onNavigate?.('notifications');
                   }
                 }}
                 className="w-full h-11 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold tracking-widest text-[10px] uppercase"
               >
                 <Bell className="w-3.5 h-3.5 mr-2" /> KEP / Tebligat
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   if (detailedFirm?.id) {
                     onFirmChange?.(detailedFirm.id);
                     onNavigate?.('mizan-analiz'); 
                   }
                 }}
                 className="w-full h-11 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold tracking-widest text-[10px] uppercase"
               >
                 <Wallet className="w-3.5 h-3.5 mr-2" /> Mizan / Cari
               </Button>
            </div>
          </div>
          <DialogFooter className="bg-white border-t border-slate-100 pt-4 mt-2">
            <Button variant="outline" onClick={() => setDetailedFirm(null)} className="h-10 text-xs font-bold uppercase tracking-widest">KAPAT</Button>
            <Button 
              className="h-10 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                if (detailedFirm?.id) {
                  onFirmChange?.(detailedFirm.id);
                  onNavigate?.('home');
                }
              }}
            >
              <Search className="w-3.5 h-3.5 mr-2" /> PROFİLE GİT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
