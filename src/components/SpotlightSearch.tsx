import React, { useState } from 'react';
import { Search, FileText, Building, Calculator, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function SpotlightSearch({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden shadow-2xl bg-slate-50 border border-slate-200">
         <DialogHeader className="sr-only">
           <DialogTitle>Arama</DialogTitle>
         </DialogHeader>
         <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-white">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input 
              className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 text-lg"
              placeholder="Firma ünvanı, vergi no, belge, veya kanun maddesi ara..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <div className="flex items-center gap-1.5 ml-3">
               <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded bg-slate-100 border border-slate-200 px-2 font-mono text-[10px] font-medium text-slate-600">
                  ESC
               </kbd>
            </div>
         </div>
         
         <div className="max-h-[300px] overflow-y-auto p-2">
            {!query ? (
               <div className="py-8 text-center text-slate-500 text-sm">
                 Aramaya başlamak için yazın...
               </div>
            ) : (
               <div className="space-y-4 p-2">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2 tracking-wider">Arama Sonuçları</h4>
                    <div className="space-y-1">
                       <ResultItem 
                         icon={<Building />} 
                         title={`Firma: ${query}`} 
                         desc="Firma araması" 
                         onClick={() => {
                           toast.success(`${query} firmasına gidiliyor...`);
                           onClose();
                         }}
                       />
                       <ResultItem 
                         icon={<FileText />} 
                         title={`Belge: ${query} analiz dosyası`} 
                         desc="İzaha Davet / Analiz" 
                         onClick={() => {
                           toast.success(`${query} analizi açılıyor...`);
                           onClose();
                         }}
                       />
                    </div>
                  </div>
               </div>
            )}
         </div>
         <div className="border-t border-slate-200 bg-slate-100/50 flex items-center px-4 py-3 text-xs text-slate-500">
            <span className="flex items-center">
               Gezinmek için <CornerDownLeft className="w-3 h-3 mx-1 inline-block" /> enter tuşunu kullanın.
            </span>
         </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultItem({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-600 hover:text-white group rounded-lg cursor-pointer transition-colors bg-white border border-slate-200 shadow-sm text-slate-900"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
         <div className="text-slate-500 group-hover:text-blue-100 flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' } as any)}
         </div>
         <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-[10px] text-slate-500 group-hover:text-blue-200">{desc}</span>
         </div>
      </div>
      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-200" />
    </div>
  )
}
