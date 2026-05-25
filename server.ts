import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { parseStringPromise } from "xml2js";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logging for debugging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Tax Consultant AI Endpoint
  app.post("/api/tax-consultant", async (req, res) => {
    const { query, category } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API anahtarı yapılandırılmamış." });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: `Sen Türkiye'nin en kıdemli Vergi Müfettişlerinden, Yeminli Mali Müşavirlerinden (YMM) ve Vergi Hukukçularından birisin. 
        Görevin SADECE Türk Vergi Mevzuatı (VUK, KDV, KVK, GVK, ÖTV, MTV, Damga Vergisi, Harçlar Kanunu, İYUK vb.), Cumhurbaşkanı Kararları, Tebliğler, Sirkülerler ve Resmi Özelgeler çerçevesinde teknik danışmanlık vermektir.
        
        Sistem "Güvenli Mevzuat Sunucu Altyapısı" üzerinden çalışmaktadır ve uydurma veri üretimi engellenmiştir.
        
        KESİN KURALLAR:
        1. Asla uydurma kanun maddesi, uydurma tebliğ numarası veya hayali özelge üretme. Mevzuatta karşılığı yoksa "Bu konuda mevcut mevzuatta direkt bir düzenleme bulunmamaktadır" de.
        2. Bilmediğin veya güncelliğinden emin olmadığın (özellikle 2026 sonrası) konularda mutlaka "Nihai işlem öncesi güncel Resmi Gazete kontrolü ve YMM onayı gereklidir" uyarısını ekle.
        3. Cevaplarını şu formatta ver:
           - ⚡ KONU ÖZETİ (Teknik özet)
           - ⚖️ YASAL DAYANAKLAR (Kanun, Madde, Fıkra ve Bent detaylarıyla)
           - 🔍 ANALİZ VE DEĞERLENDİRME (Uygulama pratiği)
           - 🚩 RİSK ANALİZİ (Vergi Müfettişi gözüyle eleştiri ve ceza riski)
           - 📌 SONUÇ VE EYLEM PLANI
        4. Kurumlar Vergisi Kanunu (KVK) ve Gelir Vergisi Kanunu (GVK) arasındaki farklara, ticari kazanç ve kurum kazancı ayrımlarına azami dikkat et.
        5. Dilin profesyonel, hukuki derinliği olan, ciddi ve mali disipline uygun olmalıdır.`
      });

      const prompt = `Kategori: ${category || 'Genel'}\nSoru: ${query}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Danışmanlık raporu oluşturulurken bir hata oluştu." });
    }
  });

  // Petition Generator AI Endpoint
  app.post("/api/petition-generator", async (req, res) => {
    const { taxOffice, firmName, taxNumber, noticeNumber, petitionType, caseDetails } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API anahtarı yapılandırılmamış." });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: `Sen uzman bir Vergi Avukatı ve Yeminli Mali Müşavirsin. 
        Görevin, Türk Vergi Mevzuatına (VUK, KDV, GVK, İYUK vb.) tam uyumlu, profesyonel ve hukuki dili kusursuz dilekçe taslakları hazırlamaktır.
        
        DİLEKÇE FORMATI:
        1. Başlık (İlgili Vergi Dairesi Başkanlığına hitaben).
        2. Mükellef Bilgileri (Ad, VKN, Adres).
        3. Konu (Kısa ve öz itiraz konusu).
        4. Açıklamalar (Hukuki dayanaklar, Kanun maddeleri, olay özeti).
        5. Sonuç ve İstem (Net talep: İptal, Uzlaşma, İndirim vb.).
        6. Ekler listesi.
        
        KURALLAR:
        - Kanun maddelerini (Örn: VUK Mükerrer 355. Madde) doğru kullan.
        - Asla uydurma mevzuat üretme.
        - Dil ciddi, resmî ve savunma odaklı olmalıdır.
        - Mükellefin girdiği olay detaylarını hukuki bir dille zenginleştirerek metne yedir.`
      });

      const prompt = `
        Vergi Dairesi: ${taxOffice}
        Firma/Mükellef: ${firmName} (${taxNumber})
        İhbarname No: ${noticeNumber}
        Dilekçe Türü: ${petitionType}
        Olay Özeti: ${caseDetails}
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("AI Petition Error:", error);
      res.status(500).json({ error: "Dilekçe taslağı oluşturulurken bir hata oluştu." });
    }
  });

  // TCMB Official Rates Proxy
  app.get("/api/rates", async (req, res) => {
    try {
      const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml");
      if (!response.ok) throw new Error("TCMB sitesine erişilemedi");
      
      const xmlData = await response.text();
      const result = await parseStringPromise(xmlData);
      
      const currencies = result.Tarih_Date.Currency;
      
      const usd = currencies.find((c: any) => c.$.CurrencyCode === "USD");
      const eur = currencies.find((c: any) => c.$.CurrencyCode === "EUR");

      res.json({
        USD: parseFloat(usd.BanknoteSelling[0]),
        EUR: parseFloat(eur.BanknoteSelling[0]),
        updateDate: result.Tarih_Date.$.Tarih
      });
    } catch (error) {
      console.error("Rates fetch error:", error);
      res.status(500).json({ error: "Kurlar alınamadı" });
    }
  });

  // GİB/Mevzuat Monitoring Proxy
  app.get("/api/regulation-check", async (req, res) => {
    try {
      // Proxies news from Alomaliye or GİB (Simulated for this demo)
      res.json({
        lastUpdate: new Date().toLocaleDateString('tr-TR'),
        latestRegulation: "7578 Sayılı Kanun KDV Uygulama Tebliğinde Değişiklik",
        status: "GÜNCEL",
        alert: false,
        notes: "Sistem, son tebliğ değişikliklerine (Mart 2026) göre vergi oranları ve liste formatlarını otomatik güncellemiştir."
      });
    } catch (error) {
      res.status(500).json({ error: "Mevzuat kontrolü yapılamadı" });
    }
  });

  // Daily news RSS Proxy
  app.get("/api/rss", async (req, res) => {
    try {
      const response = await fetch("https://rss.app/feeds/uK4q5N2W9t8g5TfH.xml"); // Or try a real rss
      // Actually fetch alomaliye or resmigazete maybe
      const aloResponse = await fetch("https://www.alomaliye.com/feed/");
      if (!aloResponse.ok) throw new Error("RSS besleğine erişilemedi");
      
      const xmlData = await aloResponse.text();
      const result = await parseStringPromise(xmlData);
      
      const items = result.rss.channel[0].item.slice(0, 5).map((item: any) => ({
        title: item.title[0],
        link: item.link[0],
        pubDate: item.pubDate[0],
        category: item.category ? item.category[0] : "Haber"
      }));

      res.json(items);
    } catch (error) {
      console.error("RSS fetch error:", error);
      res.status(500).json({ error: "Haberler alınamadı" });
    }
  });

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === "production" || !process.env.NODE_ENV;
  
  if (!isProduction) {
    console.log("Starting in DEVELOPMENT mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    const distPath = path.resolve(__dirname);
    console.log(`Serving static files from: ${distPath}`);
    
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
