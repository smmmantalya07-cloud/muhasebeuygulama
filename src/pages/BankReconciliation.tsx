import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Upload, CheckCircle2, AlertTriangle, FileText, ArrowRightLeft, Database, Search, Filter, Download, Info, Building2, User, ShieldAlert, BadgeInfo, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function BankReconciliationPage() {
  const [activeView, setActiveView] = useState<'upload' | 'results'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveView('results');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Calculator className="w-6 h-6 text-blue-600" />
          Banka Mutabakat Analizi
        </h1>
        <p className="text-slate-500 text-sm">Banka ekstreleri ile muhasebe muavin (102 Bankalar) hareketlerinin satır bazlı akıllı eşleştirilmesi ve 3'lü denetim filtresi.</p>
      </div>

      {activeView === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-dashed border-2 border-slate-200 bg-white/50 hover:bg-slate-50/50 transition-colors">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Banka Ekstresi Yükle</CardTitle>
              <CardDescription>Banka formatında Excel (XLSX, CSV) veya PDF</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-8">
              <input type="file" id="bank-statement" className="hidden" />
              <label htmlFor="bank-statement">
                <Button variant="outline" className="mt-4 pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" /> Dosya Seç
                </Button>
              </label>
              <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">Ziraat, Garanti, İş Bankası, Akbank desteklenir</p>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-slate-200 bg-white/50 hover:bg-slate-50/50 transition-colors">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                <Database className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">Muhasebe Muavini Yükle</CardTitle>
              <CardDescription>102 Hesap Muavin Dökümü (XLSX, CSV)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-8">
              <input type="file" id="ledger-file" className="hidden" />
              <label htmlFor="ledger-file">
                <Button variant="outline" className="mt-4 pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" /> Dosya Seç
                </Button>
              </label>
              <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">Logo, Mikro, Zirve, Luca formatları</p>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 flex justify-center mt-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 min-w-[250px] relative overflow-hidden"
              onClick={startAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="absolute inset-0 bg-blue-500 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span>Yapay Zeka Eşleştiriyor...</span>
                  </div>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  Otomatik Mutabakatı Başlat
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {activeView === 'results' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-200">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">İncelenen Satır</p>
                   <p className="text-xl font-bold text-slate-800">4,250</p>
                 </div>
               </CardContent>
            </Card>
            <Card className="border-emerald-200 bg-emerald-50/30">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Tam Eşleşen</p>
                   <p className="text-xl font-bold text-emerald-800">4,180</p>
                 </div>
               </CardContent>
            </Card>
            <Card className="border-rose-200 bg-rose-50/30">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-0.5">Muhasebede Eksik</p>
                   <p className="text-xl font-bold text-rose-800">45</p>
                 </div>
               </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/30">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-0.5">Ekstrede Olmayan</p>
                   <p className="text-xl font-bold text-orange-800">25</p>
                 </div>
               </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-200 shadow-sm flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-rose-500" />
                   Mutabakatsızlık Uyarıları (Riskli İşlemler)
                 </h3>
                 <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Açıklama, Tutar ara..." className="h-8 pl-9 w-48 text-sm" />
                    </div>
                    <Button variant="outline" size="sm" className="h-8"><Filter className="w-4 h-4 mr-2" /> Filtrele</Button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">Tarih</th>
                      <th className="px-4 py-3 font-medium">Banka Açıklaması</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Extre Tutar</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Muavin Tutar</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap text-center">Durum</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">12.04.2026</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">GELEN EFT: AKINCILAR TİCARET</div>
                        <div className="text-xs text-slate-500 mt-0.5">TR000...1122 Açıklama Yok</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-emerald-600">+145,000.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-slate-400">-</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Muhasebede Yok
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                         <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50">Düzeltme Ön</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">14.04.2026</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">KREDİ KARTI TAHSİLATI</div>
                        <div className="text-xs text-slate-500 mt-0.5">POS: ZİRAAT BANKASI GÜN SONU</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-emerald-600">+22,450.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-emerald-600">+22,540.00</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Tutar Farkı (-90 TL)
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                         <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50">İncele</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">15.04.2026</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">GİDEN HAVALE: MEHMET CAN (ORTAK)</div>
                        <div className="text-xs text-slate-500 mt-0.5">AVANS TALEBİ</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-rose-600">-250,000.00</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-slate-400">-</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          Kritik: İşlenmemiş Ortak Hareketi
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                         <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50">Belge İste</Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">18.04.2026</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-400 italic">BANKA EKSTRESİNDE YOK</div>
                        <div className="text-xs text-slate-500 mt-0.5">Muhasebe Fişi: 120 SATIŞ FATURASI TAHSİLATI</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-slate-400">-</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-emerald-600">+85,000.00</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          Ekstrede Yok (Hayali Kayıt)
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                         <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50">Ters Kayıt Öner</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                <Button variant="outline" className="text-slate-600">Tüm Farkları Listele (70 Kayıt)</Button>
              </div>
            </Card>

            {/* Üçlü Denetim Alanı */}
            <div className="space-y-4">
              <Card className="border-rose-200 bg-rose-50/30">
                <CardHeader className="pb-3 border-b border-rose-100/50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-900">
                    <User className="w-4 h-4 text-rose-600" />
                    Vergi Müfettişi Görüşü
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="space-y-3">
                    <div className="p-2.5 bg-white/60 rounded border border-rose-100 text-sm text-slate-700">
                      <span className="font-semibold text-rose-800 block mb-1">Ana Eleştiri Nedeni:</span>
                      15.04.2026 tarihli 250.000 TL ortak transferi kayıtlara işlenmemiş. Kayıtdışı / Örtülü kazanç eleştirisi yapılır, re'sen adat faizi ve kurumlar vergisi tarhiyatı istenir. Banka hesabına gelip muhasebeye girmeyen EFT (145.000 TL) kayıtdışı hasılat şüphesi doğurur.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-200 bg-indigo-50/30">
                <CardHeader className="pb-3 border-b border-indigo-100/50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-900">
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                    YMM Tasdik Görüşü
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="space-y-3">
                    <div className="p-2.5 bg-white/60 rounded border border-indigo-100 text-sm text-slate-700">
                       <span className="font-semibold text-indigo-800 block mb-1">Tasdik Edilebilirlik:</span>
                       Muhasebe kayıtlarında görünüp bankada olmayan fiktif tahsilat (85.000 TL), firmanın KDV iadesini şüpheli duruma düşürür. Banka bakiyeleri ile 102 mizan bakiyesi mutlaka eşitlenmeden Kurumlar veya Tam Tasdik raporu yazılamaz.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-slate-50/50">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    Bağımsız Denetçi Görüşü
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="space-y-3">
                    <div className="p-2.5 bg-white rounded border border-slate-200 text-sm text-slate-700">
                       <span className="font-semibold text-slate-800 block mb-1">Maddi Doğruluk Riski:</span>
                       Nakit ve Nakit Benzerleri hesabında banka mutabakatı eksik. Doğrulama mektubu alındığında mizan ile fark çıkacaktır. Düzeltme fişi yevmiyesi oluşturulması tavsiye edilir. Tutar farkları (90 TLPOS) hile veya dikkatsizlik göstergesi olabilir.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kanıt Merkezi Özeti */}
              <Card className="border-blue-200 bg-blue-50/30 mt-4 overflow-hidden">
                <div className="bg-blue-600 text-white p-2.5 flex items-center gap-2">
                   <BadgeInfo className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Kanıt Merkezi Analizi</span>
                </div>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center bg-white rounded border border-blue-100 px-3 py-2 text-sm mb-3">
                    <span className="font-medium text-slate-600">Banka Format Gücü</span>
                    <span className="font-bold text-emerald-600">GÜÇLÜ (PDF/XLS Orjinal)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded border border-blue-100 px-3 py-2 text-sm">
                     <span className="font-medium text-slate-600">Doküman Eksikliği</span>
                     <span className="font-bold text-rose-600">2 Açıklamasız Belge</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                     <Button size="sm" variant="outline" className="w-full text-[11px] h-8 bg-white" onClick={() => {}}>Mükelleften Belge İste</Button>
                     <Button size="sm" className="w-full text-[11px] h-8 bg-blue-600 hover:bg-blue-700">Görev Oluştur</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
           {/* Aksiyon Barı */}
           <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-slate-50 border-slate-200 sticky bottom-4 shadow-xl z-10">
              <Button onClick={() => setActiveView('upload')} variant="outline" className="sm:mr-auto">
                <ArrowRightLeft className="w-4 h-4 mr-2" /> Yeni Mutabakat
              </Button>
              <Button variant="outline" className="text-slate-700 bg-white border-slate-300">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Düzeltme Kayıtları İndir (Excel)
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mali Müşavir Onayına Gönder
              </Button>
           </div>
           <div className="text-center mt-6">
             <p className="text-[10px] text-slate-400 font-medium italic">
                Nihai Kontrol Notu: Bu analiz banka hareketleri ile muhasebe verisinin sistemsel ön değerlendirmesi niteliğindedir. 
                Nihai karar için açıklama metinleri, makbuzlar ve diğer kanıtlar mali müşavir tarafından kontrol edilmelidir.
             </p>
           </div>
        </div>
      )}
    </div>
  );
}
