import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Home, FileText, Users, BarChart3, Settings, Shield, Menu, Search, X, 
  MessageSquare, Plus, ArrowRight, Download, Link2, Copy, Volume2, Mic, 
  Pause, Building2, ChevronDown, Scale, FileSearch, ShieldAlert, Wallet, 
  Calculator, Newspaper, Scan, ShieldCheck, ClipboardList, Edit2, FileCheck, LogOut,
  Fingerprint, FileSignature, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FirmContextData } from '@/components/AiAssistant';
import { BrandLogo } from '@/components/BrandLogo';
import { auth } from '@/lib/firebase';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onOpenAiAssistant: () => void;
  onOpenSearch: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeFirm: FirmContextData | null;
  onFirmChange: (firmId: string) => void;
  firmsList: FirmContextData[];
  onLogout: () => void;
}

export function DashboardLayout({ children, onOpenAiAssistant, onOpenSearch, activeTab, onTabChange, activeFirm, onFirmChange, firmsList, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [auditMenuOpen, setAuditMenuOpen] = useState(false);
  const [mevzuatMenuOpen, setMevzuatMenuOpen] = useState(false);
  const [muhasebeMenuOpen, setMuhasebeMenuOpen] = useState(false);
  const [sistemMenuOpen, setSistemMenuOpen] = useState(false);
  const [mukellefMenuOpen, setMukellefMenuOpen] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageUrl, setNewPageUrl] = useState('');
  const [newPageDescription, setNewPageDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savedPages, setSavedPages] = useState<{name: string, url: string, description?: string}[]>([
    { name: 'ChatGPT', url: 'https://chatgpt.com/', description: 'Yapay Zeka Destek' }
  ]);
  const [rates, setRates] = useState<{ USD: number; EUR: number; updateDate: string }>({ USD: 0, EUR: 0, updateDate: '-' });

  React.useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/rates');
        const data = await res.json();
        
        if (data && data.USD) {
          setRates({
            USD: data.USD,
            EUR: data.EUR,
            updateDate: data.updateDate || new Date().toLocaleDateString('tr-TR')
          });
        }
      } catch (error) {
        console.error('Kurlar alınamadı:', error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleAddPage = () => {
    if (newPageName && newPageUrl) {
      if (editingIndex !== null) {
        const updated = [...savedPages];
        updated[editingIndex] = { name: newPageName, url: newPageUrl, description: newPageDescription };
        setSavedPages(updated);
        setEditingIndex(null);
      } else {
        setSavedPages([...savedPages, { name: newPageName, url: newPageUrl, description: newPageDescription }]);
      }
      setNewPageName('');
      setNewPageUrl('');
      setNewPageDescription('');
      setShowAddPage(false);
    }
  };

  const handleEdit = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNewPageName(savedPages[idx].name);
    setNewPageUrl(savedPages[idx].url);
    setNewPageDescription(savedPages[idx].description || '');
    setEditingIndex(idx);
    setShowAddPage(true);
    if (!sidebarOpen) setSidebarOpen(true);
  };


  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 md:relative ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
        } transition-all duration-300 ease-in-out bg-white flex flex-col items-center py-6 border-r border-slate-200 shrink-0 select-none shadow-sm`}
      >
        <div className="flex items-center w-full px-4 mb-8 justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${!sidebarOpen && 'hidden'}`}>
            <BrandLogo size="md" />
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-slate-900 tracking-wide" style={{ fontFamily: 'Georgia', fontSize: '15px', lineHeight: '18px' }}>Müşavir Al</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider">Denetim & Müşavirlik</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 w-full px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-4">
          <div className={`mt-2 mb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'GENEL' : '...'}
          </div>
          <NavItem icon={<Home />} label="Ana Kontrol Paneli" active={activeTab === 'home'} isOpen={sidebarOpen} onClick={() => onTabChange('home')} />

          <button 
            onClick={() => setMevzuatMenuOpen(!mevzuatMenuOpen)}
            className={`w-full mt-5 mb-1 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'justify-center'} hover:text-slate-800 transition-colors cursor-pointer group bg-transparent`}
          >
            <span>{sidebarOpen ? 'MEVZUAT & BEYANNAME' : 'MEV'}</span>
            {sidebarOpen && <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 group-hover:text-slate-600 ${mevzuatMenuOpen ? 'rotate-180' : ''}`} />}
          </button>
          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${mevzuatMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-0 pb-1">
              <NavItem isSubItem icon={<Newspaper />} label="Resmî Gazete Takibi" active={activeTab === 'resmi-gazete'} isOpen={sidebarOpen} onClick={() => onTabChange('resmi-gazete')} />
              <NavItem isSubItem icon={<Scale />} label="Vergi Danışmanlığı" active={activeTab === 'vergi-danismanligi'} isOpen={sidebarOpen} onClick={() => onTabChange('vergi-danismanligi')} />
              <NavItem isSubItem icon={<FileText />} label="Beyannameler" active={activeTab === 'declarations'} isOpen={sidebarOpen} onClick={() => onTabChange('declarations')} />
              <NavItem isSubItem icon={<Calculator />} label="KDV Kontrol Merkezi" active={activeTab === 'kdv-kontrol'} isOpen={sidebarOpen} onClick={() => onTabChange('kdv-kontrol')} />
              <NavItem isSubItem icon={<FileText />} label="Savunma Dilekçesi" active={activeTab === 'savunma-dilekcesi'} isOpen={sidebarOpen} onClick={() => onTabChange('savunma-dilekcesi')} />
              <NavItem isSubItem icon={<FileSearch />} label="Vergi İnceleme Dosyası" active={activeTab === 'inceleme-dosyalari'} isOpen={sidebarOpen} onClick={() => onTabChange('inceleme-dosyalari')} />
              <NavItem isSubItem icon={<BarChart3 />} label="Aylık Mükellef Raporu" active={activeTab === 'mukellef-raporlari'} isOpen={sidebarOpen} onClick={() => onTabChange('mukellef-raporlari')} />
            </div>
          </div>

          <button 
            onClick={() => setAuditMenuOpen(!auditMenuOpen)}
            className={`w-full mt-5 mb-1 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'justify-center'} hover:text-slate-800 transition-colors cursor-pointer group bg-transparent`}
          >
            <span>{sidebarOpen ? 'DENETİM, RİSK & YMM' : 'DEN'}</span>
            {sidebarOpen && <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 group-hover:text-slate-600 ${auditMenuOpen ? 'rotate-180' : ''}`} />}
          </button>
          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${auditMenuOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-0 pb-1">
              <NavItem isSubItem icon={<Shield />} label="Üçlü Denetim Motoru" active={activeTab === 'uclu-denetim'} isOpen={sidebarOpen} onClick={() => onTabChange('uclu-denetim')} />
              <NavItem isSubItem icon={<FileSearch />} label="İzaha Davet Analizi" active={activeTab === 'izaha-davet'} isOpen={sidebarOpen} onClick={() => onTabChange('izaha-davet')} />
              <NavItem isSubItem icon={<ShieldAlert />} label="Sahte Belge Emareleri" active={activeTab === 'sahte-belge'} isOpen={sidebarOpen} onClick={() => onTabChange('sahte-belge')} />
              <NavItem isSubItem icon={<Wallet />} label="Kasa Risk Analizi" active={activeTab === 'kasa-analizi'} isOpen={sidebarOpen} onClick={() => onTabChange('kasa-analizi')} />
              <NavItem isSubItem icon={<Fingerprint />} label="İç Kontrol & Hile Riski" active={activeTab === 'icer-kontrol-hile'} isOpen={sidebarOpen} onClick={() => onTabChange('icer-kontrol-hile')} />
              <NavItem isSubItem icon={<BarChart3 />} label="Risk ve Uyarı Merkezi" active={activeTab === 'reports'} isOpen={sidebarOpen} onClick={() => onTabChange('reports')} />
              <NavItem isSubItem icon={<Shield />} label="YMM Tasdik Kontrolü" active={activeTab === 'ymm-tasdik'} isOpen={sidebarOpen} onClick={() => onTabChange('ymm-tasdik')} />
              <NavItem isSubItem icon={<FileSignature />} label="Karşıt İnceleme Hazırlığı" active={activeTab === 'karsit-inceleme-hazirlik'} isOpen={sidebarOpen} onClick={() => onTabChange('karsit-inceleme-hazirlik')} />
              <NavItem isSubItem icon={<Calculator />} label="KDV İadesi Kontrolü" active={activeTab === 'kdv-iadesi'} isOpen={sidebarOpen} onClick={() => onTabChange('kdv-iadesi')} />
              <NavItem isSubItem icon={<ClipboardList />} label="KDV İade Hazırlık ve Dosya Kontrolü" active={activeTab === 'kdv-iade-hazirlik'} isOpen={sidebarOpen} onClick={() => onTabChange('kdv-iade-hazirlik')} />
              <NavItem isSubItem icon={<ShieldCheck />} label="Bağımsız Denetim Ön Kontrol" active={activeTab === 'denetim-on-kontrol'} isOpen={sidebarOpen} onClick={() => onTabChange('denetim-on-kontrol')} />
              <NavItem isSubItem icon={<BarChart3 />} label="Finansal Tablo Analizi" active={activeTab === 'finansal-tablo'} isOpen={sidebarOpen} onClick={() => onTabChange('finansal-tablo')} />
            </div>
          </div>

          <button 
            onClick={() => setMuhasebeMenuOpen(!muhasebeMenuOpen)}
            className={`w-full mt-5 mb-1 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'justify-center'} hover:text-slate-800 transition-colors cursor-pointer group bg-transparent`}
          >
            <span>{sidebarOpen ? 'MUHASEBE İŞLEMLERİ' : 'MUH'}</span>
            {sidebarOpen && <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 group-hover:text-slate-600 ${muhasebeMenuOpen ? 'rotate-180' : ''}`} />}
          </button>
          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${muhasebeMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-0 pb-1">
              <NavItem isSubItem icon={<Calculator />} label="Aylık KDV Beyanı" active={activeTab === 'kdv1-hazirlik-audit'} isOpen={sidebarOpen} onClick={() => onTabChange('kdv1-hazirlik-audit')} />
              <NavItem isSubItem icon={<Copy />} label="Mükerrer Kayıt Analizi" active={activeTab === 'mukerrer-kayit-analiz'} isOpen={sidebarOpen} onClick={() => onTabChange('mukerrer-kayit-analiz')} />
              <NavItem isSubItem icon={<Scan />} label="Akıllı Belge & OCR İşleme" active={activeTab === 'ocr'} isOpen={sidebarOpen} onClick={() => onTabChange('ocr')} />
              <NavItem isSubItem icon={<Calculator />} label="Banka Mutabakatı" active={activeTab === 'banka-mutabakat'} isOpen={sidebarOpen} onClick={() => onTabChange('banka-mutabakat')} />
              <NavItem isSubItem icon={<Search />} label="Banka Hareketleri" active={activeTab === 'banka-hareketleri'} isOpen={sidebarOpen} onClick={() => onTabChange('banka-hareketleri')} />
              <NavItem isSubItem icon={<FileCheck />} label="Tahakkuk İşlemleri" active={activeTab === 'tahakkuk-islemleri'} isOpen={sidebarOpen} onClick={() => onTabChange('tahakkuk-islemleri')} />
              <NavItem isSubItem icon={<Calculator />} label="Gider Kabul Kontrolü" active={activeTab === 'gider-kabul'} isOpen={sidebarOpen} onClick={() => onTabChange('gider-kabul')} />
              <NavItem isSubItem icon={<ClipboardList />} label="Beyanname Hazırlama" active={activeTab === 'beyanname-hazirlama'} isOpen={sidebarOpen} onClick={() => onTabChange('beyanname-hazirlama')} />
              <NavItem isSubItem icon={<Scan />} label="Hesap Kodu Atama" active={activeTab === 'hesap-kodu-atama'} isOpen={sidebarOpen} onClick={() => onTabChange('hesap-kodu-atama')} />
            </div>
          </div>

          <button 
            onClick={() => setMukellefMenuOpen(!mukellefMenuOpen)}
            className={`w-full mt-5 mb-1 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'justify-center'} hover:text-slate-800 transition-colors cursor-pointer group bg-transparent`}
          >
            <span>{sidebarOpen ? 'MÜKELLEF YÖNETİMİ' : 'MÜK'}</span>
            {sidebarOpen && <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 group-hover:text-slate-600 ${mukellefMenuOpen ? 'rotate-180' : ''}`} />}
          </button>
          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${mukellefMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-0 pb-1">
              <NavItem isSubItem icon={<Users />} label="Mükellef Yönetimi" active={activeTab === 'customers'} isOpen={sidebarOpen} onClick={() => onTabChange('customers')} />
            </div>
          </div>

          <div className={`mt-5 mb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'MERKEZLER' : '...'}
          </div>
          <NavItem icon={<ShieldCheck />} label="Kanıt Merkezi" active={activeTab === 'kanit-merkezi'} isOpen={sidebarOpen} onClick={() => onTabChange('kanit-merkezi')} />
          <NavItem icon={<Wallet />} label="Doküman Kasası" active={activeTab === 'dokuman-kasasi'} isOpen={sidebarOpen} onClick={() => onTabChange('dokuman-kasasi')} />
          <NavItem icon={<FileText />} label="Rapor Merkezi" active={activeTab === 'rapor-merkezi'} isOpen={sidebarOpen} onClick={() => onTabChange('rapor-merkezi')} />

          <button 
            onClick={() => setSistemMenuOpen(!sistemMenuOpen)}
            className={`w-full mt-5 mb-1 px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider ${!sidebarOpen && 'justify-center'} hover:text-slate-800 transition-colors cursor-pointer group bg-transparent`}
          >
            <span>{sidebarOpen ? 'SİSTEM & AYARLAR' : 'SİS'}</span>
            {sidebarOpen && <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 group-hover:text-slate-600 ${sistemMenuOpen ? 'rotate-180' : ''}`} />}
          </button>
          <div className={`overflow-hidden transition-all duration-200 ease-in-out ${sistemMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-0 pb-1">
              <NavItem isSubItem icon={<MessageSquare />} label="Bildirimler" active={activeTab === 'notifications'} isOpen={sidebarOpen} onClick={() => onTabChange('notifications')} />
              <NavItem isSubItem icon={<FileText />} label="Görevler" active={activeTab === 'tasks'} isOpen={sidebarOpen} onClick={() => onTabChange('tasks')} />
              <NavItem isSubItem icon={<ShieldCheck />} label="Veri Güvenliği & KVKK" active={activeTab === 'veri-guvenligi'} isOpen={sidebarOpen} onClick={() => onTabChange('veri-guvenligi')} />
              <NavItem isSubItem icon={<Users />} label="Kullanıcılar & Yetkiler" active={activeTab === 'kullanicilar'} isOpen={sidebarOpen} onClick={() => onTabChange('kullanicilar')} />
              <NavItem isSubItem icon={<Search />} label="Audit Log / İşlem Geçmişi" active={activeTab === 'audit-log'} isOpen={sidebarOpen} onClick={() => onTabChange('audit-log')} />
              <NavItem isSubItem icon={<Link2 />} label="Entegrasyonlar" active={activeTab === 'entegrasyonlar'} isOpen={sidebarOpen} onClick={() => onTabChange('entegrasyonlar')} />
              <NavItem isSubItem icon={<ShieldCheck />} label="Sistem Test & Kalite Paneli" active={activeTab === 'test-paneli'} isOpen={sidebarOpen} onClick={() => onTabChange('test-paneli')} />
              <NavItem isSubItem icon={<Settings />} label="Ayarlar" active={activeTab === 'settings'} isOpen={sidebarOpen} onClick={() => onTabChange('settings')} />
            </div>
          </div>

          <div className={`mt-6 mb-2 px-3 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-100 pt-5 ${!sidebarOpen && 'justify-center'}`}>
            <span>{sidebarOpen ? 'WEB SİTELERİM' : '...'}</span>
          </div>
          <NavItem 
            icon={<Globe />} 
            label="Kamu Portalları & Sitelerim" 
            active={activeTab === 'professional-portals'} 
            isOpen={sidebarOpen} 
            onClick={() => onTabChange('professional-portals')} 
          />
          
          {showAddPage && sidebarOpen && (
            <div className="px-3 mb-4 space-y-2">
              <input
                type="text"
                placeholder="Site Adı"
                className="w-full bg-slate-50 text-xs text-slate-900 px-2 py-1.5 rounded-md border border-slate-200 outline-none focus:border-blue-500 placeholder:text-slate-400"
                value={newPageName}
                onChange={e => setNewPageName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Açıklama"
                className="w-full bg-slate-50 text-xs text-slate-900 px-2 py-1.5 rounded-md border border-slate-200 outline-none focus:border-blue-500 placeholder:text-slate-400"
                value={newPageDescription}
                onChange={e => setNewPageDescription(e.target.value)}
              />
              <input
                type="url"
                placeholder="URL (https://...)"
                className="w-full bg-slate-50 text-xs text-slate-900 px-2 py-1.5 rounded-md border border-slate-200 outline-none focus:border-blue-500 placeholder:text-slate-400"
                value={newPageUrl}
                onChange={e => setNewPageUrl(e.target.value)}
              />
              <div className="flex gap-2 pt-1">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-[11px] font-semibold text-white py-1.5 rounded-md transition-colors"
                  onClick={handleAddPage}
                >
                  {editingIndex !== null ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  className="bg-transparent hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600 px-3 py-1.5 rounded-md transition-colors"
                  onClick={() => {
                    setShowAddPage(false);
                    setEditingIndex(null);
                    setNewPageName('');
                    setNewPageUrl('');
                    setNewPageDescription('');
                  }}
                >
                  İptal
                </button>
              </div>
            </div>
          )}

          {savedPages.map((page, idx) => (
             <a
               key={idx}
               href={page.url}
               target="_blank"
               rel="noopener noreferrer"
               className={`w-full flex flex-col justify-center px-3 py-2 mb-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors group relative ${!sidebarOpen && 'items-center px-0'}`}
             >
               {sidebarOpen ? (
                 <>
                   <div className="flex justify-between items-center w-full">
                     <span className="text-[13px] font-medium truncate pr-4">{page.name}</span>
                     <button
                       onClick={(e) => handleEdit(idx, e)}
                       className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-600"
                     >
                       <Edit2 className="w-3 h-3" />
                     </button>
                   </div>
                   {page.description && <span className="text-[11px] text-slate-500 truncate mt-0.5">{page.description}</span>}
                   <span className="text-[10px] text-slate-400 truncate mt-0.5 group-hover:text-slate-500 transition-colors">{page.url}</span>
                 </>
               ) : (
                 <span className="text-sm font-medium">{page.name.charAt(0)}</span>
               )}
             </a>
          ))}
        </nav>
        <div className="w-full px-3 mt-auto">
          <div className="mt-4 pt-4 border-t border-slate-100 pb-4">
            <div className={`flex items-center justify-between overflow-hidden ${!sidebarOpen && 'justify-center p-2'}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <BrandLogo size={sidebarOpen ? 'md' : 'sm'} />
                {sidebarOpen && (
                  <div className="flex flex-col whitespace-nowrap overflow-hidden">
                    <p className="text-sm font-semibold text-slate-900 truncate">{auth.currentUser?.displayName || "Orhan Polat"}</p>
                    <p className="text-xs text-slate-500">{auth.currentUser?.email ? "Sistem Kullanıcısı" : "Mali Müşavir"}</p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
            {!sidebarOpen && (
               <button 
                  onClick={onLogout}
                  className="w-full mt-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex justify-center"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-5 h-5 text-rose-500" />
                </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 bg-[#f8f9fa]">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-2 sm:px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] shrink-0 z-10 w-full">
          <div className="flex flex-1 items-center gap-2 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            {/* Mercek Arama */}
            <div className="max-w-[400px] w-full">
             <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all h-10 px-3 cursor-text" onClick={onOpenSearch}>
               <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
               <span className="text-slate-600 text-[15px]">KDV</span>
             </div>
            </div>

             {/* Currency Rates */}
             <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium">
               <div className="flex gap-1.5 items-center">
                 <span className="text-slate-500">USD</span>
                 {rates.USD === 0 ? (
                    <div className="h-4 w-10 bg-slate-200 animate-pulse rounded" />
                 ) : (
                    <span className="text-emerald-600">{rates.USD.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
                 )}
               </div>
               <div className="w-px h-4 bg-slate-300"></div>
               <div className="flex gap-1.5 items-center">
                 <span className="text-slate-500">EUR</span>
                 {rates.EUR === 0 ? (
                    <div className="h-4 w-10 bg-slate-200 animate-pulse rounded" />
                 ) : (
                    <span className="text-emerald-600">{rates.EUR.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
                 )}
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
             {/* Güvenli Mod Aktif */}
             <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-xs font-semibold tracking-wide">Güvenli Mod Aktif</span>
             </div>

             {/* Bağlam / Firma Seçici */}
             <div className="hidden lg:flex items-center bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-2 min-w-[200px]">
               <select 
                 className="bg-transparent text-[15px] font-medium outline-none text-slate-800 cursor-pointer flex-1 truncate max-w-full appearance-none pr-6"
                 value={activeFirm?.id || ""}
                 onChange={(e) => onFirmChange(e.target.value)}
                 style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '1.2em' }}
               >
                 <option value="">-- Tüm Firmalar (Genel) --</option>
                 {firmsList.map(f => (
                   <option key={f.id} value={f.id}>{f.name}</option>
                 ))}
               </select>
             </div>

             <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-colors" onClick={() => toast.info('Henüz okunmamış bildiriminiz bulunmuyor.')}>
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
               <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
             </div>
             
             <Button variant="default" className="gap-2 shadow-md bg-blue-600 hover:bg-blue-700 w-auto group transition-all rounded-lg px-4 py-2.5 h-10" onClick={onOpenAiAssistant}>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.68-1.25 1.5A2 2 0 0 1 19 5.8l-1.5 1.25a2 2 0 0 1 0 3.08l1.5 1.25a2 2 0 0 1 .39.62l1.25 1.5a2 2 0 0 1 0 2.5l-1.25 1.5a2 2 0 0 1-.39.62l-1.5 1.25a2 2 0 0 1-3.08 0l-1.25-1.5a2 2 0 0 1-.62-.39l-1.5-1.25a2 2 0 0 1 0-3.08l1.25-1.5a2 2 0 0 1 .62-.39l1.5-1.25a2 2 0 0 1 3.08 0z"/><path d="m14 14-8.83 8.83a2 2 0 0 1-2.82-2.82L11 11"/></svg>
               <span className="hidden sm:inline font-semibold text-[15px]">Akıllı Asistan</span>
             </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, isOpen, isSubItem, onClick }: { icon: React.ReactNode; label: string; active?: boolean; isOpen: boolean; isSubItem?: boolean; onClick?: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start flex group ${
        active 
          ? 'bg-blue-50/80 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-semibold shadow-sm' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
      } ${!isOpen ? 'px-0 justify-center' : (isSubItem ? 'pl-8 pr-2' : 'px-3')} gap-2.5 ${isSubItem ? 'h-8' : 'h-9'} rounded-lg mb-0.5 cursor-pointer transition-colors`}
      title={label}
    >
      <div className={`shrink-0 flex items-center justify-center ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: isSubItem ? 'w-3.5 h-3.5 opacity-90' : 'w-4 h-4' } as any)}
      </div>
      {isOpen && <span className={`${isSubItem ? 'text-[12px] tracking-tight' : 'text-[13.5px]'} whitespace-nowrap overflow-hidden text-ellipsis`}>{label}</span>}
    </Button>
  );
}
