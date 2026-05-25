import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, EyeOff, Trash2, Lock, Save, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function DataSecurityPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Güvenlik tercihleri başarıyla kaydedildi.');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Veri Güvenliği & KVKK
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sisteme yüklenen belgelerin maskeleme ve KVKK uyumluluk kurallarını belirleyin.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          {isSaving ? <span className="animate-pulse">Kaydediliyor...</span> : <><Save className="w-4 h-4 mr-2" /> Değişiklikleri Kaydet</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-indigo-500" />
                Otomatik Veri Maskeleme
              </CardTitle>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">Aktif</span>
            </div>
            <CardDescription>Hassas veriler LLM analizine gitmeden önce otomatik olarak gizlenir.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> T.C. Kimlik No maskele</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vergi Kimlik No maskele</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> IBAN maskele</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Telefon maskele</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> E-posta maskele</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Açık adres maskele</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Personel isimlerini anonimleştir</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Firma adını "Mükellef A" formatında anonimleştir</li>
            </ul>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                Geçici Analiz Modu
              </CardTitle>
              <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">Pasif</span>
            </div>
            <CardDescription>Belgeler sadece analiz süresince hafızada tutulur, kalıcı kaydedilmez.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center gap-2 text-slate-400"><div className="w-4 h-4 rounded-full border-2 border-slate-300" /> Hassas belge uyarısı göster</li>
              <li className="flex items-center gap-2 text-slate-400"><div className="w-4 h-4 rounded-full border-2 border-slate-300" /> Analiz sonrası ham dosyayı sil</li>
              <li className="flex items-center gap-2 text-slate-400"><div className="w-4 h-4 rounded-full border-2 border-slate-300" /> Sadece rapor özetini sakla</li>
              <li className="flex items-center gap-2 text-slate-400"><div className="w-4 h-4 rounded-full border-2 border-slate-300" /> Kişisel verileri rapora yansıtma</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Button variant="outline" className="w-full text-xs font-semibold">Bu Modu Etkinleştir</Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
             <CardTitle className="text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-500" />
                Dosya Saklama Politikası
              </CardTitle>
            <CardDescription>Sisteme yüklenen dosyaların ne kadar süre saklanacağını belirleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
               <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
               <span className="text-sm font-medium text-slate-700">Analiz sonrası hemen sil</span>
             </div>
             <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
               <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
               <span className="text-sm font-medium text-slate-700">Manuel sil (Kullanıcı kararı)</span>
             </div>
             <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
               <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
               <span className="text-sm font-medium text-slate-700">7 gün sonra otomatik sil</span>
             </div>
             <div className="flex items-center gap-3 p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 cursor-pointer relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
               <div className="w-4 h-4 rounded-full border-4 border-blue-500"></div>
               <div className="flex flex-col">
                 <span className="text-sm font-semibold text-blue-900">Sadece maskelenmiş sürümü sakla</span>
                 <span className="text-xs text-blue-600/80 font-medium">Önerilen Güvenli Seçenek</span>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="pb-4 border-b border-slate-100">
             <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Sistem Güvenlik Durumu
              </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gizlilik Modu</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Aktif
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Veri Maskeleme</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Aktif
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ofis Dışı Paylaşım</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Kapalı
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ofis İçi Kullanım</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Aktif
                </div>
              </div>
            </div>
            <div className="mt-4 bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                Nihai Onay Modu Aktif. Riskli hiçbir işlem veya rapor, Mali Müşavir kontrolü ve onayı olmadan sistem tarafından kesinleştirilmez.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
