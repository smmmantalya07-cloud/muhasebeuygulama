import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ActionBar } from '@/components/ActionBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadCloud, FileWarning, Search, FileText, CheckCircle2, Clock, Newspaper, Sparkles, ShieldCheck, AlertTriangle, ChevronRight, AlertCircle, Plus, Shield, BarChart3, ClipboardList, Calculator, TrendingUp, DollarSign, Euro, MessageSquare, FileSearch, ShieldAlert, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { BrandLogo } from '@/components/BrandLogo';

export function DashboardPage({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('Otomatik Tespit');
  const [analysisType, setAnalysisType] = useState('Üçlü Denetim Analizi');
  const [showWarning, setShowWarning] = useState(false);
  const [dailyNews, setDailyNews] = useState<any[]>([
    { title: "7578 Sayılı Kanun Yayımlandı: Doğum İzni ve Sosyal Medyada Yeni Dönem", link: "https://www.alomaliye.com/2026/05/01/7578-sayili-kanun-yayimlandi-dogum-izni-ve-sosyal-medyada-yeni-donem/", category: "Resmî Gazete" },
    { title: "Noterlerce Yapılacak Makbuz Karşılığı Ödemelere İlişkin Duyuru", link: "https://www.alomaliye.com/2026/05/01/noterlerce-yapilacak-makbuz-karsiligi-odemelere-ait-beyannameye-iliskin-duyuru-gib/", category: "GİB Duyurusu" },
    { title: "SGK 48/A Tecil İşlemlerinde Yetki Tutarları Belirlendi", link: "https://www.alomaliye.com/2026/04/29/sgk-48-a-tecil-islemlerinde-2026-yetki-tutarlari/", category: "SGK Bildirimi" },
    { title: "TÜRMOB Disiplin Kurulu Kararları Yayımlandı", link: "https://www.alomaliye.com/2026/05/03/turmob-disiplin-kurulu-kararlari-yayimlandi/", category: "TÜRMOB" }
  ]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const res = await fetch("/api/rss");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setDailyNews(data.slice(0, 4));
            return;
          }
        }
        throw new Error('Fallback to placeholder');
      } catch (err) {
        console.error("News fetch error, using fallbacks:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const getAnalysisRoute = (docType: string, analysisType: string) => {
    if (analysisType === 'Üçlü Denetim Analizi') {
      return ['Vergi Müfettişi kontrolü', 'YMM tasdik kontrolü', 'Bağımsız denetçi kontrolü', 'Kanıt yeterliliği ölçümü', 'Birleşik risk skoru', 'Mali müşavir nihai onayı'];
    }
    
    switch (docType) {
      case 'İzaha Davet Yazısı':
        return ['İddia konusu tespiti', 'İdarenin dayanaklarının ayrıştırılması', 'Cevap süresi kontrolü', 'Eksik belge listesi', 'Risk skoru', 'Savunma / açıklama taslağı'];
      case 'Mizan':
        return ['Kasa hesabı kontrolü', 'Banka hesabı kontrolü', 'Ortaklar cari hesabı kontrolü', 'KDV hesapları kontrolü', 'Stok ve gider hesapları kontrolü', 'Olağandışı bakiye tespiti'];
      case 'Fatura Listesi':
        return ['Sahte belge emaresi kontrolü', 'KDV indirim riski', 'Bağlantısız gider kontrolü', 'Tedarikçi yoğunlaşması', 'Ticari teamüle aykırı işlem kontrolü'];
      case 'Banka Ekstresi':
        return ['Açıklamasız para girişleri', 'Kayıt dışı hasılat riski', 'Ortak transferleri', 'Kasa / banka uyumsuzluğu', 'Satış kayıtlarıyla karşılaştırma'];
      case 'KDV Beyannamesi':
        return ['İndirilecek KDV kontrolü', 'Devreden KDV analizi', 'KDV iade riski', 'Özel esas riski', 'Alış-satış uyumu'];
      default:
        return ['Belge türü tespiti', 'İçerik analizi', 'Ön risk tespiti', 'Üçlü denetim modeli', 'Kanıt değerlendirmesi'];
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setSelectedFile(e.target.files[0]);
    setShowWarning(documentType === 'Otomatik Tespit');
  };

  const handleStartAnalysis = async (typeOverride?: string | React.MouseEvent) => {
    if (!selectedFile) return;
    
    const finalAnalysisType = typeof typeOverride === 'string' ? typeOverride : analysisType;
    
    setIsAnalyzing(true);
    toast.info(`${selectedFile.name} analiz ediliyor...`);
    
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let contentsObj: any = { role: 'user', parts: [] };
      const mime = selectedFile.type || 'application/octet-stream';
      
      // Attempt to parse Excel or text files to plain text to bypass inlineData limits
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv')) {
         const XLSX = await import('xlsx');
         const ab = await selectedFile.arrayBuffer();
         const wb = XLSX.read(ab, { type: 'array' });
         const sheet = wb.Sheets[wb.SheetNames[0]];
         const textData = XLSX.utils.sheet_to_csv(sheet);
         contentsObj.parts.push({ text: `EKTEKİ EXCEL/CSV VERİSİ (CSV FORMATINDA):\n\n${textData.substring(0, 50000)}` });
      } else if (mime.startsWith('text/') || selectedFile.name.endsWith('.txt')) {
         const textData = await selectedFile.text();
         contentsObj.parts.push({ text: `EKTEKİ METİN VERİSİ:\n\n${textData.substring(0, 50000)}` });
      } else {
         const base64Data = await fileToBase64(selectedFile);
         contentsObj.parts.push({
           inlineData: {
             data: base64Data,
             mimeType: mime === 'application/octet-stream' && selectedFile.name.endsWith('.pdf') ? 'application/pdf' : mime,
           },
         });
      }

      contentsObj.parts.push({ 
        text: `Sen kıdemli bir Vergi Müfettişi, Yeminli Mali Müşavir ve Bağımsız Denetçisin. Ekteki belgeyi incele ve aşağıda belirtilen "Üçlü Denetim Sonuç Formatı"na uygun şekilde detaylı, profesyonel bir analiz raporu oluştur.
        
        KRİTİK TALİMATLAR:
        1. Kanıt Merkezi: Her işlem için kanıt gücünü (Güçlü, Orta, Zayıf) belirle.
        2. Üçlü Perspektif: Vergi Müfettişi (Eleştiri), YMM (Tasdik), Bağımsız Denetçi (Finansal Risk) bakışlarını ayrı ayrı sun.
        3. Dil Güvenliği: Kesin hüküm yerine "bu belge sahtedir" deme; "sahte veya muhteviyatı itibarıyla yanıltıcı belge emareleri tespit edilmiştir" gibi mesleki ihtiyatlı dil kullan.
        4. Kurumlar Vergisi / Mizan Odağı: Eğer belge beyanname veya mizan ise, kasa fazlası, ortaklar borçları, KKEG ve vergi matrahı uyumunu kontrol et.

        ÜÇLÜ DENETİM SONUÇ FORMATI:
        - Belge Türü: (Belgeyi tanımla)
        - Firma / Mükellef: (Varsa tespit et)
        - Analiz Türü: ${finalAnalysisType}
        
        ### 1. VERGİ MÜFETTİŞİ GÖRÜŞÜ (Denetim & İnceleme)
        - Tespit ve Eleştiri: (Olası inceleme riskleri)
        - VUK/GVK/KVK Dayanakları: (Kanun maddeleri)

        ### 2. YMM GÖRÜŞÜ (Tasdik & KDV İadesi)
        - Tasdik Edilebilirlik: (Kabul, Şartlı, Red)
        - Karşıt İnceleme İhtiyacı: (Gerekli mi?)

        ### 3. BAĞIMSIZ DENETÇİ GÖRÜŞÜ (Finansal Tablo)
        - Önemli Yanlışlık Riski: (Tabloya etkisi)
        - Kanıt Gücü Ölçümü: (Kanıt Merkezi değerlendirmesi)

        - Birleşik Risk Skoru: (0-100 arası bir puan ver)
        - Kritik Bulgular: (En önemli 3-5 risk noktası)
        - Eksik Belgeler: (Mükelleften istenmesi gereken kanıtlar)
        - Önerilen Aksiyon Planı: (Mali müşavirin yapması gerekenler)
        - Mali Müşavir Nihai Notu: (Kısa bir özet not)

        Nihai Kontrol Notu: Bu analiz ön değerlendirme niteliğindedir. Nihai karar için ilgili belgeler, kanıtlar, ödeme kayıtları, teslim/hizmet ifası, defter kayıtları, beyannameler ve resmi mevzuat dayanakları mali müşavir, YMM veya bağımsız denetçi tarafından kontrol edilmelidir.

        Bugünün Tarihi: ${new Date().toLocaleDateString('tr-TR')}` 
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [contentsObj]
      });

      setAnalysisResult(response.text || 'Analiz sonucu alınamadı.');
      setIsResultOpen(true);
      toast.success('Analiz tamamlandı.');
    } catch (error: any) {
      console.error(error);
      toast.error(`Belge analiz edilirken bir hata oluştu: ${error?.message || error}`);
    } finally {
      setIsAnalyzing(false);
      setSelectedFile(null); // Optional: clear file after analysis
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Section - Documents & News */}
      <div className="grid gap-6 md:grid-cols-12 mb-8">
        
        {/* Dropzone Area */}
        <div className="md:col-span-8 flex flex-col">
          <Card className="shadow-sm border-slate-200 flex-1 hover:border-slate-300 transition-all bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">Belge Yükle ve Otomatik Analiz Et</CardTitle>
                    <CardDescription className="text-sm mt-1.5 text-slate-500 font-medium tracking-wide">PDF, Excel, Mizan, Fatura ve Banka Ekstreleri için üçlü denetim filtresi analiz modülü.</CardDescription>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <UploadCloud className="w-6 h-6" strokeWidth={2} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6 px-6 relative">
              {/* BELGE TÜRÜ VE ANALİZ TÜRÜ SEÇİMİ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Belge Türü</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={documentType}
                    onChange={(e) => {
                      setDocumentType(e.target.value);
                      setShowWarning(e.target.value === 'Otomatik Tespit' && selectedFile !== null);
                    }}
                    disabled={isAnalyzing}
                  >
                    <option value="Otomatik Tespit">Otomatik Tespit</option>
                    <option value="İzaha Davet Yazısı">İzaha Davet Yazısı</option>
                    <option value="Vergi İnceleme Yazısı">Vergi İnceleme Yazısı</option>
                    <option value="Vergi İnceleme Tutanağı">Vergi İnceleme Tutanağı</option>
                    <option value="Vergi Tekniği Raporu">Vergi Tekniği Raporu</option>
                    <option value="Vergi Ceza İhbarnamesi">Vergi Ceza İhbarnamesi</option>
                    <option value="Özel Esaslara Alınma Yazısı">Özel Esaslara Alınma Yazısı</option>
                    <option value="KDV Beyannamesi">KDV Beyannamesi</option>
                    <option value="Muhtasar ve Prim Hizmet Beyannamesi">Muhtasar ve Prim Hizmet Beyannamesi</option>
                    <option value="Kurumlar Vergisi Beyannamesi">Kurumlar Vergisi Beyannamesi</option>
                    <option value="Gelir Vergisi Beyannamesi">Gelir Vergisi Beyannamesi</option>
                    <option value="Geçici Vergi Beyannamesi">Geçici Vergi Beyannamesi</option>
                    <option value="Mizan">Mizan</option>
                    <option value="Yevmiye Defteri">Yevmiye Defteri</option>
                    <option value="Defter-i Kebir">Defter-i Kebir</option>
                    <option value="Fatura Listesi">Fatura Listesi</option>
                    <option value="E-Fatura / E-Arşiv Dökümü">E-Fatura / E-Arşiv Dökümü</option>
                    <option value="Banka Ekstresi">Banka Ekstresi</option>
                    <option value="Kasa Hesabı Dökümü">Kasa Hesabı Dökümü</option>
                    <option value="Ortaklar Cari Hesabı">Ortaklar Cari Hesabı</option>
                    <option value="Stok Listesi">Stok Listesi</option>
                    <option value="Bordro ve SGK Kayıtları">Bordro ve SGK Kayıtları</option>
                    <option value="Sözleşme">Sözleşme</option>
                    <option value="YMM Tasdik Dosyası">YMM Tasdik Dosyası</option>
                    <option value="Bağımsız Denetim Çalışma Kâğıdı">Bağımsız Denetim Çalışma Kâğıdı</option>
                    <option value="Diğer Belge">Diğer Belge</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">Yüklenen belgeye göre analiz rotası otomatik belirlenecektir.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Analiz Türü</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    disabled={isAnalyzing}
                  >
                    <option value="Hızlı Ön Kontrol">Hızlı Ön Kontrol</option>
                    <option value="Detaylı Vergi Analizi">Detaylı Vergi Analizi</option>
                    <option value="Üçlü Denetim Analizi">Üçlü Denetim Analizi</option>
                    <option value="KDV Risk Analizi">KDV Risk Analizi</option>
                    <option value="Sahte Belge Risk Kontrolü">Sahte Belge Risk Kontrolü</option>
                    <option value="Kasa / Banka / Ortaklar Cari Kontrolü">Kasa / Banka / Ortaklar Cari Kontrolü</option>
                    <option value="İzaha Davet Cevap Hazırlığı">İzaha Davet Cevap Hazırlığı</option>
                    <option value="Savunma Taslağı Hazırlığı">Savunma Taslağı Hazırlığı</option>
                    <option value="YMM Tasdik Kontrolü">YMM Tasdik Kontrolü</option>
                    <option value="Bağımsız Denetim Bulguları Analizi">Bağımsız Denetim Bulguları Analizi</option>
                  </select>
                </div>
              </div>

              {/* OTOMATİK ANALİZ ROTASI KARTI */}
              <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Otomatik Analiz Rotası
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getAnalysisRoute(documentType, analysisType).map((route, index) => (
                    <span key={index} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-blue-200 text-blue-800 text-[11px] font-medium rounded-full shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {route}
                    </span>
                  ))}
                </div>
              </div>

              {/* UYARILAR */}
              {selectedFile && showWarning && (
                <div className="mb-4 bg-amber-50 border-l-[3px] border-l-amber-500 p-3 text-amber-800 text-xs rounded-r-lg shadow-sm font-medium flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-amber-600 shrink-0" />
                  Belge türü otomatik tespit edilecek. Analiz sonucunun doğruluğu için belge türünü manuel seçmeniz önerilir.
                </div>
              )}
              {selectedFile && (
                <div className="mb-5 bg-emerald-50 border-l-[3px] border-l-emerald-500 p-3 text-emerald-800 text-xs rounded-r-lg shadow-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Hassas veri kontrolü aktif. TCKN, VKN, IBAN, adres ve personel bilgileri analiz öncesinde kontrol edilecektir.
                </div>
              )}

              {/* KONTROL LİSTESİ VE DOSYA SEÇİMİ */}
              <div 
                className={`w-full border-2 border-dashed rounded-xl flex flex-col sm:flex-row items-center justify-between p-6 ${selectedFile ? 'bg-blue-50/30 border-blue-300' : 'bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-400 border-slate-300'} transition-all relative group`}
              >
                {!selectedFile && (
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleFileSelect}
                    disabled={isAnalyzing}
                  />
                )}
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className={`w-14 h-14 shrink-0 rounded-full bg-white border ${selectedFile ? 'border-blue-200 text-blue-600' : 'border-slate-200 text-slate-400'} shadow-sm flex items-center justify-center transition-transform ${!selectedFile && 'group-hover:scale-105'}`}>
                    {isAnalyzing ? <Sparkles className="w-6 h-6 animate-pulse text-blue-600" /> : (selectedFile ? <FileText className="w-6 h-6 text-blue-600" /> : <UploadCloud className="w-6 h-6 text-blue-600" strokeWidth={2} />)}
                  </div>
                  <div className="text-center sm:text-left">
                    {selectedFile ? (
                       <>
                         <p className="font-semibold text-blue-900 text-base mb-1">{selectedFile.name}</p>
                         
                         {/* Analiz Öncesi Kontrol Checkbox'ları */}
                         <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] text-slate-600 font-medium">
                           <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Firma seçimi yapıldı</div>
                           <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Analiz türü seçildi</div>
                           <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Geçici analiz mod açık</div>
                           <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Otomatik maskeleme aktif</div>
                         </div>
                       </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-800 text-base mb-1">
                          {isAnalyzing ? 'Belge Analiz Ediliyor...' : 'Dosyaları sürükleyin veya seçmek için tıklayın'}
                        </p>
                        <p className="text-[13px] text-slate-500 font-medium text-center sm:text-left max-w-sm leading-relaxed">
                          {isAnalyzing ? 'Üçlü denetim modeli çalıştırılıyor, lütfen bekleyin.' : 'Müfettiş, YMM ve Bağımsız Denetçi kriterlerine göre belgeleri saniyeler içinde analiz edin ve riskleri tespit edin.'}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 relative z-20 mt-6 sm:mt-0">
                  {!selectedFile ? (
                    <Button 
                      variant="outline" 
                      className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 pointer-events-none shadow-sm"
                    >
                      Bilgisayardan Seç
                    </Button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => { setSelectedFile(null); setShowWarning(false); }}
                        disabled={isAnalyzing}
                        className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        İptal
                      </Button>
                      <Button 
                        onClick={handleStartAnalysis}
                        disabled={!selectedFile || isAnalyzing}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 min-w-[140px]"
                      >
                        {isAnalyzing ? <span className="flex items-center"><Sparkles className="w-4 h-4 mr-2 animate-pulse" /> Analiz...</span> : 'Analizi Başlat'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 shadow-sm cursor-help" title="Mevcut Durum: Aktif">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Hassas Veri Kontrolü
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 shadow-sm cursor-help" title="Mevcut Durum: Aktif">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Otomatik Maskeleme
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 shadow-sm cursor-help" title="Mevcut Durum: Aktif">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Geçici Analiz
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 shadow-sm cursor-help" title="Mevcut Durum: Aktif">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Analiz Sonrası Sil
                </div>
              </div>
              
              <p className="mt-4 text-[11px] text-slate-500 text-center leading-relaxed px-4 mx-auto max-w-xl">
                Yüklenen belgelerde TCKN, VKN, IBAN, adres, personel bilgisi veya müşteri unvanı gibi hassas veriler bulunuyorsa analiz öncesinde otomatik maskeleme önerilir.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* News & Updates Area */}
        <div className="md:col-span-4 flex flex-col">
          <Card className="shadow-sm border-slate-200 flex-1 bg-white h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  Günlük Mevzuat Özeti
                </CardTitle>
                <div className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider shadow-sm">{new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}</div>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-5 flex-1 flex flex-col">
               <div className="space-y-4 flex-1">
                 {newsLoading ? (
                   <div className="flex flex-col items-center justify-center py-6 text-slate-400 space-y-3">
                     <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                     <span className="text-xs font-medium">Güncel mevzuat alınıyor...</span>
                   </div>
                 ) : (
                   dailyNews.map((news, index) => {
                     let colorClass = "bg-blue-600";
                     if (news.category?.includes("SGK")) colorClass = "bg-emerald-500";
                     else if (news.category?.includes("TÜRMOB") || news.category?.includes("Kurulu")) colorClass = "bg-amber-500";
                     
                     return (
                       <a key={index} href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-3 items-start group">
                         <div className={`w-2 h-2 rounded-full ${colorClass} mt-1.5 shrink-0 group-hover:scale-125 transition-transform`} />
                         <div>
                           <p className="text-sm text-slate-700 leading-relaxed group-hover:text-blue-600 transition-colors tracking-tight">
                             <span className="font-bold text-slate-900 mr-1.5 inline-block">{news.category}:</span>{news.title}
                           </p>
                         </div>
                       </a>
                     );
                   })
                 )}
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-100 shrink-0">
                 <Button 
                   variant="ghost" 
                   className="w-full font-bold text-blue-600 hover:text-blue-700 transition duration-200 hover:bg-slate-50 text-[11px] uppercase tracking-wider h-10 border border-blue-100/50" 
                   onClick={() => window.open('https://www.alomaliye.com/kategori/mevzuat/', '_blank')}
                 >
                   ALOMALİYE MEVZUAT TAKİBİ <ChevronRight className="w-3.5 h-3.5 ml-1" />
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-indigo-300 transition-all cursor-pointer" onClick={() => onNavigate?.('declarations')}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <FileText className="w-5 h-5" />
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px]">12 BEKLEYEN</Badge>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Beyannameler</p>
          <p className="text-2xl font-black text-slate-900 mt-1">12 <span className="text-xs text-slate-400 font-medium">Bu Ay</span></p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-rose-300 transition-all cursor-pointer" onClick={() => onNavigate?.('reports')}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 transition-colors group-hover:bg-rose-600 group-hover:text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <Badge className="bg-rose-100 text-rose-700 border-none font-black text-[10px]">5 KRİTİK</Badge>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Riskli Mükellefler</p>
          <p className="text-2xl font-black text-slate-900 mt-1">4 <span className="text-xs text-slate-400 font-medium">Dosya</span></p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-amber-300 transition-all cursor-pointer" onClick={() => onNavigate?.('notifications')}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px]">3 YENİ</Badge>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">KEP / Tebligat</p>
          <p className="text-2xl font-black text-slate-900 mt-1">3 <span className="text-xs text-slate-400 font-medium">Okunmamış</span></p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-emerald-300 transition-all cursor-pointer" onClick={() => onNavigate?.('kdv-iadesi')}>
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px]">4.2M ₺</Badge>
          </div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">KDV İade Dosyaları</p>
          <p className="text-2xl font-black text-slate-900 mt-1">8 <span className="text-xs text-slate-400 font-medium">Toplam</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Critical Risks */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[14px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Kritik Riskler & Uyarılar
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold border-slate-200 bg-white">MAYIS 2026</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900 text-[13px]">Yüksek Kasa Bakiyesi</h4>
                    <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-black">KRİTİK</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1">
                    <span>ABC Tekstil Ltd.</span>
                    <span className="text-slate-400 select-none">•</span>
                    <span>12.05.2026</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed font-medium">Kasa bakiyesi 500.000 TL sınırını aşmıştır. Adat faizi riski %92. Ortaklar cari hesabı ile karşılaştırılmalıdır.</p>
                </div>

                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900 text-[13px]">Mükerrer Kayıt Tespiti</h4>
                    <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-black">YÜKSEK</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1">
                    <span>Global Lojistik A.Ş.</span>
                    <span className="text-slate-400 select-none">•</span>
                    <span>11.05.2026</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed font-medium">Aynı VKN ve tutarlı (12.450,00 TL) 3 adet fatura girişi tespit edildi. Muhasebe kaydı mükerrer olabilir.</p>
                </div>

                <div className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900 text-[13px]">KEP Tebligat Süresi</h4>
                    <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-black">ORTA</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1">
                    <span>Ege İnşaat</span>
                    <span className="text-slate-400 select-none">•</span>
                    <span>10.05.2026</span>
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed font-medium">GİB üzerinden gelen tebligatın cevap süresi yarın doluyor. Kanıt dosyası hazırlanmalıdır.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 shadow-sm">
               <CardHeader className="py-3 px-5 border-b border-slate-50">
                  <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-800">Eksik Belge Durumu</CardTitle>
               </CardHeader>
               <CardContent className="p-5">
                  <div className="space-y-4">
                     <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Banka Dekontları</span>
                        <span className="text-[11px] font-black text-rose-600">12 EKSİK</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full w-[35%]"></div>
                     </div>
                     
                     <div className="flex items-center justify-between mb-1 pt-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Sözleşmeler (Firma)</span>
                        <span className="text-[11px] font-black text-amber-600">8 EKSİK</span>
                     </div>
                     <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[60%]"></div>
                     </div>
                  </div>
               </CardContent>
            </Card>
            
            <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between shadow-lg">
               <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">YMM İade Onayı</p>
                  <Calculator className="w-4 h-4 text-emerald-400" />
               </div>
               <div className="mt-4">
                  <p className="text-3xl font-black">4 <span className="text-xs text-slate-500 font-medium">Açık Dosya</span></p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium leading-relaxed">Ön kontrolü tamamlanmış 4 iade dosyasında YMM tasdik imzası bekleniyor.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Action Items & Tasks */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="py-4 px-5 border-b border-slate-50">
              <CardTitle className="text-[13px] font-black uppercase tracking-widest text-slate-800">Günün Görevleri</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  <div className="p-4 flex items-start gap-3">
                     <div className="mt-1 w-4 h-4 border-2 border-slate-200 rounded flex-shrink-0"></div>
                     <div>
                        <p className="text-[12px] font-bold text-slate-800">KDV1 Son Kontroller</p>
                        <p className="text-[10px] text-slate-500 font-medium">Bugün 10:30</p>
                     </div>
                  </div>
                  <div className="p-4 flex items-start gap-3">
                     <div className="mt-1 w-4 h-4 border-2 border-slate-200 rounded flex-shrink-0"></div>
                     <div>
                        <p className="text-[12px] font-bold text-slate-800">Mükellef Rapor Gönderimi</p>
                        <p className="text-[10px] text-slate-500 font-medium">Bugün 14:00</p>
                     </div>
                  </div>
                  <div className="p-4 flex items-start gap-3">
                     <div className="mt-1 w-4 h-4 border-2 border-indigo-500 rounded flex-shrink-0 bg-indigo-50 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                     </div>
                     <div>
                        <p className="text-[12px] font-bold text-slate-400 line-through decoration-slate-300">Resmi Gazete Taraması</p>
                        <p className="text-[10px] text-slate-400 font-medium">Tamamlandı</p>
                     </div>
                  </div>
               </div>
               <div className="p-3 border-t border-slate-50">
                  <Button variant="ghost" className="w-full h-8 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 tracking-widest uppercase">
                    Tüm Görevleri Yönet
                  </Button>
               </div>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-indigo-100" />
                </div>
                <h4 className="text-[12px] font-black uppercase tracking-widest">Akıllı Öneri</h4>
              </div>
              <p className="text-[12px] font-medium leading-relaxed text-indigo-50">
                "KDV iadelerinde bu ayki karşıt inceleme verimliliği %15 arttı. 3 mükellef için adatlandırma süresi doluyor, hatırlatma yapabilirim."
              </p>
              <Button className="w-full mt-5 bg-white text-indigo-600 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest h-10 shadow-lg">
                Hemen Uygula
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-12 md:items-start mt-8">
        
        {/* Audit Report List */}
        <div className="md:col-span-8 flex flex-col">
           <Card className="shadow-md border-slate-200 overflow-hidden">
             <CardHeader className="bg-slate-900 px-6 py-5 border-b border-slate-800">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-3 text-white tracking-tight">
                   <div className="relative flex h-3 w-3">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                   </div>
                   Akıllı Ön Denetim Raporu
                   <div className="flex items-center gap-2 ml-4">
                     <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30 tracking-widest hidden sm:inline-block">SİSTEM AKTİF</span>
                     <span className="text-[11px] font-bold bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded border border-blue-500/30 tracking-widest hidden sm:inline-block">GÜVENLİ MOD AKTİF</span>
                   </div>
                 </CardTitle>
                 <span className="text-[11px] text-slate-300 font-bold tracking-widest bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 shadow-sm">DÜN GECE: 142 FİRMA TARANDI</span>
               </div>
             </CardHeader>
             <CardContent className="bg-slate-900 p-6 space-y-4">
               {/* Red Alert */}
               <div className="bg-slate-800/80 border-l-[4px] border-l-rose-500 rounded-r-lg pl-5 pr-5 py-4 shadow-sm hover:bg-slate-800 transition-colors">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="font-bold text-white text-base">VUK 359 Şüphesi Tespit Edildi</h4>
                   <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded">KRİTİK RİSK</span>
                 </div>
                 <p className="text-slate-300 text-sm font-medium leading-relaxed">2 firmada sahte belge emareleri bulundu. İnceleme havuzuna alındı ve onay bekliyor.</p>
               </div>
               
               {/* Yellow Alert */}
               <div className="bg-slate-800/80 border-l-[4px] border-l-amber-500 rounded-r-lg pl-5 pr-5 py-4 shadow-sm hover:bg-slate-800 transition-colors">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="font-bold text-white text-base">Demir Lojistik: KDV Uyuşmazlığı</h4>
                   <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded">ORTA RİSK</span>
                 </div>
                 <p className="text-slate-300 text-sm font-medium leading-relaxed">Yüksek tutarlı KDV indirimi uyuşmazlığı var. Geçici vergi dönemi öncesi düzeltme şart.</p>
               </div>
               
               <div className="pt-4">
                 <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white border-none h-12 font-bold text-sm uppercase tracking-widest shadow-md transition-colors">
                   DETAYLI TARAMA RAPORU
                 </Button>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Tasks List */}
        <div className="md:col-span-4 flex flex-col">
           <Card className="shadow-sm border-slate-200 bg-white flex-1 h-full flex flex-col">
             <CardHeader className="pb-4 border-b border-slate-100 px-6 pt-6 shrink-0">
               <div className="flex items-center justify-between">
                 <CardTitle className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-slate-500" />
                   Yaklaşan Görevler
                 </CardTitle>
                 <div className="bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider shadow-sm">5 BEKLEYEN</div>
               </div>
             </CardHeader>
             <CardContent className="px-0 py-0 flex-1 flex flex-col">
                <div className="flex-1 divide-y divide-slate-100">
                  
                  {/* Task 1 */}
                  <div className="group px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-400 tracking-wider">F3 FİRMASI</span>
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">YAPILACAK</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">Müşteriden eksik belge bekleniyor</p>
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      25 Mart 2026
                    </div>
                  </div>
                  
                  {/* Task 2 */}
                  <div className="group px-6 py-4 transition-colors cursor-pointer bg-blue-50/40 hover:bg-blue-50/70 border-l-[3px] border-l-blue-500 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-blue-600 tracking-wider">F1 FİRMASI</span>
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">YAPILACAK</span>
                    </div>
                    <p className="text-sm font-bold text-blue-800 mb-1.5 leading-snug">KDV beyannamesi son kontrol</p>
                    <div className="flex items-center text-xs text-blue-600/80 font-medium font-semibold">
                      Bugün
                    </div>
                  </div>

                  {/* Task 3 */}
                  <div className="group px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-slate-400 tracking-wider">F2 FİRMASI</span>
                      <span className="bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">DEVAM EDİYOR</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">Muhtasar beyanname hazırlığı</p>
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      26 Mart 2026
                    </div>
                  </div>

                </div>
             </CardContent>
           </Card>
        </div>

      </div>

      <Dialog open={isResultOpen} onOpenChange={setIsResultOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Üçlü Denetim Analiz Sonucu
            </DialogTitle>
            <DialogDescription>
              Yüklenen belge Vergi Müfettişi, YMM ve Bağımsız Denetçi perspektifinden incelendi.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2 mt-4 custom-scrollbar">
            <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-800 prose-a:text-blue-600">
              <ReactMarkdown>{analysisResult || ''}</ReactMarkdown>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-8 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Nihai Kontrol Notu</h4>
                <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                  Bu analiz ön değerlendirme niteliğindedir. Nihai karar için ilgili belgeler, kanıtlar, ödeme kayıtları, teslim/hizmet ifası, defter kayıtları, beyannameler ve resmi mevzuat dayanakları mali müşavir, YMM veya bağımsız denetçi tarafından kontrol edilmelidir.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Action Bar (Sticky) */}
      <ActionBar 
        onUpload={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        onAnalyze={() => handleStartAnalysis()}
        isProcessing={isAnalyzing}
        onShowRisks={() => onNavigate?.('reports')}
        onDownloadPdf={() => toast.success('Analiz raporu PDF olarak hazırlanıyor...')}
        onDownloadExcel={() => toast.success('Veriler Excel formatına dönüştürülüyor...')}
        onDownloadWord={() => toast.success('Savunma taslağı Word olarak indiriliyor...')}
      />
    </div>
  );
}

function MetricCard({ title, count, icon, color, onClick }: { title: string, count: number, icon: React.ReactNode, color: string, onClick?: () => void }) {
  const colorMap: any = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-50 group-hover:bg-blue-100', border: 'border-blue-100 group-hover:border-blue-200', card: 'hover:border-blue-300' },
    rose: { text: 'text-rose-600', bg: 'bg-rose-50 group-hover:bg-rose-100', border: 'border-rose-100 group-hover:border-rose-200', card: 'hover:border-rose-300' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-50 group-hover:bg-amber-100', border: 'border-amber-100 group-hover:border-amber-200', card: 'hover:border-amber-300' },
    orange: { text: 'text-orange-600', bg: 'bg-orange-50 group-hover:bg-orange-100', border: 'border-orange-100 group-hover:border-orange-200', card: 'hover:border-orange-300' },
    indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50 group-hover:bg-indigo-100', border: 'border-indigo-100 group-hover:border-indigo-200', card: 'hover:border-indigo-300' },
    emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50 group-hover:bg-emerald-100', border: 'border-emerald-100 group-hover:border-emerald-200', card: 'hover:border-emerald-300' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-50 group-hover:bg-purple-100', border: 'border-purple-100 group-hover:border-purple-200', card: 'hover:border-purple-300' },
    teal: { text: 'text-teal-600', bg: 'bg-teal-50 group-hover:bg-teal-100', border: 'border-teal-100 group-hover:border-teal-200', card: 'hover:border-teal-300' },
    slate: { text: 'text-slate-600', bg: 'bg-slate-50 group-hover:bg-slate-100', border: 'border-slate-100 group-hover:border-slate-200', card: 'hover:border-slate-300' },
    red: { text: 'text-red-600', bg: 'bg-red-50 group-hover:bg-red-100', border: 'border-red-100 group-hover:border-red-200', card: 'hover:border-red-300' },
  };

  const currentStatus = colorMap[color] || colorMap.blue;

  return (
    <Card 
      className={`shadow-sm border-slate-200 bg-white ${currentStatus.card} hover:shadow-md transition-all cursor-pointer py-5 px-3 flex flex-col items-center justify-center text-center h-[120px] group`}
      onClick={onClick}
    >
       <div className={`w-10 h-10 rounded-xl ${currentStatus.bg} border ${currentStatus.border} transition-colors flex items-center justify-center mb-2 shadow-sm`}>
         {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5 ${currentStatus.text}` } as any)}
       </div>
       <div className="text-xl font-black mb-1 text-slate-800">{count}</div>
       <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-700 uppercase tracking-wider leading-tight max-w-full truncate w-full">{title}</span>
    </Card>
  )
}

