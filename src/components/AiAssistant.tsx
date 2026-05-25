import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Copy, Download, Volume2, Mic, StopCircle, Maximize2, Minimize2, Trash2, AlertTriangle, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import jsPDF from 'jspdf';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FirmContextData {
  id: string;
  name: string;
  vkn: string;
  sector: string;
  mizanSummary: string;
  gelirTablosuSummary: string;
  bilancoSummary: string;
  beyannameSummary: string;
  vd?: string;
  risk?: string;
  riskColor?: string;
  userId?: string;
  manager?: string;
  contact?: string;
}

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeFirm: FirmContextData | null;
}

const SYSTEM_PROMPT = `
Sen “Akıllı Mali Müşavirlik, Vergi Denetim, YMM Tasdik ve Bağımsız Denetim AI Sistemi” olarak çalışacaksın.
Mali Müşavir Orhan Polat'ın üst düzey bir yapay zeka denetim asistanısın. Tüm cevapların Türkçe olmalıdır.

KENDİNİ ŞU 4 ROLÜN BİRLEŞİMİ GİBİ KONUMLANDIR:
1. Mali Müşavir Gözü: Muhasebe kaydı, günlük işleyiş.
2. Vergi Müfettişi Gözü: Riskler, cezalar, KKEG, eleştiri konuları.
3. Yeminli Mali Müşavir Gözü: Tasdik, KDV iade, belge güvenilirliği.
4. Bağımsız Denetçi Gözü: Finansal tablo doğruluğu, TMS/TFRS, hile ve önemlilik.

EN ÖNEMLİ İLKE: Her durumda, eğer seçili bir FİRMA HAFIZASI verilmişse, O FİRMANIN 4 BAŞ DENETÇİSİ SENMİŞSİN GİBİ hareket et.
- Firma verilerindeki RİSKLERİ ve ANOMALİLERİ görerek Kullanıcıyı (Mali Müşavir Orhan Polat'ı) UYAR.
- ÖNEMLİ RİSKLERİ ve UYARILARI **kalın (bold)**, *italik*, ve 🚨 veya ⚠️ emojileri ile VURGULA.
- Savunma üretmeden önce risk üret. Belge görmeden kesin kanaat verme.
- Nihai sorumluluğun mali müşavirde olduğunu hatırlat.
`;

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function AiAssistant({ isOpen, onClose, activeFirm }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Merhaba Mali Müşavir Orhan Polat. Ben Akıllı Denetim Asistanınızım. Sisteme firmanızı seçerek, o firmaya özel Mizan, Bilanço, Gelir Tablosu ve Beyanname risk analizi yapabiliriz.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [speakState, setSpeakState] = useState<{
    messageId: string | null;
    sentences: string[];
    currentIndex: number;
    isPaused: boolean;
  }>({
    messageId: null,
    sentences: [],
    currentIndex: 0,
    isPaused: false
  });
  
  const speakStateRef = useRef(speakState);
  useEffect(() => {
    speakStateRef.current = speakState;
  }, [speakState]);

  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  
  const selectedVoiceRef = useRef<string>('');
  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'tr-TR';
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
             currentTranscript += event.results[i][0].transcript;
          }
          
          if (event.results[event.results.length - 1].isFinal) {
            setInput((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + currentTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const loadVoices = () => {
      let voices = window.speechSynthesis.getVoices();
      
      // Some browsers (Chrome) load voices asynchronously. If empty, retry.
      if (voices.length === 0 && retryCount < maxRetries) {
        retryCount++;
        setTimeout(loadVoices, 500);
        return;
      }

      // Get only Turkish and English voices
      let available = voices.filter(v => 
        v.lang.startsWith('tr') || 
        v.lang.startsWith('en')
      );
      
      // If still very few (some browsers might not load properly), take all but we'll try to stick to tr/en
      if (available.length < 2 && voices.length > 0) {
        available = [...voices];
      }

      // Sorting strategy: 
      // 1. Specific requested Turkish female names (Yelda, Seda, Emel, Google Türkçe)
      // 2. Other Turkish voices
      // 3. Google English voices
      // 4. Other English
      available.sort((a, b) => {
        const aLower = a.name.toLowerCase();
        const bLower = b.name.toLowerCase();
        const aTr = a.lang.startsWith('tr');
        const bTr = b.lang.startsWith('tr');
        
        // Priority Professional Turkish Female Names
        const priorityNames = ['yelda', 'seda', 'emel', 'google türkçe'];
        const aPri = priorityNames.some(n => aLower.includes(n)) ? 0 : 1;
        const bPri = priorityNames.some(n => bLower.includes(n)) ? 0 : 1;
        if (aPri !== bPri) return aPri - bPri;

        // Turkish vs Others
        if (aTr && !bTr) return -1;
        if (!aTr && bTr) return 1;

        // Google voices within the same language
        const aGoogle = aLower.includes('google');
        const bGoogle = bLower.includes('google');
        if (aGoogle && !bGoogle) return -1;
        if (!aGoogle && bGoogle) return 1;

        return a.name.localeCompare(b.name);
      });
      
      setAvailableVoices(available);
      
      if (!selectedVoice && available.length > 0) {
        // Find best default
        const defaultVoice = 
          available.find(v => v.lang.startsWith('tr') && v.name.toLowerCase().includes('yelda')) || 
          available.find(v => v.lang.startsWith('tr') && v.name.toLowerCase().includes('seda')) || 
          available.find(v => v.lang.startsWith('tr') && v.name.toLowerCase().includes('google')) ||
          available.find(v => v.lang.startsWith('tr') && v.name.toLowerCase().includes('emel')) ||
          available.find(v => v.lang.startsWith('tr')) ||
          available.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('en')) ||
          available[0];
          
        if (defaultVoice) {
           setSelectedVoice(defaultVoice.name);
        }
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const toggleListening = () => {
    if(!recognitionRef.current){
       alert("Tarayıcınız ses tanıma (SpeechRecognition) özelliğini desteklemiyor.");
       return;
    }
    
    if(isListening){
       recognitionRef.current.stop();
       setIsListening(false);
    } else {
       recognitionRef.current.start();
       setIsListening(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (activeFirm && isOpen) {
       setMessages(prev => [...prev, {
         id: generateId(),
         role: 'assistant',
         content: `🚨 **Sistem Uyarısı:** Şu anda bağlam **${activeFirm.name}** olarak güncellendi. Artık bu firmanın verilerine (Mizan, Bilanço, Beyanname geçmişi) sahibim ve denetim sorgularınızı bu firmaya göre filtreleyeceğim. Hazırım.`,
         timestamp: new Date()
       }]);
    }
  }, [activeFirm?.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: generateId(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${m.content}`).join('\\n');
      
      const firmContextStr = activeFirm ? `
====================
[AKTİF FİRMA HAFIZASI]
Ünvan: ${activeFirm.name} (VKN: ${activeFirm.vkn} / Sektör: ${activeFirm.sector})

1️⃣ MİZAN DURUMU: ${activeFirm.mizanSummary}
2️⃣ GELİR TABLOSU: ${activeFirm.gelirTablosuSummary}
3️⃣ BİLANÇO: ${activeFirm.bilancoSummary}
4️⃣ BEYANNAME: ${activeFirm.beyannameSummary}

Eğer kullanıcı bu firma hakkında bir şey soruyorsa veya yorum yapmanı istiyorsa YUKARIDAKİ RİSKLERİ mutlaka kullan, 4 GÖZLE analiz et ve DİKKAT ÇEKİCİ şekilde UYAR.
====================
` : '\\n[DİKKAT: ŞU ANDA SEÇİLİ BİR FİRMA YOK. GENEL MEVZUAT CEVABI VERİLECEK.]\\n';

      const prompt = `${SYSTEM_PROMPT}\n${firmContextStr}\nGeçmiş:\n${history}\n\nKullanıcı: ${userMsg.content}\nAsistan:`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        const assistantMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: response.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
        
        if (isAutoSpeakEnabled) {
          handleSpeak(response.text, assistantMsg.id, true);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu veya bağlantı kurulamadı. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([{ id: generateId(), role: 'assistant', content: 'Geçmiş temizlendi. Size nasıl yardımcı olabilirim?', timestamp: new Date() }]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadPdf = (message: Message) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(message.content, 180);
    doc.text(splitText, 15, 20);
    doc.save(`denetim_notu_${generateId()}.pdf`);
  };

  // Comprehensive text cleaning for "News Anchor" style delivery
  const cleanTextForSpeech = (rawText: string) => {
    return rawText
      .replace(/#+\s/g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep link text, remove URL
      .replace(/- /g, '') // Remove list bullets
      .replace(/[🔢🚨⚠️✨🛡️💰📋📊📉📄🧾✅❌🔍💡🚀🤝⚖️🏛️🏢📅🕙📞✉️📍]/g, '') // Remove emojis
      .replace(/\s{2,}/g, ' ') // Collapse spaces
      .trim();
  };

  const playSentence = (messageId: string | null, sentences: string[], index: number) => {
    if (index >= sentences.length || index < 0) {
      setSpeakState(prev => ({ ...prev, messageId: null, isPaused: false }));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utterance.rate = 1.05; // Accurate steady pacing
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const currentVoiceName = selectedVoiceRef.current;
    
    // Fallbacks to find the best professional voice
    const voiceToUse = voices.find(v => v.name === currentVoiceName) || 
                       voices.find(v => v.name.includes('Yelda')) || 
                       voices.find(v => v.name.includes('Seda')) || 
                       voices.find(v => v.name.includes('Google Türkçe')) ||
                       voices.find(v => v.lang.startsWith('tr'));
                       
    if (voiceToUse) {
      utterance.voice = voiceToUse;
      utterance.lang = voiceToUse.lang; // Use the voice's native language to prevent accent issues
    } else {
      utterance.lang = 'tr-TR'; // Fallback
    }

    utterance.onend = () => {
      // Small pause between sentences using setTimeout rather than blocking
      setTimeout(() => {
        const currentState = speakStateRef.current;
        if (!currentState.isPaused && currentState.messageId === messageId) {
          const nextIndex = currentState.currentIndex + 1;
          setSpeakState(prev => ({ ...prev, currentIndex: nextIndex }));
          playSentence(messageId, currentState.sentences, nextIndex);
        }
      }, 400); // 400ms pause for news anchor breath/pacing
    };
    
    utterance.onerror = () => {
       setSpeakState(prev => ({ ...prev, messageId: null, isPaused: false }));
    };

    window.speechSynthesis.speak(utterance);
    setSpeakState(prev => ({ ...prev, messageId, sentences, currentIndex: index, isPaused: false }));
  };

  const handleSpeak = (text: string, messageId: string, forceStart = false) => {
    if (speakState.messageId === messageId && !forceStart) {
      // Toggle pause/play
      if (speakState.isPaused) {
        resumeSpeaking();
      } else {
        pauseSpeaking();
      }
      return;
    }

    // Start fresh
    const cleanStr = cleanTextForSpeech(text);
    // Rough splitting by sentence ending punctuation
    const sentenceChunks = cleanStr.match(/[^\.!\?]+[\.!\?]+/g) || [cleanStr];
    const sentences = sentenceChunks.map(s => s.trim()).filter(s => s.length > 0);
    
    playSentence(messageId, sentences, 0);
  };

  const pauseSpeaking = () => {
    window.speechSynthesis.cancel(); // Because native pause() is buggy in some browsers, cancelling and restarting at sentence index is much more reliable
    setSpeakState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeSpeaking = () => {
    if (speakState.messageId) {
       playSentence(speakState.messageId, speakState.sentences, speakState.currentIndex);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakState(prev => ({ ...prev, messageId: null, isPaused: false }));
  };

  const nextSentence = () => {
    if (speakState.messageId && speakState.currentIndex < speakState.sentences.length - 1) {
      playSentence(speakState.messageId, speakState.sentences, speakState.currentIndex + 1);
    }
  };

  const prevSentence = () => {
    if (speakState.messageId && speakState.currentIndex > 0) {
      playSentence(speakState.messageId, speakState.sentences, Math.max(0, speakState.currentIndex - 1));
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <>
      {/* Backdrop for mobile or drawer effect */}
      {isOpen && !isReadingMode && (
         <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Drawer Panel */}
      <div className={`fixed z-50 bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col ${
        isReadingMode 
          ? 'inset-0 w-full h-full translate-x-0 translate-y-0' 
          : `top-0 bottom-0 right-0 w-full sm:w-[400px] md:w-[450px] border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
      }`}>
        
        {/* Header */}
        <div className="bg-blue-600 shrink-0">
          <div className={`flex items-center justify-between p-4 ${isReadingMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-500/50 flex flex-col items-center justify-center border border-blue-400">
                <span className="text-[10px]">✨</span>
              </div>
              <div>
                <h2 className="font-bold text-white text-base flex items-center gap-2">Akıllı Asistan</h2>
                <p className="mt-1 text-[10px] text-blue-100 uppercase tracking-widest">
                  {activeFirm ? `HAFIZA: ${activeFirm.name.substring(0, 20)}` : 'Genel Mod Aktif'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 group relative">
               {availableVoices.length > 0 && (
                 <select 
                   value={selectedVoice} 
                   onChange={(e) => setSelectedVoice(e.target.value)}
                   className="text-[10px] bg-blue-700/50 text-blue-50 border-none outline-none rounded px-1 py-1 h-8 max-w-[120px] truncate cursor-pointer hover:bg-blue-700/80 transition-colors"
                   title="Ses Seçimi (Sisteminizde Yüklü Olan Sesler)"
                 >
                   {availableVoices.map(v => (
                     <option key={v.name} value={v.name} className="bg-white text-slate-800">
                       {v.lang.startsWith('tr') ? '🇹🇷 ' : v.lang.startsWith('en') ? '🇺🇸 ' : '🌐 '}
                       {v.name.replace(/Microsoft |Google |Online |Desktop /ig, '').trim()}
                     </option>
                   ))}
                  </select>
               )}
               {availableVoices.filter(v => v.lang.startsWith('tr')).length <= 1 && (
                 <div className="absolute bottom-full mb-1 right-0 hidden group-hover:block w-[260px] bg-slate-800 text-slate-100 text-[10px] p-2.5 rounded shadow-xl z-50 border border-slate-600 leading-relaxed">
                   <div className="font-bold text-amber-400 border-b border-slate-600 pb-1 mb-1">⚠️ Neden sadece Erkek Sesi (Tolga) var?</div>
                   Web tarayıcıları sadece Windows/Mac bilgisayarınızda halihazırda <b>yüklü olan</b> sesleri kullanabilir. Kodla dışarıdan ses indirilemez.<br/><br/>
                   Şu an bilgisayarınızda sadece "Tolga" yüklü görünüyor. <b>Profesyonel Kadın Sesi (Emel/Yelda)</b> eklemek için:<br/>
                   <ul className="list-disc pl-4 mt-1 text-slate-300">
                     <li>Windows Ayarları &gt; Zaman ve Dil &gt; Konuşma menüsüne gidin.</li>
                     <li>"Sesleri Yönet" bölümünden <b>Türkçe (Emel)</b> paketini indirin.</li>
                     <li>Ya da <b>Google Chrome</b> tarayıcısı kullanırsanız "Google Türkçe" kadın sesi otomatik gelecektir.</li>
                   </ul>
                 </div>
               )}
               
               <Button 
                 variant="ghost" 
                 size="icon" 
                 className={`h-8 w-8 transition-colors ${isAutoSpeakEnabled ? 'text-blue-100 bg-white/10' : 'text-blue-100/40'}`} 
                 onClick={() => {
                   setIsAutoSpeakEnabled(!isAutoSpeakEnabled);
                   if (speakState.messageId) {
                     stopSpeaking();
                   }
                  }} 
                 title={isAutoSpeakEnabled ? "Otomatik Sesli Yanıt Açık" : "Otomatik Sesli Yanıt Kapalı"}
               >
                  <Volume2 className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:bg-blue-500/50 hover:text-white" onClick={clearHistory} title="Geçmişi Temizle">
                  <Trash2 className="w-4 h-4" />
               </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:bg-blue-500/50 hover:text-white" onClick={() => setIsReadingMode(!isReadingMode)} title="Okuma Modu">
                {isReadingMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              {!isReadingMode && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:bg-blue-500/50 hover:text-white" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Info Banner if firm selected */}
        {activeFirm && (
          <div className="bg-amber-50 border-b border-amber-100 shrink-0">
            <div className={`px-4 py-2 flex items-center gap-2 ${isReadingMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
               <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
               <p className="text-xs text-amber-800 font-medium truncate">
                  <span className="font-bold">{activeFirm.name}</span> hafızası aktif. Denetim modunda yanıt verilecek.
               </p>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4 bg-slate-50/50">
          <div className={`space-y-6 pb-4 ${isReadingMode ? 'max-w-4xl mx-auto' : ''}`}>
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col gap-1 w-full ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Role label */}
                <span className={`text-[10px] font-bold uppercase mb-1 ${m.role === 'user' ? 'text-slate-400' : 'text-blue-600'}`}>
                   {m.role === 'user' ? 'Siz' : 'Asistan'}
                </span>
                <div className={`p-3 text-sm leading-relaxed max-w-[85%] ${
                  m.role === 'user' 
                    ? 'bg-slate-100 text-slate-800 rounded-tl-xl rounded-b-xl' 
                    : 'bg-blue-50 text-slate-700 border border-blue-100 rounded-tr-xl rounded-b-xl'
                }`}>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <div className="markdown-body prose prose-slate prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  )}
                  {/* Action Bar for AI Response */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-1 mt-2 opacity-60 hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(m.content)} title="Kopyala">
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => downloadPdf(m)} title="PDF İndir">
                        <Download className="w-3 h-3" />
                      </Button>
                      {speakState.messageId === m.id ? (
                        <div className="flex items-center gap-1 bg-slate-200/50 rounded p-0.5 ml-1">
                           <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-slate-300" onClick={prevSentence} title="Önceki Cümle" disabled={speakState.currentIndex === 0}>
                             <SkipBack className="w-3 h-3 text-slate-700" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-slate-300" onClick={() => handleSpeak(m.content, m.id)} title={speakState.isPaused ? "Devam Et" : "Duraklat"}>
                             {speakState.isPaused ? <Play className="w-3 h-3 text-blue-600" /> : <Pause className="w-3 h-3 text-blue-600" />}
                           </Button>
                           <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-slate-300" onClick={nextSentence} title="Sonraki Cümle" disabled={speakState.currentIndex >= speakState.sentences.length - 1}>
                             <SkipForward className="w-3 h-3 text-slate-700" />
                           </Button>
                           <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-red-200 hover:text-red-700" onClick={stopSpeaking} title="Durdur">
                             <StopCircle className="w-3 h-3 text-slate-500" />
                           </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={() => handleSpeak(m.content, m.id, true)} title="Sesli Oku">
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isLoading && (
               <div className="flex gap-3">
                  <Avatar className="w-8 h-8 shrink-0 bg-blue-600">
                    <AvatarFallback className="bg-transparent text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm p-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  </div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <div className={`${isReadingMode ? 'max-w-4xl mx-auto' : ''}`}>
            <div className="flex items-center flex-wrap gap-2 mb-3">
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("Bu dosyayı üçlü denetim filtresinden geçir.")}>🛡️ Üçlü Denetim Uygula</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("Kasa hesaplarındaki fazlalıkları ve adatlandırma risklerini analiz et.")}>💰 Kasa Fazlası Analizi</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("Yeni Beyanname hazırlamak için mizan ve fatura listelerimi analiz et.")}>📋 Beyanname Hazırla</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("Mizan verilerimi analiz et ve geçici vergi tahmini yap.")}>📊 Mizan Analizi & Tahmin</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("Bilanço ve gelir tablosu verilerime göre finansal risk analizi yap.")}>📉 Finansal Risk Analizi</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("İzaha davet yazısına istinaden 4 gözle risk haritası çıkar ve eksik belgeleri yorumla.")}>📄 İzaha Davet İncelemesi</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("KDV indirimi riskli ve sahte belge emareleri olabilecek yüksek tutarlı alımları raporla.")}>🚨 Sahte Belge Araması</button>
               <button className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full hover:bg-blue-50 text-slate-600 font-medium whitespace-nowrap" onClick={() => setInput("Yüklediğim 100 faturayı analiz et, TDHP hesap kodlarını ata ve Excel formatına hazırla.")}>🧾 Fatura & Hesap Kodu Eşleme</button>
            </div>
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Vergi, beyanname, KDV veya risk analizi sorunuzu yazın..."
                className="w-full min-h-[44px] max-h-[120px] rounded-lg border border-slate-300 bg-white p-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none resize-none"
                rows={1}
              />
              <Button 
                size="icon" 
                variant="ghost"
                className={`absolute right-10 bottom-1.5 h-8 w-8 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 ${isListening ? 'text-red-500 bg-red-50 hover:text-red-600 hover:bg-red-100' : ''}`}
                onClick={toggleListening}
                title="Sesle Komut Ver"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
              <Button size="icon" className="absolute right-1.5 bottom-1.5 h-8 w-8 rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center justify-center p-0" disabled={(!input.trim() && !isListening) || isLoading} onClick={handleSend}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="text-center mt-2 pb-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">Akıllı Asistan hata yapabilir. Kararlarınızı YMM veya kanun metni ile doğrulayın.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
