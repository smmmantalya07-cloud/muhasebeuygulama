import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Upload, Play, ShieldAlert, FileDown, 
  FileSpreadsheet, FileEdit, MoreVertical 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionBarProps {
  onUpload?: () => void;
  onAnalyze?: () => void;
  onShowRisks?: () => void;
  onDownloadPdf?: () => void;
  onDownloadExcel?: () => void;
  onDownloadWord?: () => void;
  className?: string;
  isProcessing?: boolean;
}

export function ActionBar({
  onUpload,
  onAnalyze,
  onShowRisks,
  onDownloadPdf,
  onDownloadExcel,
  onDownloadWord,
  className,
  isProcessing = false
}: ActionBarProps) {
  return (
    <div className={cn(
      "sticky bottom-4 left-0 right-0 z-40 mx-auto w-fit max-w-[95%] sm:max-w-none px-4 py-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar",
      className
    )}>
      <div className="flex items-center gap-1.5 border-r border-slate-100 pr-2 md:pr-4 shrink-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onUpload}
          className="h-9 border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-200 font-bold text-[10px] uppercase tracking-wider"
        >
          <Upload className="w-3.5 h-3.5 mr-1.5" /> VERİ YÜKLE
        </Button>
        <Button 
          disabled={isProcessing}
          onClick={onAnalyze}
          className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider shadow-md shadow-indigo-100"
        >
          {isProcessing ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ANALİZ EDİLİYOR...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-current" /> ANALİZ ET
            </span>
          )}
        </Button>
      </div>

      <div className="flex items-center gap-1.5 border-r border-slate-100 pr-2 md:pr-4 shrink-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onShowRisks}
          className="h-9 text-rose-600 hover:bg-rose-50 font-bold text-[10px] uppercase tracking-wider"
        >
          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> RİSKLERİ GÖSTER
        </Button>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600" onClick={onDownloadPdf}>
          <FileDown className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600" onClick={onDownloadExcel}>
          <FileSpreadsheet className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600" onClick={onDownloadWord}>
          <FileEdit className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-slate-200 mx-1"></div>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
