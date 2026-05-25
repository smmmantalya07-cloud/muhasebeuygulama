/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/Dashboard';
import { CustomersPage } from './pages/Customers';
import { DeclarationsPage } from './pages/Declarations';
import { AuditPage } from './pages/Audit';
import { RiskReportsPage } from './pages/RiskReports';
import { SettingsPage } from './pages/Settings';
import { TaxConsultingPage } from './pages/TaxConsulting';
import { ExplanationAnalysisPage } from './pages/ExplanationAnalysis';
import { BankReconciliationPage } from './pages/BankReconciliation';
import { BankMovementsPage } from './pages/BankMovements';
import { AccrualOperationsPage } from './pages/AccrualOperations';
import { DefensePetitionPage } from './pages/DefensePetition';
import { ReportCenterPage } from './pages/ReportCenter';
import { TaxDeclarationPreparationPage } from './pages/TaxDeclarationPreparation';
import { Kdv1PreparationAuditPage } from './pages/Kdv1PreparationAudit';
import { TrialBalanceAnalysisPage } from './pages/TrialBalanceAnalysis';
import { DuplicateDocumentAnalysisPage } from './pages/DuplicateDocumentAnalysis';
import AccountCodeMapping from './pages/AccountCodeMapping';
import { AuditLogPage } from './pages/AuditLog';
import { VatRefundControlPage } from './pages/VatRefundControl';
import { VatRefundPreparationPage } from './pages/VatRefundPreparation';
import { VATControlCenterPage } from './pages/VATControlCenter';
import { DocumentOCRPage } from './pages/DocumentOCR';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { OfficialGazettePage } from './pages/OfficialGazette';
import { DataSecurityPage } from './pages/DataSecurity';
import { TestPanelPage } from './pages/TestPanel';
import { TaxAuditFilePage } from './pages/TaxAuditFile';
import { MonthlyClientReportPage } from './pages/MonthlyClientReport';
import { EvidenceCenterPage } from './pages/EvidenceCenter';
import { TripleAuditPage } from './pages/TripleAudit';
import { FakeDocumentIndicatorsPage } from './pages/FakeDocumentIndicators';
import { KasaRiskAnalysisPage } from './pages/KasaRiskAnalysis';
import { ExpenseAcceptancePage } from './pages/ExpenseAcceptance';
import { YmmCertificationPage } from './pages/YmmCertification';
import { DocumentVaultPage } from './pages/DocumentVault';
import { ProfessionalPortalsPage } from './pages/ProfessionalPortals';
import { AuditPreControlPage } from './pages/AuditPreControl';
import { FinancialAnalysisPage } from './pages/FinancialAnalysis';
import { InternalControlHilePage } from './pages/InternalControlHile';
import { VerificationPreparationPage } from './pages/VerificationPreparation';
import { LoginPage } from './pages/Login';
import { AiAssistant, FirmContextData } from './components/AiAssistant';
import { SpotlightSearch } from './components/SpotlightSearch';
import { NotificationsPage } from './pages/Notifications';
import { Scale, FileSearch, ShieldAlert, Wallet, Calculator, FileText, Newspaper, Shield, Users, BarChart3, Search, Link2, Download, MessageSquare, Building2, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { signOutGuest, auth, db, handleFirestoreError, OperationType, signInGuest } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';

const MOCK_FIRMS: FirmContextData[] = [
  {
    id: '1',
    name: 'ABC İnşaat Ltd. Şti.',
    vkn: '1234567890',
    vd: 'Marmara Kurumlar',
    sector: 'İnşaat / Taahhüt',
    mizanSummary: 'Kasa Hesabı (100) bakiyesi olağanın 5 katı (450.000 TL). Ortaklar Cari Hesabı (131) süreli borç veriyor (2.500.000 TL bakiye).',
    gelirTablosuSummary: 'Satışlar geçen yıla göre %40 oranında artmış ancak pazarlama giderleri %120 artmış. Dönemsellik riski olabilir.',
    bilancoSummary: 'Stoklar (153) önceki döneme göre %60 artmış. Ancak değer düşüklüğü karşılığı ayrılmamış.',
    beyannameSummary: 'Nisan dönemi KDV 1 beyannamesinde 4 aydır devreden KDV oluşuyor. İnceleme riski çok yüksek.',
    risk: "Düşük",
    riskColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: '2',
    name: 'Gama Medikal Pazarlama A.Ş.',
    vkn: '9876543210',
    vd: 'Beşiktaş',
    sector: 'Sağlık Cihazları Satış',
    mizanSummary: 'Ticari borçlarda ve avanslarda kur değerlemesi eksik. Demirbaş hesapları şişkin, amortisman ayrılması tamamlanmamış kalemler var.',
    gelirTablosuSummary: 'Satıştan iadeler toplam satışın %18 i olmuş, olağanüstü yüksek.',
    bilancoSummary: 'Bankalar ile mutabakatsızlık tespit edildi (fark: 42.000 TL).',
    beyannameSummary: 'Tam Tasdik (YMM) için KDV oran uyumsuzluğu var (İndirimli orana tabi işlemlerde usulsüzlük şüphesi).',
    risk: "Orta",
    riskColor: "bg-amber-100 text-amber-700"
  },
  {
    id: '3',
    name: 'Zeta Makine Sanayi Ticaret A.Ş.',
    vkn: '5554443332',
    vd: 'Pendik',
    sector: 'Makine İmalat',
    mizanSummary: 'Kasa bakiyesi eksiye düşmüş, ortaklar tarafından fonlama yapılmış ancak adatlandırma yok. Ar-Ge giderleri fiktif olabilir.',
    gelirTablosuSummary: 'Olağandışı giderler kalemi çok yüksek (Satışların %12 si).',
    bilancoSummary: 'Cari borçlar çok yüksek, likidite oranı 0.6.',
    beyannameSummary: 'KDV beyannamesinde tevkifat kodları hatalı girilmiş.',
    risk: "Yüksek",
    riskColor: "bg-red-100 text-red-700"
  },
  {
    id: '4',
    name: 'Delta Lojistik ve Taşımacılık Ltd.',
    vkn: '1112223334',
    vd: 'Hadımköy',
    sector: 'Lojistik',
    mizanSummary: 'Akaryakıt alımları ile araç listesi uyumsuz. Taşıtlar hesabında eski araçlar duruyor.',
    gelirTablosuSummary: 'Brüt kar marjı sektör ortalamasının altında (%4 vs %12).',
    bilancoSummary: 'Şüpheli alacaklar karşılığı ayrılmamış.',
    beyannameSummary: 'SGK bildirimleri ile muhtasar beyanname çapraz kontrolünde fark var.',
    risk: "Orta",
    riskColor: "bg-amber-100 text-amber-700"
  },
  {
    id: '5',
    name: 'Epsilon Teknoloji Yazılım A.Ş.',
    vkn: '9998887776',
    vd: 'Zincirlikuyu',
    sector: 'Yazılım',
    mizanSummary: 'Yurt dışı satışlarda KDV istisnası belgeleri eksik.',
    gelirTablosuSummary: 'Tasarım giderleri %200 artmış, personelle uyumsuz.',
    bilancoSummary: 'Gayrimaddi haklar değerlemesi güncel değil.',
    beyannameSummary: 'Teknopark muafiyet hesaplamaları manuel yapılmış, hata riski var.',
    risk: "Düşük",
    riskColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: '6',
    name: 'Beta Gıda İthalat İhracat Ltd.',
    vkn: '2223334445',
    vd: 'Mersin Kurumlar',
    sector: 'Gıda Dış Ticaret',
    mizanSummary: 'İthalat transferleri ile muavin kayıtları arasında 15 günlük kur farkı uyuşmazlığı var.',
    gelirTablosuSummary: 'Pazarlama giderleri satışın %25\'i, çok yüksek.',
    bilancoSummary: 'Alacak senetleri reeskontu eksik.',
    beyannameSummary: 'KDV beyannamesinde 1 numaralı tebliğ uyarınca indirim iptali gerekiyor.',
    risk: "Orta",
    riskColor: "bg-amber-100 text-amber-700"
  },
  {
    id: '7',
    name: 'Sigma Enerji Sistemleri A.Ş.',
    vkn: '7776665554',
    vd: 'Ankara Kurumlar',
    sector: 'Enerji',
    mizanSummary: 'Yatırım teşvik belgesi kapsamındaki alımlarda KDV istisnası uygulaması yanlış yapılmış.',
    gelirTablosuSummary: 'Finansman giderleri çok yüksek, örtülü sermaye riski!',
    bilancoSummary: 'Kısa vadeli krediler rotatif ağırlıklı, likidite riski.',
    beyannameSummary: 'Teşvikli alımların beyannamede bildirilme kodu hatalı.',
    risk: "Yüksek",
    riskColor: "bg-red-100 text-red-700"
  },
  {
    id: '8',
    name: 'Omega Turizm İşletmeleri Ltd.',
    vkn: '8889990001',
    vd: 'Antalya Kurumlar',
    sector: 'Turizm',
    mizanSummary: 'Dövizli kasa bakiyesi fiili durumla uyumsuz (Fark: $12.000).',
    gelirTablosuSummary: 'Maliyetler (740) personelle uyumlu değil, mevsimsellik hatası var.',
    bilancoSummary: 'Gelecek aylara ait gelirler hesabı pasif duruyor.',
    beyannameSummary: 'Konaklama vergisi hesaplamaları ile fatura dökümü uyuşmuyor.',
    risk: "Orta",
    riskColor: "bg-amber-100 text-amber-700"
  },
  {
    id: '9',
    name: 'Alfa Danışmanlık Hizmetleri A.Ş.',
    vkn: '3334445556',
    vd: 'Maslak',
    sector: 'Danışmanlık',
    mizanSummary: 'Telif ödemelerinde stopaj oranı hatalı uygulanmış olabilir.',
    gelirTablosuSummary: 'Genel yönetim giderleri çok stabil, reasürans veya tahakkuk riski olabilir.',
    bilancoSummary: 'Bankalar ile %100 mutabık.',
    beyannameSummary: 'Stopaj beyannamesinde serbest meslek ödemeleri eksik bildirilmiş.',
    risk: "Düşük",
    riskColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: '10',
    name: 'İota Tekstil Konfeksiyon Ltd.',
    vkn: '4445556667',
    vd: 'Bursa Kurumlar',
    sector: 'Tekstil',
    mizanSummary: 'Fire oranları sanayi odası limitlerinin çok üzerinde (%8 vs %3).',
    gelirTablosuSummary: 'İhracat kayıtlı satışlarda kur farkı geliri eksik hesaplanmış.',
    bilancoSummary: 'Stoklarda yavaş hareket eden kalemler için karşılık ayrılmamış.',
    beyannameSummary: 'KDV iadesi yüklenilen listesinde yinelenen faturalar var.',
    risk: "Yüksek",
    riskColor: "bg-red-100 text-red-700"
  },
  {
    id: '11',
    name: 'Emin ...A.Ş.',
    vkn: '1122334455',
    vd: 'Antalya Kurumlar',
    sector: 'Genel Ticaret',
    mizanSummary: 'Veri bekleniyor.',
    gelirTablosuSummary: 'Veri bekleniyor.',
    bilancoSummary: 'Veri bekleniyor.',
    beyannameSummary: 'Beyanname verileri henüz yüklenmedi.',
    risk: "Düşük",
    riskColor: "bg-emerald-100 text-emerald-700"
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAppAuthenticated') === 'true';
  });
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeFirmId, setActiveFirmId] = useState<string>('');

  const [firms, setFirms] = useState<FirmContextData[]>(MOCK_FIRMS);

  useEffect(() => {
    const handleFsError = (e: any) => {
       toast.error("Firestore Error: " + e.detail);
    };
    window.addEventListener('firestore-error', handleFsError);
    return () => window.removeEventListener('firestore-error', handleFsError);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const q = query(collection(db, 'firms'), where('userId', '==', user.uid));
        
        const seedDataAsync = async () => {
          // Seed default data if empty or missing any from MOCK_FIRMS
          try {
             const snap = await getDocs(q);
             const existingIds = snap.docs.map(d => d.id);
             
             const batch = writeBatch(db);
             let defaultsToUse: any[] = MOCK_FIRMS;
             
             // If they have legacy local storage, try to merge it
             const storedFirms = localStorage.getItem('appFirms');
             if (storedFirms) {
               try {
                 const parsedLocal = JSON.parse(storedFirms);
                 if (Array.isArray(parsedLocal) && parsedLocal.length > 0) {
                    const localMap = new Map(parsedLocal.map(f => [f.id, f]));
                    defaultsToUse = MOCK_FIRMS.map(mock => localMap.has(mock.id) ? localMap.get(mock.id) : mock);
                    parsedLocal.forEach(local => {
                      if (!defaultsToUse.some(d => d.id === local.id)) {
                        defaultsToUse.push(local);
                      }
                    });
                 }
               } catch (e) {}
             }
             
             let addedCount = 0;
             defaultsToUse.forEach(d => {
               if (!existingIds.includes(d.id)) {
                 const ref = doc(db, 'firms', d.id);
                 const { id, ...dataToSave } = d;
                 batch.set(ref, { ...dataToSave, userId: user.uid });
                 addedCount++;
               }
             });
             
             if (addedCount > 0) {
               try {
                 await batch.commit();
                 console.log("Seeded " + addedCount + " firms successfully");
                 localStorage.setItem('fb_migrated', 'true');
               } catch (commitErr) {
                 console.error("Batch commit failed:", commitErr);
                 alert("Firestore veri kaydetme hatası: " + (commitErr as any).message);
               }
             }
          } catch (e) {
             console.error("Setup error", e);
          }
        };

        // Fire and forget
        seedDataAsync();

        const unsubFirms = onSnapshot(q, (snapshot) => {
          const firmsData: FirmContextData[] = [];
          snapshot.forEach((docSnap) => {
            firmsData.push({ id: docSnap.id, ...docSnap.data() } as FirmContextData);
          });

          if (firmsData.length > 0) {
            setFirms(firmsData.sort((a,b) => (a.name || '').localeCompare(b.name || '', 'tr')));
          } else if (localStorage.getItem('fb_migrated')) {
            // If migrated but truly empty, show empty list
            setFirms([]);
          } else {
            // Still show MOCK if not migrated and empty
            setFirms(MOCK_FIRMS);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'firms');
        });

        return () => unsubFirms();
      } else {
        // If not authenticated in Firebase, we only set false if there is no local override
        if (localStorage.getItem('isAppAuthenticated') !== 'true') {
          setIsAuthenticated(false);
        }
        setFirms(MOCK_FIRMS); // Default to mock data when logged out
        // Auto-login guest if not authenticated
        signInGuest();
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      }
    }
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const selectedFirmInfo = firms.find(f => f.id === activeFirmId) || null;

  const handleAddFirmGlobal = async (newFirmData: any) => {
    const newId = String(Date.now()); // Better ID generation for added firms
    const freshFirm: FirmContextData = {
      id: newId,
      ...newFirmData,
      risk: "Düşük",
      riskColor: "bg-emerald-100 text-emerald-700",
      sector: 'Genel',
      mizanSummary: 'Yeni kayıt edildi, veri bekleniyor.',
      gelirTablosuSummary: 'Veri bekleniyor.',
      bilancoSummary: 'Veri bekleniyor.',
      beyannameSummary: 'Beyanname verileri henüz yüklenmedi.',
      userId: auth.currentUser?.uid || 'demo-user'
    };

    if (!auth.currentUser) {
       // Demo Mode - Local State
       setFirms(prev => [...prev, freshFirm].sort((a,b) => (a.name || '').localeCompare(b.name || '', 'tr')));
       toast.success("Firma (Demo) kaydedildi.");
       return true;
    }

    try {
      const ref = doc(db, 'firms', newId);
      const { id, ...dataToSave } = freshFirm;
      await setDoc(ref, dataToSave);
      toast.success("Firma veritabanına kaydedildi.");
      return true;
    } catch (e: any) {
      console.error(e);
      toast.error("Firebase Hatası: " + (e.message || String(e)));
      return false;
    }
  };

  const handleUpdateFirmGlobal = async (updatedFirm: FirmContextData) => {
    if (!auth.currentUser) {
       // Demo Mode
       setFirms(prev => prev.map(f => f.id === updatedFirm.id ? updatedFirm : f).sort((a,b) => (a.name || '').localeCompare(b.name || '', 'tr')));
       toast.success("Firma (Demo) güncellendi.");
       return;
    }

    try {
      const ref = doc(db, 'firms', updatedFirm.id);
      const { id, userId, ...dataToSave } = updatedFirm;
      await setDoc(ref, dataToSave, { merge: true });
    } catch (e) {
       handleFirestoreError(e, OperationType.UPDATE, 'firms');
    }
  };

  const handleDeleteFirmGlobal = async (id: string) => {
    if (!auth.currentUser) {
       // Demo Mode
       setFirms(prev => prev.filter(f => f.id !== id));
       if (activeFirmId === id) setActiveFirmId('');
       toast.success("Firma (Demo) silindi.");
       return;
    }

    try {
      const ref = doc(db, 'firms', id);
      await deleteDoc(ref);
      if (activeFirmId === id) setActiveFirmId('');
    } catch (e) {
       handleFirestoreError(e, OperationType.DELETE, 'firms');
    }
  };

  return (
    <div className="w-full h-full">
      <Toaster position="top-right" />
      {!isAuthenticated ? (
         <LoginPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
         <>
         <DashboardLayout 
           activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeFirm={selectedFirmInfo}
        onFirmChange={setActiveFirmId}
        firmsList={firms}
        onLogout={async () => {
          await signOutGuest();
          localStorage.removeItem('isAppAuthenticated');
          setIsAuthenticated(false);
          setActiveTab('home');
        }}
      >
        {activeTab === 'home' && <DashboardPage onNavigate={setActiveTab} />}
        {activeTab === 'customers' && (
          <CustomersPage 
            firms={firms} 
            onAddFirm={handleAddFirmGlobal} 
            onUpdateFirm={handleUpdateFirmGlobal}
            onDeleteFirm={handleDeleteFirmGlobal}
            onNavigate={setActiveTab}
            onFirmChange={setActiveFirmId}
          />
        )}
        
        {/* MEVZUAT & BEYANNAME */}
        {activeTab === 'resmi-gazete' && <OfficialGazettePage />}
        {activeTab === 'vergi-danismanligi' && <TaxConsultingPage />}
        {activeTab === 'declarations' && <DeclarationsPage />}
        {activeTab === 'kdv-kontrol' && <VATControlCenterPage />}
        {activeTab === 'savunma-dilekcesi' && <DefensePetitionPage />}
        {activeTab === 'inceleme-dosyalari' && <TaxAuditFilePage />}
        {activeTab === 'mukellef-raporlari' && <MonthlyClientReportPage />}

        {/* DENETİM, RİSK & YMM */}
        {activeTab === 'uclu-denetim' && <TripleAuditPage />}
        {activeTab === 'izaha-davet' && <ExplanationAnalysisPage />}
        {activeTab === 'sahte-belge' && <FakeDocumentIndicatorsPage />}
        {activeTab === 'kasa-analizi' && <KasaRiskAnalysisPage />}
        {activeTab === 'icer-kontrol-hile' && <InternalControlHilePage />}
        {activeTab === 'reports' && <RiskReportsPage />}
        {activeTab === 'ymm-tasdik' && <YmmCertificationPage />}
        {activeTab === 'karsit-inceleme-hazirlik' && <VerificationPreparationPage />}
        {activeTab === 'kdv-iadesi' && <VatRefundControlPage />}
        {activeTab === 'kdv-iade-hazirlik' && <VatRefundPreparationPage activeFirm={selectedFirmInfo} />}
        {activeTab === 'denetim-on-kontrol' && <AuditPreControlPage />}
        {activeTab === 'finansal-tablo' && <FinancialAnalysisPage />}

        {/* MUHASEBE İŞLEMLERİ */}
        {activeTab === 'kdv1-hazirlik-audit' && <Kdv1PreparationAuditPage />}
        {activeTab === 'mukerrer-kayit-analiz' && <DuplicateDocumentAnalysisPage />}
        {activeTab === 'ocr' && <DocumentOCRPage />}
        {activeTab === 'banka-mutabakat' && <BankReconciliationPage />}
        {activeTab === 'banka-hareketleri' && <BankMovementsPage />}
        {activeTab === 'tahakkuk-islemleri' && <AccrualOperationsPage />}
        {activeTab === 'gider-kabul' && <ExpenseAcceptancePage />}
        {activeTab === 'beyanname-hazirlama' && <TaxDeclarationPreparationPage activeFirm={selectedFirmInfo} />}
        {activeTab === 'hesap-kodu-atama' && <AccountCodeMapping />}
        
        {/* MERKEZLER */}
        {activeTab === 'kanit-merkezi' && <EvidenceCenterPage />}
        {activeTab === 'dokuman-kasasi' && <DocumentVaultPage />}
        {activeTab === 'rapor-merkezi' && <ReportCenterPage />}
        {activeTab === 'professional-portals' && <ProfessionalPortalsPage />}

        {/* SİSTEM & AYARLAR */}
        {activeTab === 'notifications' && <NotificationsPage />}
        {activeTab === 'tasks' && <PlaceholderPage title="Görevler" description="Tüm görevlerinizi buradan takip edin." icon={CheckCircle2} />}
        {activeTab === 'veri-guvenligi' && <DataSecurityPage />}
        {activeTab === 'kullanicilar' && <PlaceholderPage title="Kullanıcılar & Yetkiler" description="Rol ve yetki tanımlamaları." icon={Users} />}
        {activeTab === 'audit-log' && <AuditLogPage />}
        {activeTab === 'entegrasyonlar' && <PlaceholderPage title="Entegrasyonlar" description="GİB, SGK, e-Defter vb. dış bağlantılar." icon={Link2} />}
        {activeTab === 'test-paneli' && <TestPanelPage />}
        {activeTab === 'settings' && <SettingsPage />}

        {/* OLD / OTHER TABS */}
        {activeTab === 'mizan-analiz' && <TrialBalanceAnalysisPage activeFirm={selectedFirmInfo} />}
        {activeTab === 'cari-mutabakat' && <PlaceholderPage title="Cari Mutabakat Merkezi" description="BA/BS ve cari bakiye mutabakat portalı." icon={Users} />}
        {activeTab === 'finansal-analiz' && <FinancialAnalysisPage />}
      </DashboardLayout>
      
      <AiAssistant 
         isOpen={isAiOpen} 
         onClose={() => setIsAiOpen(false)} 
         activeFirm={selectedFirmInfo} 
      />
      
      <SpotlightSearch 
         isOpen={isSearchOpen} 
         onClose={() => setIsSearchOpen(false)} 
      />
      </>
      )}
    </div>
  );
}
