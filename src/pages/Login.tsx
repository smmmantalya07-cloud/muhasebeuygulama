import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ShieldCheck, Lock, User, ArrowRight, Building2, TrendingUp, Presentation, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { signInGuest } from '@/lib/firebase';
import { BrandLogo } from '@/components/BrandLogo';
import { signInWithGoogle } from '@/lib/firebase';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      const storedUsername = localStorage.getItem('appUsername') || 'Orhan';
      const storedPassword = localStorage.getItem('appPassword') || '1234';
      const userEmail = "smmmantalya07@gmail.com";

      const normalizedUsername = username.trim().toLowerCase();
      const normalizedStoredUsername = storedUsername.trim().toLowerCase();
      const normalizedStoredPassword = storedPassword.trim();
      const inputPassword = password.trim();

      const isUsernameCorrect = normalizedUsername === normalizedStoredUsername || normalizedUsername === userEmail.toLowerCase();
      const isPasswordCorrect = inputPassword === normalizedStoredPassword;

      if (isUsernameCorrect && isPasswordCorrect) {
        try {
          localStorage.setItem('isAppAuthenticated', 'true');
          toast.success("Giriş başarılı. Sisteme yönlendiriliyorsunuz.");
          onLogin();
        } catch (e) {
          console.error("LocalStorage error", e);
          onLogin(); // Proceed anyway
        }
      } else {
        toast.error("Hatalı kullanıcı adı veya şifre! (Demo Şifresi: 1234)");
        setIsLoading(false);
      }
    }, 800);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        localStorage.setItem('isAppAuthenticated', 'true');
        toast.success("Demo kullanıcı olarak giriş yapılıyor...");
        onLogin();
      } catch (e) {
        onLogin();
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Graphic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20"
        >
          <Building2 className="w-24 h-24 text-blue-500/20" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-32"
        >
          <TrendingUp className="w-40 h-40 text-emerald-500/20" />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/4 right-1/4"
        >
          <FileText className="w-32 h-32 text-indigo-500/10" />
        </motion.div>
        
        <motion.div
          animate={{ x: [0, 40, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-20 left-1/4"
        >
          <Calculator className="w-20 h-20 text-blue-400/20" />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900/90 z-0" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl z-10 relative"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 p-2 ring-1 ring-white/20"
          >
            <BrandLogo size="xl" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic text-center">Üçlü Denetim</h1>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mt-2 text-center">Orhan Polat | Mali Müşavir</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest pl-1">Kullanıcı Adı</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Örn: Orhan"
                className="pl-11 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-400 font-medium text-lg rounded-xl transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest pl-1">Şifre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="pl-11 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:border-blue-400 font-medium rounded-xl transition-all"
                required
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  SİSTEME GİRİŞ YAP <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        <div className="mt-4 flex items-center justify-center gap-4">
           <div className="h-px bg-white/10 flex-1" />
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">VEYA</span>
           <div className="h-px bg-white/10 flex-1" />
        </div>

        <motion.div 
          className="mt-4 space-y-3"
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            onClick={async () => {
              try {
                await signInWithGoogle();
                localStorage.setItem('isAppAuthenticated', 'true');
                onLogin();
              } catch (e) {
                console.error(e);
                toast.error("Google girişi şu an kullanılamıyor, lütfen Demo Girişini deneyin.");
              }
            }}
            className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google ile Giriş Yap
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full h-12 bg-transparent border-white/20 text-white hover:bg-white/5 text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            HIZLI DEMO GİRİŞİ (YENİ)
          </Button>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Güvenli, şifrelenmiş ve denetimli bağlantı.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
