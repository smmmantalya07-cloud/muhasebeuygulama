import React, { useState } from 'react';
import { 
  Scale, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Upload, 
  FileText, 
  ArrowRight,
  TrendingDown,
  Activity,
  PieChart as PieChartIcon,
  Info,
  Download,
  Zap,
  BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';

type RiskLevel = 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';

interface AnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  ratios: {
    liquidity: number; // Cari Oran
    acidTest: number; // Likidite Oranı
    leverage: number; // Borçlanma Oranı
    margin: number;   // Kar Marjı
  };
  findings: {
    category: string;
    description: string;
    impact: 'Negative' | 'Positive' | 'Neutral';
    expertOpinion: string;
  }[];
  chartData: any[];
}

export function FinancialStatementAnalysisPage() {
  const [bilancos, setBilancos] = useState<File[]>([]);
  const [gelirTablosus, setGelirTablosus] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    salesChange: 0,
    expenseChange: 0,
  });

  const handleFileUpload = (type: 'bilanco' | 'gelir', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (type === 'bilanco') setBilancos([...bilancos, ...files]);
      else setGelirTablosus([...gelirTablosus, ...files]);
      toast.success(`${files.length} belge eklendi.`);
    }
  };

  const runAnalysis = () => {
    if (bilancos.length === 0 || gelirTablosus.length === 0) {
      toast.error('Analiz için hem Bilanço hem de Gelir Tablosu yüklemelisiniz.');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        riskLevel: 'Yüksek',
        riskScore: 72,
        ratios: {
          liquidity: 1.15,
          acidTest: 0.82,
          leverage: 0.65,
          margin: 0.12
        },
        findings: [
          {
            category: 'Likidite Riski',
            description: 'Kısa vadeli borçların karşılanmasında stok bağımlılığı yüksek.',
            impact: 'Negative',
            expertOpinion: 'Cari oran 1.50 seviyesinin altında. Stok devir hızındaki yavaşlama nakit akış sıkışıklığına yol açabilir.'
          },
          {
            category: 'Kârlılık Analizi',
            description: 'Faaliyet kâr marjında geçen yıla oranla %4 daralma tespit edildi.',
            impact: 'Negative',
            expertOpinion: 'Pazarlama ve genel yönetim giderlerindeki artış hızı satış gelirlerinden daha yüksek. Operasyonel verimlilik düşüyor.'
          },
          {
            category: 'Finansal Yapı',
            description: 'Yatırımların %70\'i kısa vadeli kredilerle finanse ediliyor.',
            impact: 'Negative',
            expertOpinion: 'Vade uyumsuzluğu (mismatch) riski var. Uzun vadeli yatırımlar özkaynak veya uzun vadeli borçla desteklenmeli.'
          },
          {
            category: 'Fırsat Alanı',
            description: 'Yabancı para pozisyonundaki fazlalık kur artışlarında gelir yaratıyor.',
            impact: 'Positive',
            expertOpinion: 'Döviz fazlası hedge mekanizması olarak çalışıyor ancak kur volatilitesine karşı dikkatli olunmalı.'
          }
        ],
        chartData: [
          { name: 'Dönen Varlıklar', current: 1200000, previous: 1050000 },
          { name: 'Kısa Vadeli Borçlar', current: 1040000, previous: 850000 },
          { name: 'Özkaynaklar', current: 800000, previous: 780000 },
          { name: 'Satış Gelirleri', current: 2500000, previous: 2200000 }
        ]
      };
      setResult(mockResult);
      setIsAnalyzing(false);
      toast.success('Finansal risk analizi tamamlandı.');
    }, 2500);
  };

  const getRecalculatedResult = (): AnalysisResult | null => {
    if (!result) return null;
    if (!isSimulationMode) return result;

    const salesFactor = 1 + simulationParams.salesChange / 100;
    const expenseFactor = 1 + simulationParams.expenseChange / 100;

    // Simplified recalculation
    const newMargin = result.ratios.margin * (salesFactor / expenseFactor);
    const newCurrentAssets = result.chartData.find(d => d.name === 'Dönen Varlıklar').current * salesFactor;
    const newSales = result.chartData.find(d => d.name === 'Satış Gelirleri').current * salesFactor;
    
    const newLiquidity = newCurrentAssets / result.chartData.find(d => d.name === 'Kısa Vadeli Borçlar').current;
    
    // Change risk score based on margin and liquidity
    let newScore = result.riskScore;
    if (salesFactor > 1 && expenseFactor <= 1) newScore -= 10;
    if (salesFactor < 1) newScore += 15;
    
    newScore = Math.max(10, Math.min(99, newScore));
    
    let newLevel: RiskLevel = 'Düşük';
    if (newScore > 80) newLevel = 'Kritik';
    else if (newScore > 60) newLevel = 'Yüksek';
    else if (newScore > 40) newLevel = 'Orta';

    return {
      ...result,
      riskLevel: newLevel,
      riskScore: newScore,
      ratios: {
        ...result.ratios,
        margin: newMargin,
        liquidity: newLiquidity,
      },
      chartData: result.chartData.map(d => {
        if (d.name === 'Satış Gelirleri') return { ...d, current: newSales };
        if (d.name === 'Dönen Varlıklar') return { ...d, current: newCurrentAssets };
        return d;
      })
    };
  };

  const finalResult = getRecalculatedResult();

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Düşük': return 'bg-emerald-500';
      case 'Orta': return 'bg-amber-500';
      case 'Yüksek': return 'bg-orange-500';
      case 'Kritik': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const getRiskText = (level: RiskLevel) => {
    switch (level) {
      case 'Düşük': return 'text-emerald-600 border-emerald-100 bg-emerald-50';
      case 'Orta': return 'text-amber-600 border-amber-100 bg-amber-50';
      case 'Yüksek': return 'text-orange-600 border-orange-100 bg-orange-50';
      case 'Kritik': return 'text-rose-600 border-rose-100 bg-rose-50';
      default: return 'text-slate-600 border-slate-100 bg-slate-50';
    }
  };

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Finansal_Risk_Raporu_${new Date().toLocaleDateString()}`;
    window.print();
    document.title = originalTitle;
  };

  const handleSimulation = () => {
    setIsSimulationMode(!isSimulationMode);
    if (!isSimulationMode) {
      toast.info('Simülasyon Modu (Neyse-Ne) aktif edildi. Sağ taraftaki ayarları kullanarak senaryoları test edin.');
    } else {
      toast.success('Gerçek verilere dönüldü.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 print:p-0 print:m-0 print:max-w-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1 flex items-center gap-3">
             <Scale className="w-8 h-8 text-blue-600" /> BİLANÇO & GELİR TABLOSU RİSK ANALİZİ
          </h1>
          <p className="text-sm font-medium text-slate-500">Mali tablolarınızı yükleyin, finansal risklerinizi uzman gözüyle değerlendirelim.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar: Uploads */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {isSimulationMode && finalResult ? (
            <Card className="border-blue-200 bg-blue-50/30 shadow-lg animate-in fade-in slide-in-from-left-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" /> SİMÜLASYON AYARLARI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-500">
                    <span>SATIŞ GELİRİ DEĞİŞİMİ</span>
                    <span className={simulationParams.salesChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      %{simulationParams.salesChange > 0 ? '+' : ''}{simulationParams.salesChange}
                    </span>
                  </div>
                  <input 
                    type="range" min="-50" max="50" step="5"
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={simulationParams.salesChange}
                    onChange={(e) => setSimulationParams(p => ({ ...p, salesChange: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-500">
                    <span>GİDER DEĞİŞİMİ</span>
                    <span className={simulationParams.expenseChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      %{simulationParams.expenseChange > 0 ? '+' : ''}{simulationParams.expenseChange}
                    </span>
                  </div>
                  <input 
                    type="range" min="-50" max="50" step="5"
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    value={simulationParams.expenseChange}
                    onChange={(e) => setSimulationParams(p => ({ ...p, expenseChange: parseInt(e.target.value) }))}
                  />
                </div>
                <Button 
                  variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase text-blue-600 h-8"
                  onClick={() => setSimulationParams({ salesChange: 0, expenseChange: 0 })}
                >
                  AYARLARI SIFIRLA
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50">
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> DOSYA MERKEZİ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BİLANÇO (XLSX, PDF)</p>
                  <label className="block p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-6 h-6 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-500 text-center">
                        {bilancos.length > 0 ? `${bilancos.length} Dosya Seçildi` : 'BİLANÇO YÜKLE'}
                      </span>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload('bilanco', e)} multiple />
                  </label>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GELİR TABLOSU (XLSX, PDF)</p>
                  <label className="block p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-500 text-center">
                        {gelirTablosus.length > 0 ? `${gelirTablosus.length} Dosya Seçildi` : 'GELİR TABLOSU YÜKLE'}
                      </span>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload('gelir', e)} multiple />
                  </label>
                </div>

                <Button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing || (bilancos.length === 0 && gelirTablosus.length === 0)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 uppercase tracking-widest text-[11px] mt-4 shadow-lg shadow-blue-100 rounded-xl"
                >
                  {isAnalyzing ? 'UZMAN ANALİZİ YAPIYOR...' : 'ANALİZİ BAŞLAT'}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-900 border-none text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 p-3 opacity-20"><Zap className="w-12 h-12" /></div>
             <CardContent className="p-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">UZMAN NOTU</h4>
                <p className="text-[11px] leading-relaxed font-bold text-slate-300 italic">
                  "Finansal analizde sadece sayılar değil, sayıların arasındaki 'boşluklar' (likidite/vade) gerçek riski gösterir. Borç rasyoları sektör ortalamasıyla karşılaştırılmalıdır."
                </p>
             </CardContent>
          </Card>
        </div>

        {/* Main Area: Analysis Results */}
        <div className="lg:col-span-3">
          {!finalResult && !isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center print:hidden">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Activity className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Finansal Veriler Bekleniyor</h3>
              <p className="text-sm text-slate-400 max-w-sm font-medium">
                Sol taraftaki panelden mali tablolarınızı yükleyerek profesyonel risk analiz raporunuzu oluşturabilirsiniz.
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="space-y-6 print:hidden">
               <div className="grid grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)}
               </div>
               <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
               <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
               </div>
            </div>
          ) : (
            <motion.div id="report-content" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              {/* Simulation Banner */}
              {isSimulationMode && (
                <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center justify-between shadow-lg print:hidden">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">SİMÜLASYON MODU AKTİF</span>
                  </div>
                  <Button variant="ghost" className="h-7 text-[10px] font-black uppercase text-white hover:bg-white/20" onClick={handleSimulation}>
                    MODDAN ÇIK
                  </Button>
                </div>
              )}

              {/* Risk Scoreboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={`border-2 ${getRiskText(finalResult.riskLevel)} shadow-sm`}>
                   <CardContent className="p-6 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">NİHAİ RİSK SEVİYESİ</p>
                      <div className="text-3xl font-black mb-1">{finalResult.riskLevel}</div>
                      <div className="w-full h-1.5 bg-white/50 rounded-full mt-4 overflow-hidden">
                         <div className={`h-full ${getRiskColor(finalResult.riskLevel)}`} style={{ width: `${finalResult.riskScore}%` }} />
                      </div>
                   </CardContent>
                </Card>

                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'CARİ ORAN', value: finalResult.ratios.liquidity.toFixed(2), unit: '', status: finalResult.ratios.liquidity > 1.5 ? 'Normal' : 'Düşük' },
                     { label: 'ASİT-TEST', value: finalResult.ratios.acidTest.toFixed(2), unit: '', status: finalResult.ratios.acidTest > 1 ? 'Güçlü' : 'Riskli' },
                     { label: 'KALDIRAÇ', value: finalResult.ratios.leverage * 100, unit: '%', status: finalResult.ratios.leverage < 0.5 ? 'Güvenli' : 'Yüksek' },
                     { label: 'KAR MARJI', value: finalResult.ratios.margin * 100, unit: '%', status: finalResult.ratios.margin > 0.15 ? 'Verimli' : 'İnce' },
                   ].map((ratio, idx) => (
                     <Card key={idx} className="border-slate-100 shadow-none bg-slate-50/50">
                        <CardContent className="p-4 text-center">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{ratio.label}</p>
                           <div className="text-xl font-black text-slate-800">{ratio.value}{ratio.unit}</div>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-2 inline-block ${
                             ratio.status === 'Normal' || ratio.status === 'Güçlü' || ratio.status === 'Güvenli' || ratio.status === 'Verimli'
                               ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                           }`}>
                             {ratio.status}
                           </span>
                        </CardContent>
                     </Card>
                   ))}
                </div>
              </div>

              {/* Chart Comparison */}
              <Card className="border-slate-200 print:break-inside-avoid">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
                    <BarChart2 className="w-4 h-4 text-blue-600" /> BİLANÇO KARŞILAŞTIRMALI ANALİZ (DÖNEMSEL)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={finalResult.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="previous" name="Geçen Dönem" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
                        <Bar dataKey="current" name="Cari Dönem" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Expert Findings */}
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4 text-rose-500" /> KRİTİK DENETİM VE RİSK BULGULARI
                 </h3>
                 <div className="grid gap-4">
                   {finalResult.findings.map((find, idx) => (
                     <Card key={idx} className="border-slate-200 group overflow-hidden transition-all hover:border-blue-200 hover:shadow-md print:break-inside-avoid">
                        <div className="flex flex-col md:flex-row">
                           <div className={`md:w-2 shrink-0 ${find.impact === 'Negative' ? 'bg-rose-500' : (find.impact === 'Positive' ? 'bg-emerald-500' : 'bg-slate-300')}`} />
                           <div className="p-6 flex-1">
                              <div className="flex items-center justify-between mb-2">
                                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{find.category}</h4>
                                 <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${
                                   find.impact === 'Negative' ? 'bg-rose-100 text-rose-700' : (find.impact === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')
                                 }`}>
                                   {find.impact === 'Negative' ? 'RİSK' : (find.impact === 'Positive' ? 'POZİTİF' : 'NÖTR')}
                                 </span>
                              </div>
                              <p className="text-sm text-slate-700 font-bold mb-4 leading-relaxed">{find.description}</p>
                              
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic relative">
                                 <div className="absolute -top-3 left-4 bg-white px-2 text-[9px] font-black text-blue-600 uppercase tracking-tighter border border-blue-100 rounded">FİNANSAL DANIŞMAN GÖRÜŞÜ</div>
                                 <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                   "{find.expertOpinion}"
                                 </p>
                              </div>
                           </div>
                        </div>
                     </Card>
                   ))}
                  </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 print:hidden">
                 <Button 
                   onClick={handleDownloadPDF}
                   className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-slate-200"
                 >
                   <Download className="w-4 h-4 mr-2" /> KAPSAMLI RİSK RAPORU İNDİR (PDF)
                 </Button>
                 <Button 
                   variant={isSimulationMode ? "destructive" : "outline"}
                   onClick={handleSimulation}
                   className="flex-1 border-slate-200 text-slate-600 font-bold h-12 uppercase tracking-widest text-[11px] rounded-xl hover:bg-slate-50"
                 >
                    {isSimulationMode ? 'SİMÜLASYONU KAPAT' : 'SİMÜLASYON OLUŞTUR (NEYSE-NE)'}
                 </Button>
              </div>

              {/* Professional Disclaimer */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                 <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                 <p className="text-[10px] text-blue-700/70 font-bold leading-relaxed italic">
                    Yönetici Özeti: Bu rapor verileriniz üzerinden otomatik finansal modelleme ile oluşturulmuştur. Yatırım kararları veya kredi başvuruları öncesinde bağımsız denetçi görüşü alınması tavsiye edilir. Risk katsayısı sektörel bazda değişkenlik gösterebilir.
                 </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
