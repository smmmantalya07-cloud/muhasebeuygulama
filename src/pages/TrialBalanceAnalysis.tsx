import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  Copy, 
  FileText, 
  ArrowRight,
  PieChart as PieChartIcon,
  Info,
  ExternalLink,
  Save,
  Download,
  Upload,
  X as CloseIcon,
  Building2,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';

import { AiAssistant, FirmContextData } from '@/components/AiAssistant';

interface MizanRecord {
  code: string;
  name: string;
  debit: number;
  credit: number;
  debitBalance: number;
  creditBalance: number;
}

export function TrialBalanceAnalysisPage({ activeFirm: propActiveFirm }: { activeFirm: FirmContextData | null }) {
  const activeFirm = propActiveFirm || { name: 'KAYITLI FİRMA SEÇİLMEDİ', vkn: '0000000000', vd: 'BELİRTİLMEDİ' };
  const [tbData, setTbData] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const formatTRNumber = (val: number) => val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const parseTRNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    if (val === null || val === undefined) return 0;
    const str = String(val).trim();
    if (!str || str === '-' || str === '.') return 0;
    
    let cleaned = str.replace(/\s/g, '');
    
    // Turkish accounting formats often use '.' as thousands separator and ',' as decimal
    // Examples: 1.234.567,89 or 1.234,56 or 1234,56
    
    // If it has BOTH dot and comma, we need to know which is which.
    // In TR: last separator is usually the decimal.
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    
    if (lastComma !== -1 && lastDot !== -1) {
      if (lastComma > lastDot) {
        // TR Format: 1.234,56
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // US Format: 1,234.56
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (lastComma !== -1) {
      // Only comma: 1234,56 or 1,234 (could be either, but in TR it's 99% decimal if it's 1-2 digits after)
      const parts = cleaned.split(',');
      if (parts[parts.length - 1].length <= 2) {
        cleaned = cleaned.replace(',', '.');
      } else {
        cleaned = cleaned.replace(',', '');
      }
    } else if (lastDot !== -1) {
      // Only dot: 1.234 or 1234.56
      const parts = cleaned.split('.');
      if (parts[parts.length - 1].length === 3) {
        // Thousands separator
        cleaned = cleaned.replace(/\./g, '');
      }
      // If multiple dots, definitely thousands
      if (parts.length > 2) {
        cleaned = cleaned.replace(/\./g, '');
      }
    }
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setTbData(`[${file.name} dosyası yüklendi - Analiz için hazır]`);
      toast.success(`${file.name} başarıyla seçildi.`);
    }
  };

  const processRecords = (records: MizanRecord[]) => {
    let sales = 0; // 600
    let salesDeductions = 0; // 610-612
    let cogs = 0; // 620
    let operatingExpenses = 0; // 630
    let otherIncome = 0; // 640
    let otherExpenses = 0; // 650
    let financialExpenses = 0; // 660
    let extraordinaryIncome = 0; // 670
    let extraordinaryExpenses = 0; // 680
    let kkeg = 0;

    records.forEach(r => {
      const codeStr = r.code ? String(r.code).trim() : '';
      const nameStr = r.name ? String(r.name).toUpperCase() : '';
      
      // Income Statement Accounts (6xx)
      if (codeStr.startsWith('60')) sales += r.credit;
      if (codeStr.startsWith('61')) salesDeductions += r.debit;
      if (codeStr.startsWith('62')) cogs += r.debit;
      if (codeStr.startsWith('63')) operatingExpenses += r.debit;
      if (codeStr.startsWith('64')) otherIncome += r.credit;
      if (codeStr.startsWith('65')) otherExpenses += r.debit;
      if (codeStr.startsWith('66')) financialExpenses += r.debit;
      if (codeStr.startsWith('67')) extraordinaryIncome += r.credit;
      if (codeStr.startsWith('68')) extraordinaryExpenses += r.debit;

      // KKEG Search (Heuristic)
      if (nameStr.includes('KKEG') || nameStr.includes('KANUNEN KABUL EDİLMEYEN')) {
        kkeg += r.debit;
      } else if (codeStr.startsWith('689')) {
        // If it's a 689 account and it's not explicitly KKEG, we should check if it's treated as one
        // In many setups 689 is used for KKEG.
        // We'll add this to KKEG for the estimation
        kkeg += r.debit;
      }
    });

    const grossProfit = sales - salesDeductions - cogs;
    // Commercial Profit
    const commercialIncome = sales + otherIncome + extraordinaryIncome;
    const commercialExpense = salesDeductions + cogs + operatingExpenses + otherExpenses + financialExpenses + extraordinaryExpenses;
    const commercialProfit = commercialIncome - commercialExpense;
    const netProfit = commercialProfit;
    
    // Matrah = Commercial Profit + KKEG
    const matrah = netProfit + kkeg;
    // Provisional tax rate for 2025/2026 is 25% for most, 30% for banks/financial
    const taxEstimation = matrah > 0 ? matrah * 0.25 : 0;

    const risks = [];
    const auditPerspectives = {
      inspector: {
        opinion: "Nakit akışı ve ortaklarla olan işlemler mercek altında.",
        risks: [] as string[],
        recommendation: "Adatlandırma hesaplamalarını içeren bir dosya hazırlanmalı."
      },
      ymm: {
        opinion: "Tasdik açısından KKEG ve amortisman kayıtları kritik.",
        risks: [] as string[],
        recommendation: "Yıl içi amortisman giderlerinin mizan uyumu kontrol edilmelidir."
      },
      auditor: {
        opinion: "Finansal tabloların gerçeğe uygunluğu ve dönem kârı doğruluğu.",
        risks: [] as string[],
        recommendation: "Dönemsellik ilkesine göre gider tahakkukları incelenmeli."
      }
    };

    // Dynamic Risk Evaluation & Audit Comments
    records.forEach(r => {
      const code = String(r.code);
      const EPSILON = 0.50; // Ignore differences less than 0.50 TRY

      if (code.startsWith('100') && r.debitBalance > 100000) {
        const risk = { title: 'Kasa Bakiyesi Analizi', detail: `Kasa bakiyesi (${formatTRNumber(r.debitBalance)} TRY) yüksek. Adat faizi ve kasa sayımı riskleri göz önünde bulundurulmalı.`, level: 'Yüksek' };
        risks.push(risk);
        auditPerspectives.inspector.risks.push("Yüksek kasa bakiyesi üzerinden örtülü kazanç eleştirisi gelebilir.");
      }
      
      if (code.startsWith('131') && r.debitBalance > EPSILON) {
        risks.push({ title: 'Ortaklardan Alacaklar', detail: `${formatTRNumber(r.debitBalance)} TRY ortak alacağı tespit edildi. Finansman hizmeti faturası ve adat kontrolü gereklidir.`, level: 'Kritik' });
        auditPerspectives.inspector.risks.push("Ortaklardan alacaklara adat yürütülmemesi vergi ziyaına sebebiyet verir.");
      }

      // Supplier accounts with Debit Balance (Risk if not moved to 159)
      // We check both the reported debitBalance AND the recalculation to be sure
      const actualDebitBalance = Math.max(0, r.debit - r.credit);
      if (code.startsWith('320') && (r.debitBalance > 1000 || actualDebitBalance > 1000)) {
        // Double check: if credit total is larger than debit total, it's NOT a risk
        if (r.credit >= r.debit && r.debitBalance < 1) {
           // This account is fine, ignore
        } else {
          risks.push({ title: 'Tedarikçi Borç Kaydı (Ters Bakiye)', detail: `320 hesabı borç bakiye veriyor (${formatTRNumber(Math.max(r.debitBalance, actualDebitBalance))} TRY). Avans ödemeleri (159) hesabına virmanlanmalı.`, level: 'Orta' });
        }
      }

      // Customer accounts with Credit Balance (Risk if not moved to 340)
      const actualCreditBalance = Math.max(0, r.credit - r.debit);
      if (code.startsWith('120') && (r.creditBalance > 1000 || actualCreditBalance > 1000)) {
         if (r.debit >= r.credit && r.creditBalance < 1) {
           // Skip
         } else {
           risks.push({ title: 'Alıcılar Hesabı (Ters Bakiye)', detail: `120 hesabı alacak bakiye veriyor (${formatTRNumber(Math.max(r.creditBalance, actualCreditBalance))} TRY). Alınan sipariş avansları (340) hesabına aktarılmalı.`, level: 'Orta' });
         }
      }

      // Cash account with Credit Balance (Technical Impossibility)
      if (code.startsWith('100') && r.creditBalance > EPSILON) {
        risks.push({ title: 'Kasada Alacak Bakiyesi', detail: 'Kasa hesabı alacak bakiyesi veriyor, bu teknik olarak imkansızdır. Kayıt hatası düzeltilmeli.', level: 'Kritik' });
      }
    });

    if (kkeg === 0 && (operatingExpenses + otherExpenses) > 1000) {
      risks.push({ title: 'KKEG Ayrıştırılmamış', detail: 'Mizanda KKEG hesabına rastlanmadı. Beyanname öncesi kanunen kabul edilmeyen giderlerin ayrıştırılması şarttır.', level: 'Orta' });
      auditPerspectives.ymm.risks.push("KKEG kalemlerinin tespit edilememesi matrahın düşük beyan edilmesine yol açabilir.");
    }

    if (risks.length === 0) {
      risks.push({ title: 'Normal Görünüm', detail: 'Belirgin bir riskli bakiye (kasa, ortaklar vb.) mizan genelinde tespit edilmedi.', level: 'Düşük' });
    }

    return {
      profitability: {
        grossProfit,
        netProfit,
        taxEstimation,
        kkeg,
        matrah
      },
      auditPerspectives,
      risks: risks.slice(0, 5),
      opportunities: [
        { title: 'Yatırım İndirimi Fiyatlaması', detail: '25x grubu hesaplardaki yatırımlar için indirimli kurumlar vergisi kapısı açık.', level: 'Fırsat' },
        { title: 'Şüpheli Alacak Karşılığı', detail: 'Dava aşamasındaki 120 bakiyeleri için karşılık ayrılıp gider yazılabilir.', level: 'Stratejik' }
      ],
      chartData: [
        { name: 'Brüt Satış Kârı', value: Math.max(0, grossProfit), color: '#3b82f6' },
        { name: 'Faaliyet Giderleri', value: operatingExpenses, color: '#f87171' },
        { name: 'Diğer Giderler', value: otherExpenses + financialExpenses + extraordinaryExpenses, color: '#fbbf24' },
        { name: 'Net Dönem Kârı', value: Math.max(0, netProfit), color: '#10b981' }
      ]
    };
  };

  const handleAnalyze = async () => {
    if (!tbData.trim() && !uploadedFile) {
      toast.error('Lütfen mizan verilerini yapıştırın veya bir dosya yükleyin.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let records: MizanRecord[] = [];

      if (uploadedFile) {
        const data = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Improved Turkish Header Detection
        let headerIdx = -1;
        let colCode = 0;
        let colName = 1;
        let colDebit = 2;
        let colCredit = 3;
        let colDebitBal = 4;
        let colCreditBal = 5;

        for (let i = 0; i < Math.min(30, jsonData.length); i++) {
          const row = jsonData[i] as any[];
          if (!row || !Array.isArray(row)) continue;
          const rowStr = row.join(' ').toUpperCase();
          if (rowStr.includes('HESAP') && (rowStr.includes('BORÇ') || rowStr.includes('BORC') || rowStr.includes('ALACAK') || rowStr.includes('BAKİYE') || rowStr.includes('BAKIYE'))) {
             headerIdx = i;
             // Map columns
             row.forEach((col, idx) => {
               if (!col || typeof col !== 'string') return;
               const cInfo = col.toUpperCase();
               if (cInfo.includes('KOD')) colCode = idx;
               else if (cInfo.includes('AD') || cInfo.includes('İSM') || cInfo.includes('ISMI')) colName = idx;
               else if (cInfo.includes('BAK')) {
                  if (cInfo.includes('BOR')) colDebitBal = idx;
                  else if (cInfo.includes('ALA')) colCreditBal = idx;
               } else if (cInfo.includes('BOR')) {
                  // Keep overwriting unless already seen 'BAK' (we might have 'Devir Borç', 'Borç')
                  // The last 'Borç' before 'Bakiye' is usually the main Debit column
                  if (!rowStr.includes('BAK') || idx < Math.max(colDebitBal, colCreditBal)) {
                      colDebit = idx;
                  }
               } else if (cInfo.includes('ALA')) {
                  if (!rowStr.includes('BAK') || idx < Math.max(colDebitBal, colCreditBal)) {
                      colCredit = idx;
                  }
               }
             });
             break;
          }
        }

        const startRow = headerIdx !== -1 ? headerIdx + 1 : 0;
        for (let i = startRow; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (!row || !row[colCode] && !row[colName]) continue;
          
          // Skip if first column looks like total (e.g. "TOPLAM")
          const firstCol = String(row[colCode] || '').toUpperCase();
          const secondCol = String(row[colName] || '').toUpperCase();
          if (firstCol.includes('TOPLAM') || secondCol.includes('TOPLAM')) continue;

          const debit = parseTRNumber(row[colDebit]);
          const credit = parseTRNumber(row[colCredit]);
          let debitBalance = parseTRNumber(row[colDebitBal] || 0);
          let creditBalance = parseTRNumber(row[colCreditBal] || 0);
          
          // If balances are 0 but totals suggest a balance, recalculate
          if (debitBalance === 0 && creditBalance === 0 && (debit !== 0 || credit !== 0)) {
            const epsilon = 0.01;
            if (debit - credit > epsilon) debitBalance = debit - credit;
            else if (credit - debit > epsilon) creditBalance = credit - debit;
          }

          records.push({
            code: String(row[0] || ''),
            name: String(row[1] || ''),
            debit,
            credit,
            debitBalance,
            creditBalance
          });
        }
      } else {
        // Multi-format Text Parsing Logic
        const lines = tbData.split('\n').filter(l => l.trim().length > 0);
        lines.forEach(line => {
          // Attempt to split by tab, multiple spaces, or semicolon
          const parts = line.split(/\t| {2,}|;|\|/).map(p => p.trim()).filter(p => p.length > 0);
          
          if (parts.length >= 2) {
            const code = parts[0];
            const name = parts[1];
            
            // Heuristically find numeric values in the remaining parts
            const numbers = parts.slice(2).map(p => parseTRNumber(p));
            
            // Standard 6-column mizan: Code, Name, Debit, Credit, DebitBal, CreditBal
            // If we have 4 numbers, we assume they are Debit, Credit, DebitBal, CreditBal
            if (numbers.length >= 4) {
              records.push({
                code: code,
                name: name,
                debit: numbers[0],
                credit: numbers[1],
                debitBalance: numbers[2],
                creditBalance: numbers[3]
              });
            } else if (numbers.length === 2) {
              // Assume they are Debit and Credit if only 2 numbers
              // Calculate balances
              const debit = numbers[0];
              const credit = numbers[1];
              records.push({
                code: code,
                name: name,
                debit: debit,
                credit: credit,
                debitBalance: debit > credit ? debit - credit : 0,
                creditBalance: credit > debit ? credit - debit : 0
              });
            } else if (numbers.length >= 2) {
              // Fallback for messy pastes
              records.push({
                code: code,
                name: name,
                debit: numbers[0],
                credit: numbers[1],
                debitBalance: numbers[numbers.length - 2] || 0,
                creditBalance: numbers[numbers.length - 1] || 0
              });
            }
          }
        });
      }

      if (records.length === 0) {
        throw new Error('Mizan verisi ayrıştırılamadı. Formatı kontrol edin (Hesap Kodu | Hesap Adı | Borç | Alacak | Borç Bakiye | Alacak Bakiye)');
      }

      // Filter out root accounts if they are just headers like "HESAP KODU"
      records = records.filter(r => r.code && r.code !== 'undefined' && !r.code.includes('HESAP'));

      const result = processRecords(records);
      setAnalysisResult(result);
      toast.success('Mizan analizi ve vergi tahmini tamamlandı.');
    } catch (error) {
      console.error(error);
      toast.error('Hata: ' + (error instanceof Error ? error.message : 'Veri işleme hatası'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const COLORS = ['#3b82f6', '#f87171', '#fbbf24', '#10b981'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">MİZAN ANALİZİ & GEÇİCİ VERGİ TAHMİNİ</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">AKTİF FİRMA:</span>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight">{activeFirm.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-blue-100 text-blue-600 font-black tracking-widest text-[10px] h-10 px-4 bg-blue-50" onClick={() => {
            const sample = "HESAP KODU\tHESAP ADI\tBORÇ\tALACAK\tBORÇ BAKİYE\tALACAK BAKİYE\n100\tKASA\t1.500.000,00\t800.000,00\t700.000,00\t0,00\n131\tORTAKLARDAN ALACAKLAR\t250.000,00\t0,00\t250.000,00\t0,00\n600\tYURTİÇİ SATIŞLAR\t0,00\t2.000.000,00\t0,00\t2.000.000,00\n621\tSATILAN TİCARİ MALLAR MALİYETİ\t1.200.000,00\t0,00\t1.200.000,00\t0,00\n632\tGENEL YÖNETİM GİDERLERİ\t350.000,00\t0,00\t350.000,00\t0,00\n689\tDİĞER OLAĞANDIŞI GİDER VE ZARARLAR(KKEG)\t20.000,00\t0,00\t20.000,00\t0,00";
            setTbData(sample);
            setUploadedFile(null);
            toast.info('Örnek mizan verileri yüklendi.');
          }}>
            ÖRNEK VERİ YÜKLE
          </Button>
          <Button variant="outline" className="border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] h-10 px-4 bg-white" onClick={() => {
            setTbData('');
            setUploadedFile(null);
            setAnalysisResult(null);
          }}>
            TÜMÜNÜ TEMİZLE
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <CardHeader className="bg-slate-50 border-b border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-black uppercase tracking-wider flex items-center gap-2 text-slate-600">
                  <Copy className="w-3.5 h-3.5" /> VERİ GİRİŞİ
                </CardTitle>
                <div className="flex gap-1">
                   <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded uppercase tracking-tighter">XLSX</span>
                   <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded uppercase tracking-tighter">PDF</span>
                   <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded uppercase tracking-tighter">DOCX</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-100 bg-white">
                <label className="group cursor-pointer">
                  <div className="border-2 border-dashed border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all rounded-xl p-6 text-center">
                    <Upload className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                    <p className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                      {uploadedFile ? uploadedFile.name : 'MİZAN DOSYASI YÜKLE'}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">XLS, XLSX, PDF, DOCX</p>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".xls,.xlsx,.pdf,.docx" 
                      onChange={handleFileUpload}
                    />
                  </div>
                </label>
                {uploadedFile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 h-7 text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => {
                      setUploadedFile(null);
                      setTbData('');
                    }}
                  >
                    <CloseIcon className="w-3 h-3 mr-1" /> DOSYAYI KALDIR
                  </Button>
                )}
              </div>
              <div className="relative">
                <textarea
                  className="w-full h-[250px] p-4 text-xs font-mono bg-white focus:outline-none resize-none leading-relaxed placeholder:text-slate-300"
                  placeholder="Veya hesap verilerini buraya yapıştırın..."
                  value={tbData}
                  onChange={(e) => {
                    setTbData(e.target.value);
                    if (uploadedFile) setUploadedFile(null);
                  }}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">MANUEL GİRİŞ</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-200 p-4">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 uppercase tracking-[0.15em] text-[11px] shadow-lg shadow-blue-100 transition-all rounded-xl"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ANALİZ EDİLİYOR...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> ANALİZİ BAŞLAT
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          {!analysisResult && !isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <BarChart3 className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Henüz Analiz Yapılmadı</h3>
              <p className="text-sm text-slate-400 max-w-sm font-medium">
                Sol taraftaki alana mizan verilerinizi yapıştırıp analizi başlatarak teknik raporu görüntüleyebilirsiniz.
              </p>
            </div>
          ) : isAnalyzing ? (
            <div className="space-y-6">
               <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
               </div>
               <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Summary Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="border-emerald-100 bg-emerald-50/50 shadow-none">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-emerald-700 font-bold text-[10px] uppercase tracking-widest">Tahmini Geçici Vergi</CardDescription>
                    <CardTitle className="text-2xl font-black text-emerald-900">{formatTRNumber(analysisResult.profitability.taxEstimation)} TRY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-tight">
                      <TrendingUp className="w-4 h-4" /> Matrah: { formatTRNumber(analysisResult.profitability.matrah) } TRY
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-orange-100 bg-orange-50/50 shadow-none">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-orange-700 font-bold text-[10px] uppercase tracking-widest">Tespit Edilen KKEG</CardDescription>
                    <CardTitle className="text-2xl font-black text-orange-900">{formatTRNumber(analysisResult.profitability.kkeg)} TRY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-tight">
                      <AlertTriangle className="w-4 h-4" /> Matrah Etkisi: +{ formatTRNumber(analysisResult.profitability.kkeg * 0.25) } TRY Vergi
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart & Technical Summary */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" /> FİNANSAL TABLO ÖZETİ & VERGİ MATRAHI
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="h-64 text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysisResult.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analysisResult.chartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                          formatter={(value: any) => [`${formatTRNumber(value)} TRY`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4 py-4">
                    {analysisResult.chartData.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{formatTRNumber(item.value)} TRY</span>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-dashed border-slate-200">
                      <div className="flex items-center justify-between text-blue-600 font-black">
                        <span className="text-xs uppercase tracking-widest">Net Kâr (Dönem)</span>
                        <span>{formatTRNumber(analysisResult.profitability.netProfit)} TRY</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Three Perspectives Evaluation */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* Vergi Müfettişi */}
                <Card className="border-rose-100 bg-white shadow-sm overflow-hidden group">
                  <div className="bg-rose-600 p-2 text-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Vergi Müfettişi Görüşü</span>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic border-l-2 border-rose-200 pl-3">
                      "{analysisResult.auditPerspectives.inspector.opinion}"
                    </p>
                    <div className="space-y-1">
                      {analysisResult.auditPerspectives.inspector.risks.map((r: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start">
                          <AlertTriangle className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-rose-600 leading-tight">{r}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Öneri:</p>
                      <p className="text-[10px] font-bold text-slate-600">{analysisResult.auditPerspectives.inspector.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* YMM */}
                <Card className="border-blue-100 bg-white shadow-sm overflow-hidden group">
                  <div className="bg-blue-600 p-2 text-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">YMM Görüşü</span>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic border-l-2 border-blue-200 pl-3">
                      "{analysisResult.auditPerspectives.ymm.opinion}"
                    </p>
                    <div className="space-y-1">
                      {analysisResult.auditPerspectives.ymm.risks.map((r: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start">
                          <CheckCircle2 className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-blue-600 leading-tight">{r}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Öneri:</p>
                      <p className="text-[10px] font-bold text-slate-600">{analysisResult.auditPerspectives.ymm.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bağımsız Denetçi */}
                <Card className="border-emerald-100 bg-white shadow-sm overflow-hidden group">
                  <div className="bg-emerald-600 p-2 text-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Bağımsız Denetçi Görüşü</span>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic border-l-2 border-emerald-200 pl-3">
                      "{analysisResult.auditPerspectives.auditor.opinion}"
                    </p>
                    <div className="space-y-1">
                      {analysisResult.auditPerspectives.auditor.risks.map((r: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start">
                          <Info className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-emerald-600 leading-tight">{r}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Öneri:</p>
                      <p className="text-[10px] font-bold text-slate-600">{analysisResult.auditPerspectives.auditor.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Narrative Summary */}
              <Card className="border-blue-100 bg-blue-50/30 overflow-hidden shadow-sm">
                <CardHeader className="pb-2 bg-blue-50/50 border-b border-blue-100">
                  <CardTitle className="text-xs font-black uppercase text-blue-800 tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4" /> ANALİZ ÖZETİ & DEĞERLENDİRME
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed">
                      Mizan verilerinin teknik analizi sonucunda; Brüt Satış Kârı <span className="text-blue-600">{formatTRNumber(analysisResult.profitability.grossProfit)} TRY</span>, 
                      Ticari Bilanço Kârı ise <span className="text-blue-600 font-black">{formatTRNumber(analysisResult.profitability.netProfit)} TRY</span> olarak hesaplanmaktadır. 
                      Hesaplanan <span className="text-orange-600 font-black">{formatTRNumber(analysisResult.profitability.kkeg)} TRY</span> tutarındaki Kanunen Kabul Edilmeyen Gider (KKEG) ilavesi ile birlikte 
                      mali kâr (vergi matrahı) <span className="font-black text-slate-900 underline">{formatTRNumber(analysisResult.profitability.matrah)} TRY</span> seviyesinde oluşmaktadır.
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                         <span className="text-[10px] text-slate-500 font-bold uppercase">Ticari Kâr/Zarar:</span>
                         <span className="text-[10px] font-black text-slate-900">{formatTRNumber(analysisResult.profitability.netProfit)} TRY</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                         <span className="text-[10px] text-slate-500 font-bold uppercase">KKEG (+) :</span>
                         <span className="text-[10px] font-black text-orange-600">{formatTRNumber(analysisResult.profitability.kkeg)} TRY</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] text-blue-700 font-black uppercase">Vergi Matrahı:</span>
                         <span className="text-[10px] font-black text-blue-800">{formatTRNumber(analysisResult.profitability.matrah)} TRY</span>
                      </div>
                      <div className="pt-2 mt-2 border-t-2 border-blue-200">
                         <p className="text-[10px] text-slate-600 leading-relaxed font-bold">
                           <span className="text-blue-700 uppercase">PROJEKSİYON:</span> Mevcut veriler ışığında ödenecek Geçici Vergi yükü (%25) <span className="text-rose-600 font-black">{formatTRNumber(analysisResult.profitability.taxEstimation)} TRY</span> olarak öngörülmektedir. 
                           {analysisResult.profitability.matrah <= 0 ? ' (Zarar veya mahsup edilebilir KKEG sonrası matrah oluşmadığı için vergi tahakkuk etmemiştir.)' : ''}
                         </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risks & Opportunities */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Risks */}
                <div className="space-y-4">
                   <h3 className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" /> ÖNÜMÜZDEKİ DÖNEM RİSKLERİ
                   </h3>
                   <div className="space-y-3">
                     {analysisResult.risks.map((risk: any, idx: number) => (
                       <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl relative overflow-hidden group hover:border-rose-200 transition-all">
                         <div className={`absolute left-0 top-0 bottom-0 w-1 ${risk.level === 'Kritik' ? 'bg-red-600' : (risk.level === 'Yüksek' ? 'bg-rose-500' : (risk.level === 'Orta' ? 'bg-amber-500' : 'bg-slate-400'))}`} />
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-rose-700 transition-colors uppercase tracking-tight">{risk.title}</h4>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${risk.level === 'Yüksek' || risk.level === 'Kritik' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                              {risk.level}
                            </span>
                         </div>
                         <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{risk.detail}</p>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Opportunities */}
                <div className="space-y-4">
                   <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" /> FIRSAT VE TEŞVİK ANALİZİ
                   </h3>
                   <div className="space-y-3">
                     {analysisResult.opportunities.map((opp: any, idx: number) => (
                       <div key={idx} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl group hover:border-emerald-300 transition-all">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[13px] font-bold text-emerald-900 uppercase tracking-tight">{opp.title}</h4>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                              {opp.level}
                            </span>
                         </div>
                         <p className="text-[11px] text-emerald-700/80 leading-relaxed font-bold">{opp.detail}</p>
                         <Button variant="ghost" className="p-0 h-auto text-[10px] text-emerald-600 mt-2 font-black hover:bg-transparent">
                            DETAYLARI İNCELE <ArrowRight className="w-3 h-3 ml-1" />
                         </Button>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Final Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-slate-200">
                  <Download className="w-4 h-4 mr-2" /> TEKNİK RAPORU İNDİR (PDF)
                </Button>
                <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 font-bold h-11 uppercase text-[10px] tracking-widest rounded-xl hover:bg-slate-50">
                  <Save className="w-4 h-4 mr-2" /> ANALİZİ ARŞİVLE
                </Button>
                <Button variant="outline" className="flex-1 border-blue-100 text-blue-600 font-bold h-11 uppercase text-[10px] tracking-widest rounded-xl bg-blue-50 hover:bg-blue-100 border-dashed" onClick={() => toast.info('Mükellef portalına gönderildi.')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> MÜKELLEFE GÖNDER
                </Button>
              </div>

              {/* Warning/Info */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                  Nihai Kontrol Notu: Bu analiz mizan verilerine dayalı bir ön projeksiyondur. Geçici vergi beyannamesi öncesi mizan mutabakatları, dönem sonu değerleme kayıtları ve amortisman hesaplamaları uzman tarafından manuel doğrulanmalıdır.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
