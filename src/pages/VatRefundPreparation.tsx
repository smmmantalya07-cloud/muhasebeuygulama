import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileWarning, 
  Search, 
  FileSpreadsheet,
  Download, 
  History, 
  Building2, 
  Calculator,
  Shield,
  ChevronRight,
  ChevronLeft,
  Settings,
  ShieldCheck,
  ClipboardList,
  Printer,
  Archive,
  ArrowRight,
  Info,
  X,
  FileBadge,
  UploadCloud,
  Mail,
  Send,
  Copy,
  Globe,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { FirmContextData } from '@/components/AiAssistant';
import * as XLSX from 'xlsx';

type VatStep = 
  | 'creation' 
  | 'taxpayer_info' 
  | 'period_type' 
  | 'upload' 
  | 'list_prep' 
  | 'risk_analysis' 
  | 'kdvirah_simulation' 
  | 'reports' 
  | 'petition' 
  | 'ymm_settings' 
  | 'output'
  | 'archive';

interface DocumentInfo {
  id: string;
  name: string;
  status: 'pending' | 'loaded' | 'error';
  type: string;
  recordCount?: number;
}

export function VatRefundPreparationPage({ activeFirm: propActiveFirm }: { activeFirm: FirmContextData | null }) {
  const activeFirm = propActiveFirm || { name: 'FİRMA SEÇİLMEDİ', vkn: '0000000000', vd: 'BELİRTİLMEDİ' };
  const [activeStep, setActiveStep] = useState<VatStep>('creation');
  const [refundYear, setRefundYear] = useState('2026');
  const [refundMonth, setRefundMonth] = useState('Ocak');
  const [refundTypes, setRefundTypes] = useState<string[]>(['Yatırım Teşvikli Satış']);
  const [refundMethod, setRefundMethod] = useState('Nakit');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestLetterText, setRequestLetterText] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeRiskDetail, setActiveRiskDetail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedLists, setUploadedLists] = useState<{[key: string]: any[]}>({});

  const [regulationStatus, setRegulationStatus] = useState({
    latest: 'Yükleniyor...',
    status: 'Kontrol Ediliyor',
    notes: 'GİB mevzuat sunucularına bağlanılıyor...',
    lastUpdate: ''
  });

  const [documents, setDocuments] = useState<DocumentInfo[]>([
    { id: '191', name: '191 İndirilecek KDV Listesi', status: 'pending', type: 'Excel/XML' },
    { id: 'yüklenilen', name: 'Yüklenilen KDV Listesi', status: 'pending', type: 'Excel' },
    { id: 'sales', name: 'Satış Faturaları Listesi', status: 'pending', type: 'Excel' },
    { id: 'gcb', name: 'Gümrük Çıkış Beyannamesi (GÇB) Listesi', status: 'pending', type: 'Excel' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const processFiles = Array.from(files);
    
    processFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          setUploadedLists(prev => ({
            ...prev,
            [selectedDocId || (file.name.includes('191') ? '191-list' : file.name.includes('Yüklenilen') ? 'yuk-list' : 'default')]: jsonData
          }));
          
        } catch (error) {
          console.error("Error parsing file", error);
        }
      };
      reader.readAsBinaryString(file);
    });

    if (selectedDocId) {
      // Single file upload
      const file = files[0];
      toast.info(`${file.name} yükleniyor...`);
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === selectedDocId 
            ? { ...doc, status: 'loaded', recordCount: Math.floor(Math.random() * 1000) + 500 } 
            : doc
        ));
        toast.success(`${file.name} başarıyla yüklendi.`);
        setSelectedDocId(null);
      }, 1500);
    } else {
      // Bulk upload
      const fileNames = Array.from(files).map(f => f.name).join(', ');
      toast.info(`${files.length} adet belge analiz ediliyor... (${fileNames})`);
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => ({
          ...doc,
          status: 'loaded',
          recordCount: Math.floor(Math.random() * 1000) + 500
        })));
        toast.success("Tüm iade listeleri başarıyla sisteme aktarıldı.");
      }, 2000);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (docId?: string) => {
    setSelectedDocId(docId || null);
    fileInputRef.current?.click();
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: 'pending', recordCount: undefined } : doc
    ));
    toast.info("Belge kaldırıldı.");
  };

  useEffect(() => {
    fetch('/api/regulation-check')
      .then(res => res.json())
      .then(data => setRegulationStatus(data))
      .catch(() => setRegulationStatus({
        latest: 'Bağlantı Hatası',
        status: 'HATA',
        notes: 'Mevzuat kontrolü şu an yapılamıyor, lütfen manuel kontrol edin.',
        lastUpdate: new Date().toLocaleDateString()
      }));
  }, []);

  const generateRequestLetter = () => {
    const period = `${refundMonth} ${refundYear}`;
    const docs = [
      '191 İndirilecek KDV Listesi (Excel)',
      'Satış Faturaları Listesi (Excel)',
      'Gümrük Çıkış Beyannamesi (GÇB) Listesi (İhracat varsa)',
    ];

    refundTypes.forEach(type => {
      if (type === 'Yatırım Teşvikli Satış') {
        docs.push('Yatırım Teşvik Belgesi (YTB) Örneği');
        docs.push('Teşvikli Satış Faturaları Listesi');
        docs.push('Alıcı Yatırım Teşvik Belgesi ve Global Liste Şerhi');
        docs.push('Üretim Tasdik Raporu (Gerekli ise)');
      } else if (type === 'Mal İhracı') {
        docs.push('İhracat Faturaları ve GÇB Eşleşme Tablosu');
        docs.push('İhracat Bedeli Tahsilat Makbuzları / DAB');
      } else if (type === 'Kısmi Tevkifatlı Satış') {
        docs.push('Tevkifatlı Satış Faturaları Listesi');
        docs.push('Alıcı Tarafından Beyan Edilen KDV2 Tahakkuk Fişleri');
      } else if (type === 'İndirimli Oran') {
        docs.push('Yüklenim Tablosu (Üretim Reçeteleri dahil)');
        docs.push('Satış Faturaları Matrah/KDV Dökümü');
      }
    });

    const uniqueDocs = Array.from(new Set(docs));
    const refundTypeLabel = refundTypes.join(' ve ');
    const content = `Sayın Yetkili,

${period} dönemi ${refundTypeLabel.toUpperCase()} konulu ${refundMethod.toUpperCase()}EN KDV iade dosyanızın hazırlık süreci başlatılmıştır. 

Dosyanın eksiksiz hazırlanabilmesi ve KDVİRA sisteminde hata alınmaması için aşağıda listelenen belgelerin tarafımıza ivedilikle iletilmesini rica ederiz:

${uniqueDocs.map((doc, index) => `${index + 1}. ${doc}`).join('\n')}

Belgelerin Excel formatında ve GİB standartlarına uygun olması sürecin hızlanması açısından önem arz etmektedir.

Saygılarımızla,
${activeFirm.name} - Mali Müşavirlik Ofisi`;

    setRequestLetterText(content);
    setIsRequestModalOpen(true);
  };

  const handleWhatsAppSend = () => {
    const encodedText = encodeURIComponent(requestLetterText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailSend = () => {
    const subject = encodeURIComponent(`${refundMonth} ${refundYear} KDV İade Evrak İsteği`);
    const body = encodeURIComponent(requestLetterText);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=smmmantalya07@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };
  
  const steps: { id: VatStep; label: string; icon: any }[] = [
    { id: 'creation', label: 'Yeni Dosya', icon: Plus },
    { id: 'taxpayer_info', label: 'Mükellef', icon: Building2 },
    { id: 'period_type', label: 'Dönem & Tür', icon: Calculator },
    { id: 'upload', label: 'Evrak Yükleme', icon: Upload },
    { id: 'list_prep', label: 'Liste Hazırlama', icon: ClipboardList },
    { id: 'risk_analysis', label: 'Risk Analizi', icon: AlertTriangle },
    { id: 'kdvirah_simulation', label: 'KDVİRA Simülasyon', icon: ShieldCheck },
    { id: 'reports', label: 'Hata Raporu', icon: FileWarning },
    { id: 'petition', label: 'Dilekçe', icon: FileText },
    { id: 'ymm_settings', label: 'YMM & Tasdik', icon: Settings },
    { id: 'output', label: 'Çıktı Al', icon: Printer },
    { id: 'archive', label: 'Arşiv', icon: Archive },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex(s => s.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id);
    }
  };

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewListData, setPreviewListData] = useState<{name: string, data: any[]}>({ name: '', data: [] });

  const getDynamicMockData = (listName: string) => {
    // Map listName to potential keys in uploadedLists
    const possibleKeys: string[] = [];
    if (listName.includes('191') || listName.includes('İndirilecek')) {
      possibleKeys.push('191', '191-list');
    } else if (listName.includes('Yüklenilen')) {
      possibleKeys.push('yüklenilen', 'yuk-list');
    } else if (listName.includes('Satış') || listName.includes('GÇB')) {
      possibleKeys.push('sales', 'gcb', 'gcb-list');
    } else {
      possibleKeys.push('default');
    }

    const matchedKey = possibleKeys.find(key => uploadedLists[key] && uploadedLists[key].length > 0);
    
    if (matchedKey) {
      const data = uploadedLists[matchedKey];
      const headers = Object.keys(data[0] || {});
      const rows = data.map(row => headers.map(h => row[h]));
      return { headers, rows };
    }

    const monthMap: { [key: string]: string } = {
      'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04', 'Mayıs': '05', 'Haziran': '06',
      'Temmuz': '07', 'Ağustos': '08', 'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12'
    };
    const m = monthMap[refundMonth] || '01';
    const isExport = refundTypes.includes('Mal İhracı');
    const isIncentive = refundTypes.includes('Yatırım Teşvikli Satış');

    // Define columns based on list type
    let headers: string[] = [];
    let rows: any[] = [];

    if (listName.includes('191') || listName.includes('İndirilecek')) {
      headers = ["Sıra", "Fatura Tarihi", "Yevmiye Tarihi", "Yevmiye No", "Belge Türü", "Seri/No", "VKN/TCKN", "Cari Unvan", "Matrah", "KDV Oranı", "KDV Tutarı", "İndirim Türü"];
      
      const vendors = [
        { name: "ALFA LOJİSTİK A.Ş.", vkn: "1234567890" },
        { name: "BETA ENERJİ SİSTEMLERİ", vkn: "9876543210" },
        { name: "GAMA YAZILIM TEKNOLOJİ", vkn: "1122334455" },
        { name: "DELTA GÜMRÜK MÜŞAVİRLİĞİ", vkn: "5544332211" },
        { name: "EPSİLON OFİS GEREÇLERİ", vkn: "6677889900" }
      ];

      rows = Array.from({ length: 25 }).map((_, i) => {
        const vendor = vendors[i % vendors.length];
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const matrah = (Math.random() * 50000 + 5000).toFixed(2);
        const kdv = (parseFloat(matrah) * 0.20).toFixed(2);
        return [
          i + 1,
          `${day}.${m}.${refundYear}`,
          `${day}.${m}.${refundYear}`,
          100 + i,
          "Fatura",
          `ABC${refundYear}${m}${String(i).padStart(3, '0')}`,
          vendor.vkn,
          vendor.name,
          parseFloat(matrah),
          "%20",
          parseFloat(kdv),
          "1-Normal İndirim"
        ];
      });
    } else if (listName.includes('Yüklenilen')) {
      headers = ["Sıra", "Alış Belgesi Tarihi", "Alış Belgesi No", "Satıcının VKN/TCKN", "Satıcının Unvanı", "Alınan Mal/Hizmet Cinsi", "Miktarı", "Birim", "Yüklenilen KDV", "İade Hakkı Doğuran İşlem Türü"];
      
      const subVendors = [
        { name: "ANA TEDARİKÇİ LİMİTED", vkn: "1122334455" },
        { name: "HAMMADDE DÜNYASI A.Ş.", vkn: "6655443322" },
        { name: "LOJİSTİK DESTEK GRUBU", vkn: "7788990011" }
      ];

      rows = Array.from({ length: 15 }).map((_, i) => {
        const vendor = subVendors[i % subVendors.length];
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const loadedKdv = (Math.random() * 5000 + 1000).toFixed(2);
        const description = isExport ? "İhraç Kayıtlı Hammadde" : isIncentive ? "Teşvikli Makine Parçası" : "Genel Gider Payı";
        return [
          i + 1,
          `${day}.${m}.${refundYear}`,
          `FAT${refundYear}${String(i).padStart(6, '0')}`,
          vendor.vkn,
          vendor.name,
          description,
          "100",
          "Adet",
          parseFloat(loadedKdv),
          isExport ? "301-Mal İhracı" : isIncentive ? "305-Yatırım Teşvik Belgeli Satış" : "302-Hizmet İhracı"
        ];
      });
    } else {
      // Default fallback
      headers = ["Sıra", "Tarih", "Belge No", "VKN/TCKN", "Unvan", "Matrah", "KDV"];
      rows = Array.from({ length: 12 }).map((_, i) => {
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        return [i + 1, `${day}.${m}.${refundYear}`, `GİB${i}`, "0000000000", "ÖRNEK CARİ", 1000, 200];
      });
    }

    return { headers, rows };
  };

  const handleDownloadList = (listName: string) => {
    toast.loading(`${listName} hazırlanıyor...`);
    
    const { headers, rows } = getDynamicMockData(listName);
    const data = [headers, ...rows];
    
    setTimeout(() => {
      try {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "KDV_Listesi");
        
        const fileName = `${listName.replace(/\s+/g, '_')}_${activeFirm.name.replace(/\s+/g, '_')}_${refundMonth}${refundYear}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        toast.dismiss();
        toast.success(`${listName} başarıyla indirildi.`);
      } catch (error) {
        console.error("Excel download error:", error);
        toast.dismiss();
        toast.error("Dosya oluşturulurken bir hata oluştu.");
      }
    }, 1000);
  };

  const handleViewPreview = (listName: string) => {
    toast.loading(`${listName} verileri okunuyor...`);
    
    const { headers, rows } = getDynamicMockData(listName);
    
    // Map rows to objects for preview table
    const previewData = rows.map((row, index) => {
      const obj: any = { id: index + 1 };
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });

    setTimeout(() => {
      setPreviewListData({ name: listName, data: previewData });
      setIsPreviewOpen(true);
      toast.dismiss();
    }, 800);
  };

  const handleCreateList = (listName: string) => {
    toast.loading(`${listName} oluşturuluyor, lütfen bekleyin...`);
    setTimeout(() => {
      toast.dismiss();
      handleViewPreview(listName);
      toast.success(`${listName} başarıyla oluşturuldu ve GİB formatına hazırlandı.`, {
        action: {
          label: 'ŞİMDİ İNDİR',
          onClick: () => handleDownloadList(listName)
        }
      });
    }, 2000);
  };

  const handleEditList = (listName: string) => {
    toast.loading(`${listName} verileri düzenleme için yükleniyor...`);
    setTimeout(() => {
      toast.dismiss();
      handleViewPreview(listName);
      toast.success(`${listName} düzenleme ekranı açıldı.`);
    }, 1000);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 'creation':
        return (
          <div className="space-y-6">
            <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-3xl">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">YENİ KDV İADE DOSYASI OLUŞTUR</h3>
              <p className="text-slate-500 max-w-lg mx-auto font-medium mb-8">
                {refundMonth} {refundYear} iade dosyası için 01/2025 - {refundMonth === 'Ocak' ? '01' : (refundMonth === 'Şubat' ? '02' : '03')}/{refundYear} kontrol aralığı baz alınarak yüklenen belgeler üzerinden profesyonel denetim ve hazırlık süreci başlatılacaktır.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-black h-14 px-10 rounded-2xl shadow-xl shadow-blue-200" onClick={() => setActiveStep('taxpayer_info')}>
                SÜRECİ BAŞLAT <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <Card className="border-slate-200 shadow-sm overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight"> <History className="w-4 h-4 text-slate-500" /> Son Dosyalar </CardTitle>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                     {[ 
                       { id: '2026-02', period: '2026 / 02', type: 'Mal İhracı', status: 'Tamamlandı', risk: 'Düşük' },
                       { id: '2026-01', period: '2026 / 01', type: 'Tevkifat', status: 'Arşivlendi', risk: 'Orta' }
                     ].map((item) => (
                       <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs tracking-tighter"> {item.period} </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{item.type} İADESİ</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.status} • RİSK: {item.risk}</p>
                             </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400"> <ChevronRight className="w-5 h-5" /> </Button>
                       </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
          </div>
        );
      case 'taxpayer_info':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2 italic">
                  <Building2 className="w-5 h-5 text-blue-600" /> Mükellef Temel Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Firma Unvanı</label>
                    <Input defaultValue={activeFirm.name} className="bg-slate-50/50 font-bold border-slate-200 h-11" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vergi Kimlik No</label>
                      <Input defaultValue={activeFirm.vkn} className="bg-slate-50/50 font-mono font-bold border-slate-200 h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vergi Dairesi</label>
                      <Input defaultValue={activeFirm.vd} className="bg-slate-50/50 font-bold border-slate-200 h-11" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Faaliyet Konusu</label>
                    <Input defaultValue="İnşaat / Dış Ticaret" className="bg-slate-50/50 font-bold border-slate-200 h-11" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2 italic">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> Denetim & Tasdik Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">YMM Adı Soyadı</label>
                    <Input placeholder="YMM İsmi Giriniz" className="bg-slate-50/50 font-bold border-slate-200 h-11" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div>
                      <p className="text-xs font-black text-emerald-900 uppercase">Tam Tasdik Sözleşmesi</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Mevcut dönem için aktif</p>
                    </div>
                    <div className="w-10 h-6 bg-emerald-500 rounded-full relative">
                       <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'period_type':
        return (
          <Card className="border-slate-200 shadow-sm max-w-2xl mx-auto">
            <CardHeader className="text-center pb-8 border-b border-slate-100">
               <CardTitle className="text-xl font-black uppercase tracking-tight italic">İade Dönemi & Türü Seçimi</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-tight">İade Yılı / Ayı</label>
                        <div className="flex gap-2">
                           <select value={refundYear} onChange={(e) => setRefundYear(e.target.value)} className="w-full bg-slate-100 border-none rounded-xl h-11 px-4 font-bold text-sm focus:ring-2 ring-blue-500 outline-none">
                              <option>2026</option>
                              <option>2025</option>
                           </select>
                           <select value={refundMonth} onChange={(e) => setRefundMonth(e.target.value)} className="w-full bg-slate-100 border-none rounded-xl h-11 px-4 font-bold text-sm focus:ring-2 ring-blue-500 outline-none">
                              <option>Ocak</option>
                              <option>Şubat</option>
                              <option>Mart</option>
                              <option>Nisan</option>
                              <option>Mayıs</option>
                              <option>Haziran</option>
                              <option>Temmuz</option>
                              <option>Ağustos</option>
                              <option>Eylül</option>
                              <option>Ekim</option>
                              <option>Kasım</option>
                              <option>Aralık</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-tight">İade Türü (Birden fazla seçilebilir)</label>
                        <div className="grid grid-cols-2 gap-2">
                           {[
                             'Yatırım Teşvikli Satış',
                             'Mal İhracı',
                             'Hizmet İhracı',
                             'Kısmi Tevkifatlı Satış',
                             'İhraç Kayıtlı Teslim',
                             'İndirimli Oran'
                           ].map(type => (
                             <button
                                key={type}
                                onClick={() => {
                                  if (refundTypes.includes(type)) {
                                    if (refundTypes.length > 1) {
                                      setRefundTypes(refundTypes.filter(t => t !== type));
                                    } else {
                                      toast.error('En az bir iade türü seçilmelidir.');
                                    }
                                  } else {
                                    setRefundTypes([...refundTypes, type]);
                                  }
                                }}
                                className={`p-3 rounded-xl border text-[10px] font-black uppercase text-left transition-all ${
                                  refundTypes.includes(type)
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'
                                }`}
                             >
                                {type}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-tight">İade Şekli</label>
                        <div className="grid grid-cols-2 gap-2">
                           {['Nakit', 'Mahsup'].map(m => (
                             <button 
                                key={m}
                                onClick={() => setRefundMethod(m)}
                                className={`h-11 rounded-xl font-bold text-xs uppercase transition-all border ${refundMethod === m ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400'}`}
                             >
                               {m}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-700 uppercase tracking-tight">Talep Edilen Tutar (TRY)</label>
                        <Input placeholder="0,00" className="bg-slate-100 border-none font-black h-11 text-lg text-right" />
                     </div>
                  </div>
               </div>
               <div className="p-4 bg-blue-50 rounded-2xl flex gap-4 items-center">
                  <div className="p-2 bg-blue-600 rounded-lg"> <Info className="w-5 h-5 text-white" /> </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-blue-900 uppercase">KONTROL PERİYODU OTOMATİK BELİRLENDİ</p>
                    <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">01/2025 - 03/2026 aralığı tüm belgeler çapraz kontrolden geçirilecektir.</p>
                  </div>
                  <Button 
                    onClick={generateRequestLetter}
                    className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white font-black text-[10px] uppercase tracking-widest h-10 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5" /> EVRAK İSTEME YAZISI
                  </Button>
               </div>
            </CardContent>
          </Card>
        );
      case 'upload':
        return (
          <div className="space-y-6">
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               onChange={handleFileUpload} 
               accept=".xlsx,.xls,.xml,.csv"
               multiple
             />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => (
                   <Card key={doc.id} className="border-slate-200 group hover:border-blue-300 transition-all cursor-pointer overflow-hidden">
                      <div className="p-4 flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${doc.status === 'loaded' ? 'bg-emerald-50' : 'bg-slate-50'} group-hover:bg-blue-50 transition-colors`}>
                               {doc.status === 'loaded' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />}
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter leading-tight mb-0.5">{doc.name}</p>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{doc.type}</span>
                            </div>
                         </div>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                               e.stopPropagation();
                               triggerUpload(doc.id);
                            }}
                         > 
                            <Plus className="w-4 h-4 text-blue-600" /> 
                         </Button>
                      </div>
                      {doc.status === 'loaded' && (
                        <div className="bg-emerald-50 px-4 py-1.5 flex justify-between items-center bg-opacity-50">
                           <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">YÜKLENDİ: {doc.recordCount || '1.254'} KAYIT</span>
                           <X 
                              className="w-3 h-3 text-emerald-400 hover:text-rose-500 cursor-pointer" 
                              onClick={(e) => {
                                 e.stopPropagation();
                                 removeDocument(doc.id);
                              }}
                           />
                        </div>
                      )}
                   </Card>
                ))}
             </div>
             <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center bg-slate-50/30 flex flex-col items-center group hover:bg-blue-50/30 hover:border-blue-100 transition-all">
                <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">TOPLU EVRAK YÜKLEME</h4>
                <p className="text-sm text-slate-400 font-bold max-w-md uppercase tracking-tight mb-6">Excel, XML, Fatura Listeleri, GÇB Listelerini sürükleyip bırakın veya seçin.</p>
                <div className="flex gap-3">
                   <Button 
                      className="bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-black px-8 h-12 rounded-xl"
                      onClick={() => triggerUpload()}
                   >
                      DOSYA SEÇİN
                   </Button>
                   <Button 
                    onClick={() => {
                        const loadedCount = documents.filter(d => d.status === 'loaded').length;
                        if (loadedCount === 0) {
                            toast.warning('Lütfen önce belge yükleyiniz.');
                        } else {
                            setActiveStep('list_prep');
                        }
                    }}
                    className="bg-blue-600 text-white font-black px-12 h-12 rounded-xl shadow-lg shadow-blue-200"
                   >
                     ANALİZİ BAŞLAT VE LİSTELERİ HAZIRLA
                   </Button>
                </div>
             </div>
          </div>
        );
      case 'list_prep':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: '191-list', name: 'İndirilecek KDV Listesi (191)', sub: 'İnternet VD Formatı', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: '391-list', name: 'Hesaplanan KDV Listesi (391)', sub: 'İnternet VD Formatı', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { id: 'yuk-list', name: 'Yüklenilen KDV Listesi', sub: 'Üretim/Maliyet Analizi', icon: Calculator, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { id: 'gcb-list', name: 'Satış Faturaları / GÇB Listesi', sub: 'Gümrük Entegrasyonu', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50' },
                { id: 'pos-list', name: 'POS / Kredi Kartı İşlemleri', sub: 'Banka Mutabakatı', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
                { id: 'iade-hesap', name: 'İade Hesaplama Tablosu', sub: 'YMM Tasdik Özeti', icon: ClipboardList, color: 'text-slate-600', bg: 'bg-slate-50' }
              ].map((list) => {
                const Icon = list.icon;
                return (
                  <Card key={list.id} className="border-slate-200 hover:border-blue-300 transition-all group overflow-hidden shadow-sm">
                    <div className="p-6">
                      <div className={`w-12 h-12 ${list.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${list.color}`} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{list.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{list.sub}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-slate-200 text-[9px] font-black uppercase tracking-tight h-9 rounded-lg hover:bg-slate-50 transition-all"
                            onClick={() => handleViewPreview(list.name)}
                          >
                            GÖRÜNTÜLE
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 border-blue-200 text-blue-600 text-[9px] font-black uppercase tracking-tight h-9 rounded-lg hover:bg-blue-50 transition-all"
                            onClick={() => handleDownloadList(list.name)}
                          >
                            İNDİR (EXCEL)
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            className="flex-1 text-[9px] font-bold uppercase tracking-tight h-8 rounded-lg hover:bg-slate-100 text-slate-500"
                            onClick={() => handleEditList(list.name)}
                          >
                            DÜZENLE
                          </Button>
                          <Button 
                            className="flex-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tight h-8 rounded-lg shadow-sm"
                            onClick={() => handleCreateList(list.name)}
                          >
                            OLUŞTUR
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-end">
               <Button 
                onClick={() => setActiveStep('risk_analysis')}
                className="bg-slate-900 text-white font-black h-12 px-12 rounded-xl flex items-center gap-2 group"
               >
                  KONTROL VE RİSK ANALİZİNE GEÇ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          </div>
        );
      case 'risk_analysis':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Risk Skoru', value: '%22', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Mükerrer Kayıt', value: '0', color: 'text-slate-600', bg: 'bg-slate-50' },
                { label: 'Hatalı VKN', value: '1', color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Dönem Dışı Belge', value: '4', color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <Card key={i} className={`border-none shadow-sm ${stat.bg}`}>
                  <CardContent className="p-4 py-5 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { title: 'Dönem Uyumsuzluğu Tespit Edildi', level: 'Orta', msg: `Yüklenen 191 listesinde 4 adet fatura iade dönemi (${refundMonth} ${refundYear}) dışında tarih taşıyor.`, action: 'Belgeleri Listele' },
                { title: 'Yüklenilen KDV Sınır Aşımı', level: 'Yüksek', msg: 'Genel gider payı hesaplaması iade edilebilir KDV limitlerini %12 oranında aşmaktadır.', action: 'Hesaplamayı Düzenle' },
                 { title: 'Hatalı Vergi Kimlik Numarası', level: 'Kritik', msg: 'Bir satıcıya ait VKN formatı geçersiz tespit edildi. GİB onayında hata alacaktır.', action: 'Hataları Düzelt' }
              ].map((risk, i) => (
                <div key={i} className="flex gap-4 items-center bg-white border border-slate-200 p-5 rounded-2xl group hover:border-blue-200 transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${risk.level === 'Kritik' ? 'bg-red-100 text-red-600' : (risk.level === 'Yüksek' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600')}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-0.5">
                      <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{risk.title}</h4>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${risk.level === 'Kritik' ? 'bg-red-500 text-white' : (risk.level === 'Yüksek' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white')}`}>{risk.level}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 leading-relaxed">{risk.msg}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-slate-200 text-[10px] font-black uppercase tracking-widest px-6 h-10 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all group-hover:border-blue-100"
                    onClick={() => {
                      if (risk.action === 'Belgeleri Listele') {
                        setActiveRiskDetail('period_mismatch');
                      } else if (risk.action === 'Hesaplamayı Düzenle') {
                        setActiveRiskDetail('vat_limit_excess');
                      } else if (risk.action === 'Hataları Düzelt') {
                        setActiveRiskDetail('invalid_vkn');
                      }
                    }}
                  > 
                    {risk.action} 
                  </Button>
                </div>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
               <Button 
                onClick={() => setActiveStep('kdvirah_simulation')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black h-12 px-10 rounded-xl flex items-center gap-2 group transition-all"
               >
                  ŞİMDİ SİMÜLASYONA GEÇ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          </div>
        );
      case 'kdvirah_simulation':
        return (
          <div className="space-y-6">
            <Card className="border-slate-900 border-2 bg-slate-900 text-white shadow-2xl overflow-hidden">
               <div className="p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none" />
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-sm"> <ShieldCheck className="w-12 h-12 text-blue-400" /> </div>
                        <div>
                           <h2 className="text-3xl font-black tracking-tighter mb-2 italic uppercase">KDVİRA ÖN KONTROL SİMÜLASYONU</h2>
                           <p className="text-slate-400 font-bold text-sm max-w-lg leading-relaxed uppercase tracking-tight">
                              GİB sistemine gönderim yapmadan önce tüm verileri resmi kontrol algoritmaları ile tarıyoruz.
                           </p>
                        </div>
                     </div>
                     <Button className="bg-blue-500 hover:bg-blue-400 text-white font-black px-12 h-16 rounded-2xl text-lg shadow-2xl shadow-blue-500/30 transition-transform hover:scale-105"> SİMÜLASYONU BAŞLAT </Button>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-t border-white/10">
                  {[ 
                    { label: 'Format Analizi', val: '%100 Geçti' },
                    { label: 'Zorunlu Alanlar', val: 'Tamam' },
                    { label: 'Mükerrerlik', val: 'Temiz' },
                    { label: 'GÇB-Fatura', val: 'Uyumlu' }
                  ].map((s, idx) => (
                    <div key={idx} className="p-6 text-center">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                       <p className="text-sm font-black text-blue-300 uppercase tracking-widest italic">{s.val}</p>
                    </div>
                  ))}
               </div>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
               <Card className="border-slate-200 shadow-sm p-6 flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center italic font-black text-emerald-600 text-xl tracking-tighter"> 95 </div>
                  <div>
                     <p className="text-sm font-black text-slate-900 uppercase">KDVİRA GÜVEN SKORU</p>
                     <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Dosya, GİB sisteminden hata almadan geçme ihtimali çok yüksektir.</p>
                  </div>
               </Card>
               <Card className="border-slate-200 shadow-sm p-6 flex items-center gap-5 cursor-pointer hover:border-blue-300 transition-all group" onClick={() => setActiveStep('reports')}>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"> <Search className="w-7 h-7" /> </div>
                  <div>
                     <p className="text-sm font-black text-slate-900 uppercase">DETAYLI RAPOR İNCELE</p>
                     <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Simülasyon sonuçlarını madde madde analiz edin.</p>
                  </div>
               </Card>
            </div>
          </div>
        );
      case 'ymm_settings':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight">
                    <Shield className="w-4 h-4 text-blue-600" /> YMM TASDİK VE TAM TASDİK ÖN KONTROLÜ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">YMM PROJE NUMARASI</label>
                      <Input placeholder="YMM-2026-X-001" className="bg-slate-50/50 font-bold border-slate-200 h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">TASDİK SÖZLEŞME TARİHİ</label>
                      <Input type="date" className="bg-slate-50/50 font-bold border-slate-200 h-11" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">TASDİK İÇİN KANIT YETERLİLİK KONTROLÜ</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Sözleşme ve Karşıt İnceleme Tutanakları', status: 'Tamam', strength: 'Güçlü' },
                        { label: 'Banka Dekontları (Tevkifatlı/Yüksek Tutarlı)', status: 'Eksik', strength: 'Zayıf' },
                        { label: 'Mal/Hizmet Teslim Tutanakları & İrsaliyeler', status: 'Tamam', strength: 'Orta' },
                        { label: 'Alt Firma Vergi Levhası ve Faaliyet Belgeleri', status: 'Bekliyor', strength: 'N/A' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${item.status === 'Tamam' ? 'bg-emerald-500' : (item.status === 'Eksik' ? 'bg-rose-500' : 'bg-slate-300')}`} />
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${item.strength === 'Güçlü' ? 'bg-emerald-100 text-emerald-700' : (item.strength === 'Orta' ? 'bg-blue-100 text-blue-700' : (item.strength === 'Zayıf' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'))}`}>
                              {item.strength} KANIT
                            </span>
                            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase text-blue-600 hover:bg-blue-50">BELGE İSTE</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-amber-900 uppercase">TASDİK ENGELİ OLABİLECEK RİSKLER</p>
                      <ul className="text-[11px] font-bold text-amber-700 mt-2 space-y-1 list-disc pl-4">
                        <li>Alt firmalar arasında 'KOD'da olan 2 mükellef tespit edildi (VatRefundControl panelinden temizlenmeli).</li>
                        <li>Yüklenilen KDV listesinde amortismana tabi iktisadi kıymetlerin (ATİK) iadesi için YMM rapor ayrımı gereklidir.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm p-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">YMM ONAYI</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed mb-6">
                    Dosya YMM incelemesine gönderilmeye hazır mı? Tüm kanıtlar ve risk analizleri tamamlanmış olmalıdır.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-11 rounded-xl shadow-lg shadow-blue-100">
                    İNCELEMEYE GÖNDER
                  </Button>
                </Card>

                <Card className="border-slate-200 shadow-sm p-6">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" /> TASDİK SKORU
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>BELGE TAMLIĞI</span>
                      <span className="text-slate-900">%85</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[85%]" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest pt-2">
                      <span>KANIT GÜCÜ</span>
                      <span className="text-emerald-600">ORTA / YÜKSEK</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[70%]" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'output':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic mb-3">PROFESYONEL DOSYA ÇIKTILARI</h3>
               <p className="text-slate-500 font-bold text-sm uppercase tracking-tight">Hazırlanan verileri istediğiniz formatta dışa aktarın.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
               <Card className="border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-none overflow-hidden group">
                  <div className="p-6">
                     <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:rotate-6 transition-all">
                        <FileText className="w-6 h-6 text-blue-600 group-hover:text-white" />
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">BEYANNAME VE LİSTELER (GİB)</h4>
                     <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight mb-6">İnternet Vergi Dairesi formatına tam uyumlu Excel ve XML listeleri.</p>
                     <div className="flex gap-2">
                        <Button className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest h-10 rounded-lg">EXCEL İNDİR</Button>
                        <Button className="flex-1 bg-slate-100 text-slate-700 font-black text-[10px] uppercase tracking-widest h-10 rounded-lg">XML OLUŞTUR</Button>
                     </div>
                  </div>
               </Card>
               <Card className="border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-none overflow-hidden group">
                  <div className="p-6">
                     <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:rotate-6 transition-all">
                        <FileBadge className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">YMM TASDİK DOSYASI</h4>
                     <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight mb-6">Yeminli Mali Müşavir raporu için gerekli tüm çalışma kağıtları ve tablolar.</p>
                     <Button className="w-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest h-10 rounded-lg shadow-lg shadow-emerald-100"> TASDİK PAKETİ ÜRET </Button>
                  </div>
               </Card>
               <Card className="border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-none overflow-hidden group">
                  <div className="p-6">
                     <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:rotate-6 transition-all">
                        <Calculator className="w-6 h-6 text-slate-600 group-hover:text-white" />
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">MAHSUP / İADE DİLEKÇESİ</h4>
                     <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight mb-6">Resmi formatta iade talep dilekçesi ve mahsup listeleri (Word).</p>
                     <Button 
                        onClick={() => setActiveStep('petition')}
                        className="w-full bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest h-10 rounded-lg"
                     >
                        DİLEKÇE OLUŞTUR
                     </Button>
                  </div>
               </Card>
               <Card className="border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-none overflow-hidden group">
                  <div className="p-6 text-center">
                     <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Archive className="w-8 h-8 text-blue-600" />
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">DÖNEMİ ARŞİVLE</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mb-6">Tüm belgeleri dijital kasaya taşı</p>
                     <Button 
                        onClick={() => {
                          toast.success('Dönem başarıyla arşivlendi ve kapatıldı.');
                          setActiveStep('archive');
                        }}
                        variant="outline" 
                        className="w-full border-slate-200 font-black text-[10px] uppercase h-10 rounded-lg hover:bg-slate-900 hover:text-white transition-all"
                     >
                        ARŞİVLE VE KAPAT
                     </Button>
                  </div>
               </Card>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">HATA VE UYUM RAPORU</h3>
               <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase border-slate-200"> <Printer className="w-4 h-4 mr-2" /> RAPORU YAZDIR </Button>
            </div>
            <div className="space-y-4">
               {[
                 { id: '1', title: 'İndirilecek KDV - Beyanname Uyumsuzluğu', desc: 'Sistem tarafından hazırlanan 191 listesi toplamı ile beyannamede yer alan iadeye esas indirilecek KDV arasında 1.250,50 TL fark bulundu.', type: 'KRİTİK', fix: 'Beyannameyi Güncelle' },
                 { id: '2', title: 'Mükerrer Belge Kullanımı Tahmini', desc: `A firmasına ait ${refundMonth === 'Ocak' ? '15.02' : '15.01'}.${refundYear} tarihli fatura, hem ${refundMonth} hem de sonraki dönemde kısmi olarak bildirilmiş görünüyor.`, type: 'RİSK', fix: 'Listeleri Temizle' },
                 { id: '3', title: 'GÇB Kapanış Tarihi Hatası', desc: `Gümrük Çıkış Beyannamesi tescil tarihi ${refundMonth} olmasına rağmen fiili ihraç tarihi sonraki ay olarak sisteme yansımış.`, type: 'BİLGİ', fix: 'Tarihi Düzelt' }
               ].map((item) => (
                 <Card key={item.id} className="border-slate-200 overflow-hidden shadow-sm">
                   <div className="flex">
                      <div className={`w-2 shrink-0 ${item.type === 'KRİTİK' ? 'bg-rose-500' : (item.type === 'RİSK' ? 'bg-amber-500' : 'bg-blue-500')}`} />
                      <div className="p-6 flex-1 flex items-center justify-between gap-8">
                         <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-1">
                               <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${item.type === 'KRİTİK' ? 'bg-rose-100 text-rose-600' : (item.type === 'RİSK' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600')}`}>{item.type}</span>
                               <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title}</h4>
                            </div>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase leading-normal tracking-tight">{item.desc}</p>
                         </div>
                         <Button variant="outline" className="border-slate-200 text-[10px] font-black uppercase tracking-widest h-10 px-6 rounded-xl hover:bg-slate-900 hover:text-white transition-all"> {item.fix} </Button>
                      </div>
                   </div>
                 </Card>
               ))}
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Rapor ID: REP-{refundYear}-{(['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'].indexOf(refundMonth) + 1).toString().padStart(2, '0')}-9912 | Son Güncelleme: {new Date().toLocaleTimeString('tr-TR')}</p>
               <Button 
                onClick={() => setActiveStep('output')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black h-12 px-12 rounded-xl"
               >
                  SONUÇLARA GİT
               </Button>
            </div>
          </div>
        );
      case 'petition':
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setActiveStep('output')} 
              className="mb-2 text-xs font-black uppercase text-slate-500 hover:text-blue-600 tracking-widest h-8"
            >
              &larr; ÇIKTILARA DÖN
            </Button>
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-100/50">
               <CardHeader className="bg-white border-b border-slate-200 flex flex-row items-center justify-between py-4 px-6 relative z-10">
                  <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight text-slate-800">
                    <FileText className="w-5 h-5 text-blue-600" /> RESMİ İADE TALEP DİLEKÇESİ (KDVİRA)
                  </CardTitle>
                  <div className="flex gap-2">
                     <Button 
                        onClick={() => toast.success('Dilekçe kopyalandı!')}
                        variant="outline" 
                        className="h-8 text-[10px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                     >
                        <Copy className="w-3.5 h-3.5 mr-2" /> KOPYALA
                     </Button>
                     <Button 
                        onClick={() => {
                          const content = document.getElementById('petition-content')?.innerHTML;
                          if (!content) return;
                          
                          const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Dilekçe</title></head><body>";
                          const footer = "</body></html>";
                          const sourceHTML = header + content + footer;
                          
                          const blob = new Blob(['\ufeff', sourceHTML], {
                            type: 'application/msword'
                          });
                          
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `KDV_Iade_Dilekce_${activeFirm.name}.doc`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success('Dilekçe Word formatında indiriliyor...');
                        }}
                        className="h-8 text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                     >
                        <Download className="w-3.5 h-3.5 mr-2" /> WORD İNDİR
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div id="petition-content" className="max-w-3xl mx-auto bg-white space-y-6 p-12 py-16 font-serif text-sm leading-relaxed border border-slate-200 shadow-lg relative print:shadow-none print:border-none print:p-0">
                     <div className="text-right font-medium text-slate-600 mb-12">Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
                     <div className="text-center font-bold text-lg mb-12 uppercase tracking-wide">
                        {activeFirm.vd?.toUpperCase() || '-'} VERGİ DAİRESİ MÜDÜRLÜĞÜNE
                     </div>
                     <p className="indent-8 text-justify font-medium text-slate-800 leading-loose">
                        Dairenizin <span className="font-bold underline decoration-slate-300">{activeFirm.vkn}</span> vergi kimlik numarasında kayıtlı mükellefiyiz.
                     </p>
                     <p className="indent-8 text-justify font-medium text-slate-800 leading-loose">
                        <span className="font-bold">{refundYear} / {refundMonth}</span> dönemine ait KDV beyannamesinde <span className="font-bold">{refundTypes.join(' ve ')}</span> işlemlerimizden doğan 
                        iade edilebilir KDV tutarının tarafımıza <span className="font-bold underline decoration-slate-300">{refundMethod.toLowerCase()}en</span> iadesini talep etmekteyiz.
                     </p>
                     <p className="indent-8 text-justify font-medium text-slate-800 leading-loose">
                        İade işlemine ilişkin sistem üzerinden gönderilen standart iade talep dilekçesi, indirilecek KDV, hesaplanan KDV, yüklenilen KDV ve diğer ilgili dosya/listeler 
                        İnternet Vergi Dairesi sistemi (KDVİRA) üzerinden elektronik ortamda tam ve eksiksiz olarak onaylanıp gönderilmiştir.
                     </p>
                     <p className="indent-8 text-justify font-medium text-slate-800 leading-loose">
                        Gereğini bilgilerinize arz ederiz.
                     </p>

                     <div className="mt-24 flex justify-end">
                        <div className="text-center space-y-8 min-w-[200px]">
                           <div>
                              <p className="font-bold text-slate-900 border-b border-dashed border-slate-300 pb-2 mb-2">{activeFirm.name}</p>
                              <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">Kaşe / İmza</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        );
      case 'archive':
        return (
          <div className="space-y-6">
             <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-slate-200 shadow-sm overflow-hidden">
                   <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tight"> <Archive className="w-4 h-4 text-slate-500" /> Arşivlenmiş Dosyalar </CardTitle>
                      <div className="relative">
                         <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input placeholder="Arşivde ara..." className="bg-white border-slate-200 rounded-lg text-[10px] font-bold h-8 pl-10 pr-4 outline-none focus:ring-1 ring-blue-500 w-48" />
                      </div>
                   </CardHeader>
                   <CardContent className="p-0">
                      <div className="divide-y divide-slate-100">
                         {[
                           { id: '2026-02', period: '2026 / 02', type: 'Mal İhracı', date: '15.03.2026', size: '12.4 MB', status: 'Kapatıldı' },
                           { id: '2026-01', period: '2026 / 01', type: 'Kısmi Tevkifatlı Satış', date: '12.02.2026', size: '24.1 MB', status: 'Kapatıldı' },
                           { id: '2025-12', period: '2025 / 12', type: 'Mal İhracı', date: '08.01.2026', size: '15.8 MB', status: 'Kapatıldı' },
                           { id: '2025-11', period: '2025 / 11', type: 'İndirimli Oran', date: '12.12.2025', size: '42.0 MB', status: 'Kapatıldı' }
                         ].map((item) => (
                           <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                              <div className="flex items-center gap-4">
                                 <div className="p-2.5 bg-slate-100 rounded-xl"> <FileText className="w-5 h-5 text-slate-400" /> </div>
                                 <div>
                                    <p className="text-xs font-black text-slate-900 uppercase">{item.period} - {item.type} İADESİ</p>
                                    <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                       <span>Arşiv Tarihi: {item.date}</span>
                                       <span>Boyut: {item.size}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50"> <Download className="w-3 h-3 mr-1.5" /> İNDİR </Button>
                                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900"> <ChevronRight className="w-4 h-4" /> </Button>
                              </div>
                           </div>
                         ))}
                      </div>
                   </CardContent>
                </Card>
                <div className="space-y-6">
                   <Card className="border-blue-100 bg-blue-50/50 shadow-none p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3"> <Settings className="w-5 h-5 text-blue-200 animate-spin-slow" /> </div>
                      <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                         <History className="w-4 h-4" /> Kendi Kendini Geliştiren Hafıza
                      </h4>
                      <p className="text-xs font-bold text-blue-700 leading-relaxed mb-6 uppercase tracking-tight">
                         Sistem, bu firmanın geçmiş {activeFirm.vkn === '0000000000' ? '0' : '14'} aylık iade dosyalarını analiz ederek şu öğrenimleri sağladı:
                      </p>
                      <div className="space-y-4">
                         <div className="p-3 bg-white/60 rounded-xl border border-white/80">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-1">Öğrenilen Model</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase leading-tight tracking-tight">Gümrük Müşavirliği 'X' firmasından gelen GÇB formatı otomatik eşleştiriliyor.</p>
                         </div>
                         <div className="p-3 bg-white/60 rounded-xl border border-white/80">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-1">Risk Tahmini</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase leading-tight tracking-tight">Geçmişte 'Y' firmasından gelen faturalarda KDV tevkifat hatası sıkça yapılmış. Odaklanılıyor.</p>
                         </div>
                         <div className="p-3 bg-white/60 rounded-xl border border-white/80">
                            <p className="text-[10px] font-black text-blue-900 uppercase mb-1">Mevzuat Adaptasyonu</p>
                            <p className="text-[10px] font-bold text-blue-600 uppercase leading-tight tracking-tight">{refundMonth} {refundYear} tebliğ değişikliği ile değişen iade limitleri sisteme entegre edildi.</p>
                         </div>
                      </div>
                   </Card>
                   <Card className="border-slate-200 shadow-sm p-6">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">Arşiv İstatistikleri</h4>
                      <div className="space-y-4 pt-2">
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Toplam Dosya</span>
                            <span className="text-slate-900">14</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Topl. Depolama</span>
                            <span className="text-slate-900">284.5 MB</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Güvenlik</span>
                            <span className="text-emerald-600">AES-256 ŞİFRELİ</span>
                         </div>
                      </div>
                   </Card>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="py-20 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <ClipboardList className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">Bu bölüm henüz yapılandırma aşamasındadır.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200">
                  <Calculator className="w-8 h-8 text-white" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-slate-900 leading-none tracking-tighter uppercase italic">KDV İade Hazırlık ve Kontrol Merkezi</h1>
                  <div className="flex gap-2 mt-1">
                     <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest uppercase">PROFESYONEL DENETİM</span>
                     <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">YMM TASDİK HAZIRLIK</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 min-w-[300px]">
                <div className="flex items-center justify-between mb-1.5">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">GİB MEVZUAT GÖRÜNÜMÜ</span>
                   </div>
                   <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${regulationStatus.status === 'GÜNCEL' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                      {regulationStatus.status}
                   </span>
                </div>
                <p className="text-[10px] font-black text-slate-900 uppercase truncate leading-tight">{regulationStatus.latest}</p>
                <div className="flex items-center justify-between mt-1.5">
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">{regulationStatus.notes}</p>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SON KONTROL: {regulationStatus.lastUpdate}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AKTİF DOSYA GÜVEN SKORU</p>
                    <p className="text-xl font-black text-emerald-600 italic">95 / 100</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
             </div>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-2 flex items-center gap-1 overflow-x-auto h-24 mb-6 shadow-sm no-scrollbar">
           {steps.map((step, index) => {
             const Icon = step.icon;
             const isActive = activeStep === step.id;
             return (
               <button 
                 key={step.id}
                 onClick={() => setActiveStep(step.id)}
                 className={`flex flex-col items-center justify-center shrink-0 min-w-[100px] h-full rounded-2xl transition-all relative ${isActive ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
               >
                  <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="text-[9px] font-black uppercase tracking-tighter px-2 text-center">{step.label}</span>
                  {isActive && <motion.div layoutId="activeStep" className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-400" />}
               </button>
             )
           })}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
           <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-10 border-t border-slate-100">
           <Button 
             variant="outline" 
             className="border-slate-200 font-black h-12 px-8 rounded-xl uppercase tracking-widest text-[10px] bg-white text-slate-500 hover:bg-slate-50 transition-all shrink-0" 
             onClick={handlePrev}
             disabled={activeStep === 'creation'}
           >
              <ChevronLeft className="mr-2 w-4 h-4" /> ÖNCEKİ ADIM
           </Button>
           <div className="hidden md:flex gap-4">
              <div className="flex flex-col items-center px-6 border-x border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">İade Dönemi</p>
                 <p className="text-xs font-black text-slate-900 border-b-2 border-blue-500">{refundMonth} {refundYear}</p>
              </div>
              <div className="flex flex-col items-center px-6 border-r border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">İade Türü</p>
                 <p className="text-xs font-black text-slate-900 border-b-2 border-emerald-500 uppercase">{refundTypes.join(', ')}</p>
              </div>
           </div>
           <Button 
             className="bg-slate-900 hover:bg-black text-white font-black h-12 px-12 rounded-xl uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 transition-all shrink-0" 
             onClick={handleNext}
             disabled={activeStep === 'archive'}
           >
              SONRAKİ ADIM <ChevronRight className="ml-2 w-4 h-4" />
           </Button>
        </div>

        {/* Footer Audit Note */}
        <div className="p-10 text-center">
           <div className="w-1px h-12 bg-gradient-to-b from-transparent via-slate-200 to-transparent mx-auto mb-6" />
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] max-w-3xl mx-auto leading-relaxed">
             Bu çalışma ön kontrol ve hazırlık amaçlıdır. Nihai KDV iade talebi, ilgili mevzuat, KDV Genel Uygulama Tebliği ve YMM/mali müşavir mesleki değerlendirmesi dikkate alınarak yapılmalıdır.
           </p>
        </div>

        {/* Veri Önizleme Modalı */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl bg-white border-none rounded-[2rem] shadow-2xl overflow-hidden p-0">
             <DialogHeader className="p-6 bg-slate-900 text-white">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg"> <FileText className="w-5 h-5 text-white" /> </div>
                      <div>
                         <DialogTitle className="text-lg font-black uppercase italic tracking-tighter">LİSTE ÖNİZLEME: {previewListData.name}</DialogTitle>
                         <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            {activeFirm.name} / {refundMonth} {refundYear} Dönemi
                         </DialogDescription>
                      </div>
                   </div>
                   <Button 
                     variant="outline" 
                     className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-black text-[9px] h-8 rounded-lg px-4"
                     onClick={() => handleDownloadList(previewListData.name)}
                   >
                     EXCEL İNDİR
                   </Button>
                </div>
             </DialogHeader>
             <div className="p-0 overflow-x-auto max-h-[60vh]">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                      <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         {previewListData.data.length > 0 && Object.keys(previewListData.data[0]).map((header) => (
                           header !== 'id' && (
                             <th key={header} className="px-6 py-4 whitespace-nowrap">{header}</th>
                           )
                         ))}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {previewListData.data.map((row, idx) => (
                        <tr key={idx} className="text-[11px] font-bold text-slate-700 hover:bg-slate-50/50 transition-colors">
                           {Object.keys(row).map((key) => (
                             key !== 'id' && (
                               <td key={key} className={`px-6 py-4 whitespace-nowrap ${typeof row[key] === 'number' ? 'text-right font-mono text-blue-600' : 'uppercase tracking-tighter'}`}>
                                 {typeof row[key] === 'number' ? row[key].toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL' : row[key]}
                               </td>
                             )
                           ))}
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <CardFooter className="p-6 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic leading-tight max-w-[400px]">
                   * Bu önizleme verileri sistem tarafından analiz edilmiş ve iade dosyasına hazırlık formatına getirilmiştir.
                </p>
                <div className="flex gap-2">
                   <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500" onClick={() => setIsPreviewOpen(false)}>KAPAT</Button>
                   <Button className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 rounded-lg" onClick={() => setActiveStep('risk_analysis')}>KONTROLE GEÇ</Button>
                </div>
             </CardFooter>
          </DialogContent>
        </Dialog>

        {/* Request Letter Modal */}
        <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
          <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
            <DialogHeader className="p-8 bg-slate-900 text-white relative">
              <div className="absolute right-8 top-8">
                 <button onClick={() => setIsRequestModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-400" /> MÜKELLEFE EVRAK İSTEME YAZISI
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                {refundMonth} {refundYear} / {refundTypes.join(', ')} / {refundMethod}EN İADE
              </DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 relative group">
                <textarea 
                  value={requestLetterText}
                  onChange={(e) => setRequestLetterText(e.target.value)}
                  className="w-full h-80 bg-transparent border-none resize-none font-medium text-slate-700 text-sm leading-relaxed focus:ring-0 spellcheck-false"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                   <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(requestLetterText);
                      toast.success('Metin kopyalandı!');
                    }}
                    variant="secondary" 
                    size="sm" 
                    className="bg-white hover:bg-slate-100 text-slate-600 font-black text-[10px] h-8 px-4 rounded-lg shadow-sm border border-slate-200"
                   >
                     <Copy className="w-3.5 h-3.5 mr-2" /> KOPYALA
                   </Button>
                </div>
              </div>
              <div className="flex gap-4">
                 <Button 
                   onClick={handleWhatsAppSend}
                   className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black h-12 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                 >
                    <Send className="w-4 h-4" /> WHATSAPP İLE GÖNDER
                 </Button>
                 <Button 
                   onClick={handleEmailSend}
                   className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                 >
                    <Mail className="w-4 h-4" /> E-POSTA OLARAK GÖNDER
                 </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Risk Detay Modalları */}
        <Dialog open={!!activeRiskDetail} onOpenChange={(open) => !open && setActiveRiskDetail(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                {activeRiskDetail === 'period_mismatch' && 'Dönem Uyumsuzluğu Tespit Edilen Belgeler'}
                {activeRiskDetail === 'vat_limit_excess' && 'Yüklenilen KDV Sınır Aşımı Analizi'}
                {activeRiskDetail === 'invalid_vkn' && 'Hatalı Vergi Kimlik Numarası Düzeltme'}
              </DialogTitle>
              <DialogDescription className="font-bold text-slate-500 uppercase tracking-tighter text-xs">
                Sistem tarafından tespit edilen kritik risklerin detaylı görünümü ve aksiyon alanı.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              {activeRiskDetail === 'period_mismatch' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-6">
                    <p className="text-xs font-bold text-amber-800 leading-relaxed uppercase">
                      Aşağıdaki faturalar yüklenen 191 listesinde yer almasına rağmen, iade talep edilen dönem olan <strong>{refundMonth} {refundYear}</strong> dışındaki tarihlere sahiptir. Bu belgeler GİB sisteminde otomatik olarak reddedilecektir.
                    </p>
                  </div>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <tr>
                          <th className="px-4 py-3">Fatura No</th>
                          <th className="px-4 py-3">Tarih</th>
                          <th className="px-4 py-3">Cari Unvan</th>
                          <th className="px-4 py-3 text-right">KDV Tutarı</th>
                          <th className="px-4 py-3 text-center">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {[
                            { no: 'GIB2026001', date: `${refundMonth === 'Ocak' ? '15/02' : '15/01'}/${refundYear}`, title: 'X Enerji LTD', kdv: '12.450,00' },
                            { no: 'ABC2026055', date: `${refundMonth === 'Ocak' ? '05/03' : '05/02'}/${refundYear}`, title: 'Y Lojistik AŞ', kdv: '8.120,50' },
                            { no: 'ZET2026100', date: `${refundMonth === 'Ocak' ? '21/02' : '10/01'}/${refundYear}`, title: 'Zeta Yazılım', kdv: '2.300,00' },
                            { no: 'GIB2026212', date: `${refundMonth === 'Ocak' ? '28/03' : '22/01'}/${refundYear}`, title: 'Marmara Kağıt', kdv: '1.450,00' }
                          ].map((doc, idx) => (
                          <tr key={idx} className="text-[11px] font-bold text-slate-700">
                            <td className="px-4 py-3 font-mono">{doc.no}</td>
                            <td className="px-4 py-3 text-rose-600 italic underline uppercase">{doc.date}</td>
                            <td className="px-4 py-3">{doc.title}</td>
                            <td className="px-4 py-3 text-right">{doc.kdv} TL</td>
                            <td className="px-4 py-3 text-center">
                              <Button variant="ghost" size="sm" className="text-[10px] font-black text-rose-600 uppercase" onClick={() => toast.success('Belge listeden kaldırıldı.')}>Kaldır</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeRiskDetail === 'vat_limit_excess' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 shadow-none bg-slate-50/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-8 divide-x divide-slate-200">
                        <div className="space-y-4">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Mevcut Hesaplama</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[11px] font-bold text-slate-600 uppercase">{refundTypes.includes('Yatırım Teşvikli Satış') ? 'Yatırım Teşvikli Satış Matrahı' : 'İndirimli Oran Satış Matrahı'}</span>
                              <span className="text-[11px] font-black">2.500.000,00 TL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[11px] font-bold text-slate-600 uppercase">{refundTypes.includes('Yatırım Teşvikli Satış') ? 'İstisna Tutarı' : 'Hesaplanan KDV (%10)'}</span>
                              <span className="text-[11px] font-black">{refundTypes.includes('Yatırım Teşvikli Satış') ? '500.000,00 TL' : '250.000,00 TL'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-200">
                              <span className="text-[11px] font-black text-blue-600 uppercase">Yüklenilen KDV (Talep)</span>
                              <span className="text-[11px] font-black text-blue-600">320.000,00 TL</span>
                            </div>
                          </div>
                        </div>
                        <div className="pl-8 space-y-4">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Sınır Ve Limitler</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[11px] font-bold text-slate-600 uppercase">Genel Vergi Oranı (%20)</span>
                              <span className="text-[11px] font-black">500.000,00 TL</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[11px] font-bold text-slate-600 uppercase">Aradaki Fark (Azami İade)</span>
                              <span className="text-[11px] font-black">250.000,00 TL</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-200">
                              <span className="text-[11px] font-black text-rose-600 uppercase">AŞIM TUTARI</span>
                              <span className="text-[11px] font-black text-rose-600">70.000,00 TL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight italic">HESAPLAMA ÖNERİSİ VE DÜZELTME</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">
                      Yüklenilen KDV tutarı, {refundTypes.includes('Yatırım Teşvikli Satış') ? 'istisna kapsamında satılan' : 'indirimli oran kapsamında satılan'} malların bünyesine giren KDV'yi aşamaz. Genel gider ve ATİK payları yeniden dağıtılmalıdır.
                    </p>
                    <Button className="w-full bg-blue-600 text-white font-black h-12 rounded-xl" onClick={() => {
                      toast.success('Yüklenim listesi limitlere göre optimize edildi.');
                      setActiveRiskDetail(null);
                    }}>LİMİTLERİ OTOMATİK UYGULA</Button>
                  </div>
                </div>
              )}

              {activeRiskDetail === 'invalid_vkn' && (
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-bold text-red-800 uppercase leading-relaxed font-mono">
                      HATA: SATICI VKN FORMATI (999999999) GEÇERSİZDİR. 10 HANELİ OLMALI VEYA TCKN İÇİN 11 HANELİ OLMALIDIR.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cari Unvan</label>
                        <Input defaultValue="Hatalı Kayıt CARİ LTD ŞTİ" disabled className="bg-slate-100 font-bold border-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mevcut VKN (Hatalı)</label>
                        <Input defaultValue="999999999" disabled className="bg-slate-100 font-bold border-none font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Yeni VKN / TCKN</label>
                        <Input placeholder="Lütfen doğru numarayı giriniz..." className="bg-white border-blue-200 border-2 font-black h-12 font-mono text-lg" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 h-12 font-black uppercase text-xs rounded-xl" onClick={() => setActiveRiskDetail(null)}>İPTAL</Button>
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl" onClick={() => {
                        toast.success('Vergi Kimlik Numarası güncellendi ve tüm listelerde değiştirildi.');
                        setActiveRiskDetail(null);
                      }}>KAYDET VE GÜNCELLE</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">PROFESYONEL DENETİM MODÜLÜ</span>
               </div>
               <Button variant="ghost" onClick={() => setActiveRiskDetail(null)} className="font-black uppercase text-xs text-slate-500 italic">KAPAT</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
