import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileSearch, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ExplanationAnalysisPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!text) return;
    setIsAnalyzing(true);
    toast.info('İzaha davet yazısı inceleniyor...');
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('İnceleme tamamlandı, risk profili çıkarıldı.');
      setText('');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <FileSearch className="w-6 h-6 text-blue-600" />
          İzaha Davet Analizi
        </h1>
        <p className="text-slate-500 text-sm">Mükelleflere gelen izaha davet yazılarını (VUK 370. Madde) yorumlama ve yönlendirme asistanı.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">İzaha Davet Yazısı Yükle veya Yapıştır</CardTitle>
            <CardDescription>GİB'den gelen PDF'i içeriğini yapıştırın, sistem hangi maddeden suçlandığınızı bulsun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
                  if(e.target.files && e.target.files.length > 0) {
                     toast.info(`${e.target.files[0].name} sisteme yüklendi, taranıyor...`);
                     setTimeout(() => {
                       setText("GİB İZAHA DAVET YAZISI\n\n... 213 Sayılı Vergi Usul Kanununun 370. Maddesi kapsamında... risk analiz merkezi tarafından yapılan incelemeler neticesinde, şirketiniz hesaplarında sahte veya muhteviyatı itibariyle yanıltıcı belge kullanma ihtimali tespit edilmiştir...");
                     }, 1000);
                  }
                }} />
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">PDF veya Görüntü Yükle Yüklemek İçin Tıklayın</p>
                <p className="text-xs text-slate-500 mt-1">veya metni aşağıya yapıştırın</p>
             </div>
             
             <Textarea 
               placeholder="Örn: 213 Sayılı Vergi Usul Kanununun 370. Maddesi kapsamında... sahte belge kullanma ihtimali..." 
               className="min-h-[150px]"
               value={text}
               onChange={(e) => setText(e.target.value)}
             />
             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!text || isAnalyzing} onClick={handleAnalyze}>
               {isAnalyzing ? 'Taranıyor...' : 'Yazıyı Analiz Et ve Strateji Belirle'}
             </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
               <AlertCircle className="w-5 h-5 text-amber-500" />
               Analiz Sonucu (Örnek)
            </CardTitle>
            <CardDescription>İzaha davetin muhtemel nedenleri ve yapılması gerekenler</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-bold text-slate-900 mb-1">Tespit Edilen Konu</h4>
                   <p className="text-sm text-slate-700 mb-2">SMİYB (Sahte ve Muhteviyatı İtibariyle Yanıltıcı Belge) Kullanımı İddiası</p>
                   <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">Yüksek Risk</span>
                      <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded">15 Gün Süre</span>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-bold text-slate-900 mb-1">Önerilen Aksiyon Planı</h4>
                   <ul className="text-sm text-slate-700 list-disc pl-4 space-y-1">
                      <li>İlgili faturanın BA formundaki karşılığını kontrol et.</li>
                      <li>Faturaya ait ödeme belgesini (Banka Dekontu) hazırla.</li>
                      <li>Mal teslim fişi / İrsaliyeleri toparla.</li>
                      <li>30 gün içinde indirimli ceza seçeneği (%20) veya dava yolunu mükellefe sun.</li>
                   </ul>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
