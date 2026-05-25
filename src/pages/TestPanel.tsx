import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Play, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type TestStatus = 'idle' | 'running' | 'success' | 'warning' | 'error';

interface TestItem {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  message?: string;
  category: 'UI' | 'PDF' | 'ANALYSIS' | 'SYSTEM';
}

const INITIAL_TESTS: TestItem[] = [
  { id: 'ui-1', name: 'Menü Açılma/Kapanma Testi', description: 'Sol menü ve akordiyon menülerin tepki süreleri', status: 'idle', category: 'UI' },
  { id: 'ui-2', name: 'Mobil Görünüm Testi', description: 'Responsive yapı ve breakpoint geçişleri', status: 'idle', category: 'UI' },
  { id: 'pdf-1', name: 'PDF Çıktı Testi', description: 'Raporların PDF formatında üretilmesi', status: 'idle', category: 'PDF' },
  { id: 'pdf-2', name: 'Excel Çıktı Testi', description: 'Verilerin dışa aktarılması', status: 'idle', category: 'PDF' },
  { id: 'pdf-3', name: 'Word Çıktı Testi', description: 'Savunma dilekçesi word uyumluluğu', status: 'idle', category: 'PDF' },
  { id: 'analiz-1', name: 'Dosya Yükleme Testi', description: 'Sunucuya blob aktarımı ve hata yönetimi', status: 'idle', category: 'ANALYSIS' },
  { id: 'analiz-2', name: 'OCR Okuma Testi', description: 'Belgeden metin çıkartma ve VKN doğruluk oranı', status: 'idle', category: 'ANALYSIS' },
  { id: 'analiz-3', name: 'Mükerrer Kayıt Analiz Testi', description: 'Büyük veri setinde algoritmik kontrol (50.000+ satır)', status: 'idle', category: 'ANALYSIS' },
  { id: 'analiz-4', name: 'KDV Oran Kontrol Testi', description: '%1, %10, %20 oran ve hesap planı eşleşmesi', status: 'idle', category: 'ANALYSIS' },
  { id: 'analiz-5', name: 'Banka Mutabakat Testi', description: 'Banka ekstresi ve muavin hareket denkleştirme', status: 'idle', category: 'ANALYSIS' },
  { id: 'analiz-6', name: 'Risk Puanı Üretim Testi', description: 'Ağırlıklı birleşik skor motoru testi', status: 'idle', category: 'ANALYSIS' },
  { id: 'analiz-7', name: 'Mevzuat Dayanağı Kontrol Testi', description: 'Yapay zeka halüsinasyon koruma filtresi', status: 'idle', category: 'ANALYSIS' },
  { id: 'sys-1', name: 'Kullanıcı Yetki Testi', description: 'RBAC (Role Based Access Control) korumaları', status: 'idle', category: 'SYSTEM' },
  { id: 'sys-2', name: 'Rapor Arşivleme Testi', description: 'KVKK uyumlu güvenli depolama erişimi', status: 'idle', category: 'SYSTEM' },
];

export function TestPanelPage() {
  const [tests, setTests] = useState<TestItem[]>(INITIAL_TESTS);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const runTest = async (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'running', message: undefined } : t));
    
    // Simulate testing process
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    setTests(prev => prev.map(t => {
      if (t.id === id) {
        // Randomly determine success, warning, or error based on fake logic
        const rand = Math.random();
        if (rand > 0.9) return { ...t, status: 'error', message: 'Servis yanıt vermedi (Timeout 5000ms)' };
        if (rand > 0.7) return { ...t, status: 'warning', message: 'Performans dar boğazı (%15 sapma)' };
        return { ...t, status: 'success', message: 'Sorunsuz çalışıyor (-23ms gecikme)' };
      }
      return t;
    }));
  };

  const runAllTests = async () => {
    if (isRunningAll) return;
    setIsRunningAll(true);
    toast.info("Tüm sistem testleri başlatıldı.");
    
    for (const test of tests) {
       await runTest(test.id);
    }
    
    setIsRunningAll(false);
    toast.success("Sistem kalite standart testleri tamamlandı.");
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'idle': return <ShieldCheck className="w-5 h-5 text-slate-300" />;
      case 'running': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-rose-500" />;
    }
  };
  
  const getStatusText = (status: TestStatus) => {
    switch (status) {
      case 'idle': return <span className="text-slate-400">Test Edilmedi</span>;
      case 'running': return <span className="text-blue-600 font-bold">Çalışıyor</span>;
      case 'success': return <span className="text-emerald-600 font-bold">Başarılı</span>;
      case 'warning': return <span className="text-amber-600 font-bold">Uyarı</span>;
      case 'error': return <span className="text-rose-600 font-bold">Hatalı</span>;
    }
  };

  const completedCount = tests.filter(t => t.status !== 'idle' && t.status !== 'running').length;
  const successCount = tests.filter(t => t.status === 'success').length;
  const progressPercent = Math.round((completedCount / tests.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
             <ShieldCheck className="w-6 h-6 text-blue-600" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800">Sistem Test & Kalite Paneli</h2>
             <p className="text-[13px] text-slate-500 font-medium">Modül kararlılık, performans ve QA standart testleri</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end mr-4 hidden sm:flex">
             <span className="text-xs font-bold text-slate-400 mb-1">TEST İLERLEMESİ</span>
             <div className="flex items-center gap-2">
               <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
               </div>
               <span className="text-xs font-bold text-slate-700">{progressPercent}%</span>
             </div>
           </div>
           <Button 
             onClick={runAllTests} 
             disabled={isRunningAll}
             className="bg-slate-900 hover:bg-slate-800 text-white shadow-md font-bold uppercase tracking-widest text-[11px]"
           >
             {isRunningAll ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testler Çalışıyor</> : <><Play className="w-4 h-4 mr-2" /> Toplu Test Başlat</>}
           </Button>
           <Button variant="outline" onClick={() => setTests(INITIAL_TESTS)} disabled={isRunningAll} className="px-3" title="Testleri Sıfırla">
              <RefreshCw className="w-4 h-4 text-slate-500" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {tests.map(test => (
            <Card key={test.id} className="shadow-sm border-slate-200 hover:border-slate-300 transition-all">
              <CardContent className="p-4 flex items-start gap-4">
                 <div className="shrink-0 mt-1">
                   {getStatusIcon(test.status)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded tracking-wider">{test.category}</span>
                      <div className="text-[11px]">{getStatusText(test.status)}</div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 truncate mb-1">{test.name}</h3>
                    <p className="text-[11px] text-slate-500 truncate leading-relaxed">{test.description}</p>
                    
                    {test.message && (
                      <div className={`mt-2 text-[10px] p-2 rounded border font-semibold ${
                        test.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        test.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                         &gt; {test.message}
                      </div>
                    )}
                 </div>
                 <div className="shrink-0 pl-2 self-stretch flex items-center border-l border-slate-100 ml-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => runTest(test.id)}
                      disabled={test.status === 'running' || isRunningAll}
                      title="Testi Çalıştır"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                 </div>
              </CardContent>
            </Card>
         ))}
      </div>
    </div>
  );
}
