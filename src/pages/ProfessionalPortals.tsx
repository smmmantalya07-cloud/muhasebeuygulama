import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, Globe, Shield, CreditCard, FileText, 
  Building2, Landmark, HelpCircle, ArrowRight, Zap 
} from 'lucide-react';

export function ProfessionalPortalsPage() {
  const portals = [
    {
      category: "KAMU PORTALLARI",
      items: [
        { name: "Gelir İdaresi Başkanlığı (GİB)", url: "https://www.gib.gov.tr", description: "İnteraktif Vergi Dairesi, Beyanname işlemleri ve duyurular.", icon: <Building2 className="w-5 h-5 text-indigo-600" /> },
        { name: "e-Defter Portalı", url: "https://edefter.gov.tr", description: "e-Defter yükleme, berat işlemleri ve teknik rehberler.", icon: <FileText className="w-5 h-5 text-emerald-600" /> },
        { name: "SGK İşveren Sistemi", url: "https://uyg.sgk.gov.tr/IsverenSistemi", description: "Sigortalı işe giriş, bildirim ve teşvik sorgulama.", icon: <Shield className="w-5 h-5 text-blue-600" /> },
        { name: "Ticaret Sicil Gazetesi", url: "https://www.ticaretsicil.gov.tr", description: "Şirket kuruluş ve değişiklik ilanları sorgulama.", icon: <Globe className="w-5 h-5 text-amber-600" /> }
      ]
    },
    {
      category: "MİLLİ BANKALAR & FİNANS",
      items: [
        { name: "Merkez Bankası (TCMB)", url: "https://www.tcmb.gov.tr", description: "Günlük döviz kurları ve ekonomik veriler.", icon: <Landmark className="w-5 h-5 text-slate-700" /> },
        { name: "Bankalar Birliği Risk Merkezi", url: "https://www.riskerkezi.org", description: "Kredi limit ve risk raporları sorgulama.", icon: <CreditCard className="w-5 h-5 text-rose-600" /> }
      ]
    },
    {
      category: "MESLEKİ KURULUŞLAR",
      items: [
        { name: "TÜRMOB", url: "https://www.turmob.org.tr", description: "Meslek mevzuatı ve eğitim duyuruları.", icon: <Zap className="w-5 h-5 text-indigo-500" /> },
        { name: "KGK Portal", url: "https://kgk.gov.tr", description: "Bağımsız denetim standartları ve duyurular.", icon: <Shield className="w-5 h-5 text-emerald-500" /> }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Globe className="w-6 h-6 text-indigo-600" />
            KAMU PORTALLARI & WEB SİTELERİM
          </h1>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Mali Müşavirlik iş akışında kullanılan tüm resmî portal ve sitelere hızlı erişim köprüsü.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {portals.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{section.category}</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {section.items.map((portal, pIdx) => (
                <Card key={pIdx} className="border-slate-200 shadow-sm hover:border-indigo-300 transition-all group hover:shadow-md cursor-pointer bg-white" onClick={() => window.open(portal.url, '_blank')}>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                        {portal.icon}
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <h3 className="text-[13px] font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-700 transition-colors">
                      {portal.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {portal.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      SİTEYE GİT <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
          <HelpCircle size={140} strokeWidth={1} />
        </div>
        <div className="max-w-2xl relative z-10">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Portal Erişimi & Şifre Yönetimi Hakkında</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Yukarıdaki sitelere giriş yaparken şifreleriniz tarayıcınızın güvenli şifre kasasında veya kurumsal "Şifre Deposu" modülümüzde saklanmaktadır. 
            Müşavir AI sistemi asla bu şifreleri sunucularına iletmez, işlem sadece sizin tarayıcınız üzerinden resmî sitelere yönlendirilerek gerçekleştirilir.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black text-xs uppercase tracking-widest px-6 h-11 border-none">
              ŞİFRE DEPOSUNU AÇ
            </Button>
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-black text-xs uppercase tracking-widest px-6 h-11">
              PORTAL YARDIMI AL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
