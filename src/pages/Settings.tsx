import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings2, Key, Users, BookOpen, Database, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';

export function SettingsPage() {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    setLoginUsername(localStorage.getItem('appUsername') || 'Orhan');
    setLoginPassword(localStorage.getItem('appPassword') || '1234');
  }, []);

  const handleUpdateLogin = () => {
    const trimmedUsername = loginUsername.trim();
    const trimmedPassword = loginPassword.trim();
    
    if (!trimmedUsername || !trimmedPassword) {
      toast.error('Kullanıcı adı ve şifre boş bırakılamaz.');
      return;
    }
    localStorage.setItem('appUsername', trimmedUsername);
    localStorage.setItem('appPassword', trimmedPassword);
    toast.success('Giriş bilgileri başarıyla güncellendi.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sistem Ayarları</h1>
          <p className="text-slate-500 text-sm">Mali Müşavir yapay zeka asistanı ve uygulama ayarları.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-slate-200">
           <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2"><Settings2 className="w-5 h-5 text-slate-400" /> Genel Profil</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid gap-2">
                 <label className="text-sm font-medium text-slate-700">Mali Müşavir Unvanı</label>
                 <Input defaultValue="Mali Müşavir Orhan Polat" />
              </div>
              <div className="grid gap-2">
                 <label className="text-sm font-medium text-slate-700">E-posta Adresi</label>
                 <Input defaultValue="smmmantalya07@gmail.com" />
              </div>
              <Button className="bg-slate-900 text-white" onClick={() => toast.success('Profil ayarları başarıyla kaydedildi.')}>Değişiklikleri Kaydet</Button>
           </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
           <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2"><Lock className="w-5 h-5 text-slate-400" /> Sistem Giriş Bilgileri</CardTitle>
              <CardDescription>Uygulamaya giriş yapmak için kullandığınız kullanıcı adı ve şifreyi değiştirin.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="grid gap-2">
                 <label className="text-sm font-medium text-slate-700">Giriş Kullanıcı Adı</label>
                 <Input 
                   value={loginUsername} 
                   onChange={(e) => setLoginUsername(e.target.value)} 
                   placeholder="Kullanıcı Adı" 
                 />
              </div>
              <div className="grid gap-2">
                 <label className="text-sm font-medium text-slate-700">Giriş Şifresi</label>
                 <Input 
                   type="password"
                   value={loginPassword} 
                   onChange={(e) => setLoginPassword(e.target.value)} 
                   placeholder="Yeni Şifre" 
                 />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdateLogin}>Giriş Bilgilerini Güncelle</Button>
           </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
           <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2"><Key className="w-5 h-5 text-slate-400" /> API ve Entegrasyonlar</CardTitle>
              <CardDescription>GİB, SGK veya diğer servis şifrelerinizi güvenli bir şekilde yönetin.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="font-medium text-slate-900 text-sm">GİB Dijital Vergi Dairesi</p>
                     <p className="text-xs text-slate-500 mt-0.5">Beyanname ve e-tebligat indirme otomasyonu için</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info('GİB entegrasyon ayarları modülü açılıyor.')}>Yapılandır</Button>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="font-medium text-slate-900 text-sm">SGK E-Bildirge</p>
                     <p className="text-xs text-slate-500 mt-0.5">Bordro onayları ve teşvik sorgulamaları için</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info('SGK entegrasyon ayarları modülü açılıyor.')}>Yapılandır</Button>
               </div>
               <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                     <p className="font-medium text-slate-900 text-sm">Gemini AI Model (Özel Talimatlar)</p>
                     <p className="text-xs text-slate-500 mt-0.5">Denetim asistanı bilgi bankası güncellemeleri</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info('AI model talimatları ekranı açılıyor.')}>Düzenle</Button>
               </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
