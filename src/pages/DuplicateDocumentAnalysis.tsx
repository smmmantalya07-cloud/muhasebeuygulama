import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Search,
  Filter,
  Trash2,
  Table as TableIcon,
  Copy,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

// "SN", "HESAP KODU", "KDV ORANLARI", "FİŞ TARİHİ", "EVRAK NO", "VERGİ/TC NO", "AÇIKLAMA", "TUTARI".
interface DuplicateRecord {
  id: string;
  sn: string;
  accountCode: string;
  vatRate: string;
  date: string;
  documentNo: string;
  vknTckn: string;
  description: string;
  amount: number;
  duplicateGroup: string;
}

export function DuplicateDocumentAnalysisPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [records, setRecords] = useState<DuplicateRecord[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearData = () => {
    setRecords([]);
    setDuplicateGroups(0);
    setIsDataLoaded(false);
    toast.info('Veriler temizlendi.');
  };

  const loadSampleData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const sampleRows = [
        { 'SN': '1', 'HESAP KODU': '191.01.020', 'KDV ORANLARI': '%20', 'FİŞ TARİHİ': '05.04.2026', 'EVRAK NO': 'FT2026001', 'VERGİ/TC NO': '1234567890', 'AÇIKLAMA': 'Danışmanlık Hizmeti', 'TUTARI': 10000 },
        { 'SN': '2', 'HESAP KODU': '191.01.020', 'KDV ORANLARI': '%20', 'FİŞ TARİHİ': '05.04.2026', 'EVRAK NO': 'FT2026001', 'VERGİ/TC NO': '1234567890', 'AÇIKLAMA': 'Danışmanlık Hizmeti', 'TUTARI': 10000 },
        { 'SN': '3', 'HESAP KODU': '153.01.001', 'KDV ORANLARI': '%10', 'FİŞ TARİHİ': '12.04.2026', 'EVRAK NO': 'AB123456', 'VERGİ/TC NO': '9988776655', 'AÇIKLAMA': 'Gıda Alımı', 'TUTARI': 5000 },
        { 'SN': '4', 'HESAP KODU': '153.01.001', 'KDV ORANLARI': '%10', 'FİŞ TARİHİ': '12.04.2026', 'EVRAK NO': 'AB123456', 'VERGİ/TC NO': '9988776655', 'AÇIKLAMA': 'Gıda Alımı - Yemekhane', 'TUTARI': 5000 },
        { 'SN': '5', 'HESAP KODU': '191.01.010', 'KDV ORANLARI': '%10', 'FİŞ TARİHİ': '15.04.2026', 'EVRAK NO': 'C-999', 'VERGİ/TC NO': '3334445551', 'AÇIKLAMA': 'Kırtasiye', 'TUTARI': 1500 },
      ];

      const processed = detectDuplicates(sampleRows);
      setRecords(processed.records);
      setDuplicateGroups(processed.groupCount);
      setIsDataLoaded(true);
      setIsProcessing(false);
      toast.success('Örnek veriler başarıyla yüklendi.');
    }, 1500);
  };
   
  const loadPerfectData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const sampleRows = [
        { 'SN': '1', 'HESAP KODU': '191.01.020', 'KDV ORANLARI': '%20', 'FİŞ TARİHİ': '05.04.2026', 'EVRAK NO': 'FT2026001', 'VERGİ/TC NO': '1234567890', 'AÇIKLAMA': 'Danışmanlık Hizmeti', 'TUTARI': 10000 },
        { 'SN': '2', 'HESAP KODU': '153.01.001', 'KDV ORANLARI': '%10', 'FİŞ TARİHİ': '12.04.2026', 'EVRAK NO': 'AB123456', 'VERGİ/TC NO': '9988776655', 'AÇIKLAMA': 'Gıda Alımı', 'TUTARI': 5000 },
      ];

      const processed = detectDuplicates(sampleRows);
      setRecords(processed.records);
      setDuplicateGroups(processed.groupCount);
      setIsDataLoaded(true);
      setIsProcessing(false);
      toast.success('Örnek veriler (Sorunsuz) başarıyla yüklendi.');
    }, 1500);
  };

  const processFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

        setTimeout(() => {
          const processed = detectDuplicates(jsonData);
          setRecords(processed.records);
          setDuplicateGroups(processed.groupCount);
          setIsDataLoaded(true);
          setIsProcessing(false);
          toast.success('Veriler işlendi. Mükerrer kayıtlar listelendi.');
        }, 1500);
      } catch (error) {
        console.error(error);
        toast.error('Dosya işlenirken hata oluştu. Lütfen geçerli bir Excel dosyası yükleyin.');
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const normalizeVkn = (vkn: string) => {
    return vkn ? vkn.toString().replace(/[^0-9]/g, '') : '';
  };
  const normalizeString = (str: string) => {
    return str ? str.toString().trim().toUpperCase().replace(/\s+/g, '') : '';
  };

  const detectDuplicates = (data: any[]): { records: DuplicateRecord[], groupCount: number } => {
    const mapped: DuplicateRecord[] = data.map((row, idx) => {
      const findField = (names: string[]) => {
        const key = Object.keys(row).find(k => names.some(n => k.toLowerCase().includes(n.toLowerCase())));
        return key ? row[key] : '';
      };

      let amountVal = findField(['TUTARI', 'Tutar', 'Matrah', 'Amount']);
      let parsedAmount = 0;
      if (typeof amountVal === 'number') {
        parsedAmount = amountVal;
      } else if (typeof amountVal === 'string') {
        let strAmt = amountVal.replace(/\./g, '').replace(',', '.');
        parsedAmount = parseFloat(strAmt) || 0;
      }

      const formatExcelDate = (excelDate: any): string => {
        if (typeof excelDate === 'number') {
          // Excel uses 1900 epoch, 25569 is Jan 1 1970
          // But there's a leap year bug in Excel for 1900.
          const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
          const d = date.getDate().toString().padStart(2, '0');
          const m = (date.getMonth() + 1).toString().padStart(2, '0');
          const y = date.getFullYear();
          return `${d}.${m}.${y}`;
        }
        return excelDate ? String(excelDate) : '';
      };

      return {
        id: `REC-${idx}`,
        sn: findField(['SN', 'Sıra', 'No'])?.toString() || (idx + 1).toString(),
        accountCode: findField(['HESAP KO', 'Hesap Kodu'])?.toString() || '',
        vatRate: findField(['KDV ORAN', 'KDV', 'Oran'])?.toString() || '',
        date: formatExcelDate(findField(['FİŞ TARİHİ', 'Tarih', 'Date'])),
        documentNo: findField(['EVRAK NO', 'Belge No', 'Fatura No'])?.toString() || '',
        vknTckn: findField(['VERGİ', 'TC', 'VKN', 'TCKN'])?.toString() || '',
        description: findField(['AÇIKLAMA', 'Desc'])?.toString() || '',
        amount: parsedAmount,
        duplicateGroup: ''
      };
    });

    const keyMap = new Map<string, DuplicateRecord[]>();
    
    // Group by headers to find duplicates
    // Evrak No + VKN/TC NO + KDV Oranları + Fiş Tarihi combinations
    mapped.forEach(rec => {
      const vkn = normalizeVkn(rec.vknTckn);
      const docNo = normalizeString(rec.documentNo);
      const date = normalizeString(rec.date);
      const vatRate = normalizeString(rec.vatRate);
      const amountStr = rec.amount.toFixed(2);
      
      const key = `${vkn}_${docNo}_${date}_${vatRate}_${amountStr}`; 
      
      if (!docNo || !vkn) return; // Skip empty rows

      if (!keyMap.has(key)) keyMap.set(key, []);
      keyMap.get(key)!.push(rec);
    });

    let groupCounter = 1;
    const finalRecords: DuplicateRecord[] = [];

    keyMap.forEach((recs, key) => {
      if (recs.length > 1) { // It's a duplicate group
        const currentGroupId = `GRP-${groupCounter}`;
        recs.forEach(r => {
          r.duplicateGroup = currentGroupId;
          finalRecords.push(r);
        });
        groupCounter++;
      }
    });

    // We only show duplicates!
    return { records: finalRecords, groupCount: groupCounter - 1 };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <Copy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">MÜKERRER KAYIT ANALİZİ</h1>
            <p className="text-sm font-medium text-slate-500">
              Yüklenen listelerdeki evrak numarası, tarih ve VKN uyumuna göre mükerrer satırlar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-slate-200 text-slate-600 font-bold px-4" onClick={clearData}>
            <Trash2 className="w-4 h-4 mr-2" /> TEMİZLE
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={processFile} 
            className="hidden" 
            accept=".xlsx,.xls,.csv"
          />
          <Button className="h-10 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 shadow-md" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> LİSTE YÜKLE
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isDataLoaded ? (
          <motion.div 
             initial={{ opacity: 0, y: 20 }} 
             animate={{ opacity: 1, y: 0 }} 
             exit={{ opacity: 0, y: -20 }}
             className="w-full"
          >
             <Card className="border-dashed border-2 border-slate-200 bg-white/50 backdrop-blur-sm h-[400px] flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                 <Copy className="w-10 h-10 text-purple-600/50" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Denetlenecek Listeyi Yükleyin</h3>
               <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                 SN, HESAP KODU, KDV ORANLARI, FİŞ TARİHİ, EVRAK NO, VERGİ/TC NO, AÇIKLAMA, TUTARI başlıklarını içeren excel tablonuzu yükleyerek sadece mükerrer evrakları listeleyebilirsiniz. Risk algoritmaları devre dışı bırakılmıştır.
               </p>
               <div className="flex gap-4">
                 <Button className="bg-purple-600 hover:bg-purple-700 font-bold" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2"/> BİLGİSAYARDAN SEÇ
                 </Button>
                 <Button variant="ghost" className="text-purple-600 font-bold hover:bg-purple-50" onClick={loadSampleData}>
                    Örnek Veri ile Göster
                 </Button>
                 <Button variant="ghost" className="text-green-600 font-bold hover:bg-green-50" onClick={loadPerfectData}>
                    Sorunsuz Kayıt Göster
                 </Button>
               </div>
             </Card>
          </motion.div>
        ) : records.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="bg-green-50/50 border border-green-200 h-[400px] flex flex-col items-center justify-center text-center p-8 shadow-sm">
               <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                 <AlertTriangle className="w-10 h-10 text-green-600" />
               </div>
               <h3 className="text-2xl font-black text-green-800 mb-2">Tebrikler, Mükerrer Kayıt Bulunamadı!</h3>
               <p className="text-sm text-green-600/80 max-w-md mx-auto mb-8 font-medium">
                 İncelemiş olduğunuz veri setinde evrak numarası, tarih ve VKN uyumuna göre mükerrer işlem tespit edilmemiştir. Belgeleriniz tutarlı görünmektedir.
               </p>
               <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100 font-bold" onClick={clearData}>
                  Yeni Liste Yükle
               </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="flex items-center gap-6 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Tespit Edilen Mükerrer Grup</p>
                   <p className="text-xl font-black text-slate-800">{duplicateGroups}</p>
                 </div>
               </div>
               <div className="w-px h-10 bg-slate-200"></div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <TableIcon className="w-5 h-5 text-red-500" />
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Toplam Mükerrer Satır</p>
                   <p className="text-xl font-black text-slate-800">{records.length}</p>
                 </div>
               </div>
               <div className="ml-auto text-sm text-slate-500 flex items-center gap-2">
                 <Info className="w-4 h-4" />
                 Sadece potansiyel mükerrer satırlar listelenmektedir.
               </div>
            </div>

            <Card>
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[1000px]">
                   <thead>
                     <tr className="bg-slate-100 border-b border-slate-200">
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider">SN</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider">HESAP KO</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider">KDV ORANLARI</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider">FİŞ TARİHİ</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider">EVRAK NO</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider">VERGİ/TC NO</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider w-1/4">AÇIKLAMA</th>
                       <th className="p-3 text-xs font-black text-slate-600 tracking-wider text-right">TUTARI</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {records.map((rec, index) => {
                        // Alternate background color based on group for better visualization
                        const groupNum = parseInt(rec.duplicateGroup.replace('GRP-', ''));
                        const groupColors = ['bg-yellow-100/80', 'bg-emerald-100/80', 'bg-blue-100/80', 'bg-purple-100/80', 'bg-orange-100/80', 'bg-pink-100/80'];
                        const colorIndex = (groupNum - 1) % groupColors.length;
                        const bgClass = groupColors[colorIndex];
                        
                        return (
                         <tr key={index} className={`hover:bg-slate-50 transition-colors ${bgClass}`}>
                           <td className="p-3 text-sm text-slate-700 font-medium">{rec.sn}</td>
                           <td className="p-3 text-sm font-mono text-slate-700">{rec.accountCode}</td>
                           <td className="p-3 text-sm text-slate-700">{rec.vatRate}</td>
                           <td className="p-3 text-sm text-slate-700">{rec.date}</td>
                           <td className="p-3 text-sm font-bold text-slate-900">{rec.documentNo}</td>
                           <td className="p-3 text-sm font-mono text-slate-700">{rec.vknTckn}</td>
                           <td className="p-3 text-sm text-slate-600 truncate max-w-xs" title={rec.description}>{rec.description}</td>
                           <td className="p-3 text-sm font-mono font-bold text-slate-900 text-right">
                             {rec.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
               <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex gap-2">
                     <Button 
                       variant="default" 
                       className="h-8 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold"
                       onClick={() => {
                         if (records.length === 0) return;
                         const ws = XLSX.utils.json_to_sheet(records.map(r => ({
                           'SN': r.sn,
                           'HESAP KO': r.accountCode,
                           'KDV ORANLARI': r.vatRate,
                           'FİŞ TARİHİ': r.date,
                           'EVRAK NO': r.documentNo,
                           'VERGİ/TC NO': r.vknTckn,
                           'AÇIKLAMA': r.description,
                           'TUTARI': r.amount
                         })));
                         const wb = XLSX.utils.book_new();
                         XLSX.utils.book_append_sheet(wb, ws, "Mükerrer Kayıtlar");
                         XLSX.writeFile(wb, `Mukerrer_Hatalar_${new Date().toLocaleDateString('tr-TR')}.xlsx`);
                         toast.success('Excel raporu indirildi.');
                       }}
                     >
                       EXCEL İNDİR
                     </Button>
                  </div>
               </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-2xl bg-white">
            <div className="relative">
               <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin mx-auto" />
               <Copy className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">ANALİZ YAPILIYOR</h3>
              <p className="text-sm text-slate-500 font-medium px-4">
                Satırlar taranıyor ve VKN, Tarih, Evrak No bilgisine göre mükerrer olan kayıtlar ayıklanıyor...
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
