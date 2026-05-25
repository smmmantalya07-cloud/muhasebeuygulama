import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Search, Filter, Download, Activity, Clock, User, FileText, Database, Shield } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  target: string;
  status: 'Başarılı' | 'Reddedildi' | 'Beklemede';
  ip: string;
  module: string;
}

const MOCK_LOGS: AuditLog[] = [
  { id: "LOG-992", action: "Kanıt Merkezi Analizi Başlatıldı", user: "Orhan Polat (SMMM)", timestamp: "2026-05-01 10:15:22", target: "Gama Medikal - Yurt Dışı Fatura", status: "Başarılı", ip: "192.168.1.10", module: "Kanıt Merkezi" },
  { id: "LOG-991", action: "İzaha Davet Analiz Raporu İndirildi", user: "Sistem Asistanı", timestamp: "2026-05-01 09:44:10", target: "Zeta Makine - İZAH-2026-04", status: "Başarılı", ip: "İç Sistem", module: "İzaha Davet" },
  { id: "LOG-990", action: "KDV Hesaplaması Değiştirildi", user: "Merve Y. (Uzman)", timestamp: "2026-05-01 09:12:05", target: "ABC İnşaat KDV1", status: "Beklemede", ip: "192.168.1.15", module: "KDV Kontrol" },
  { id: "LOG-989", action: "Kasa Bakiyesi Manuel Düzeltme Denemesi", user: "Ali K. (Stajyer)", timestamp: "2026-04-30 16:45:11", target: "Zeta Makine 100 Kasa", status: "Reddedildi", ip: "192.168.1.42", module: "Kasa Risk Analizi" },
  { id: "LOG-988", action: "Mükellefe Belge Talebi Gönderildi", user: "Orhan Polat (SMMM)", timestamp: "2026-04-30 14:20:00", target: "ABC İnşaat Hakediş Raporları", status: "Başarılı", ip: "192.168.1.10", module: "İletişim" },
];

export function AuditLogPage() {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Başarılı': return 'text-emerald-600 bg-emerald-50';
      case 'Reddedildi': return 'text-red-600 bg-red-50';
      case 'Beklemede': return 'text-amber-600 bg-amber-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
             <Activity className="w-6 h-6 text-blue-600" />
             Audit Log / İşlem Geçmişi
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem üzerinde yapılan tüm işlemlerin, yapay zeka kararlarının ve kullanıcı hareketlerinin değiştirilemez kaydı.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="shadow-sm bg-white" onClick={() => toast.info('Log filtreleme paneli açılıyor.')}>
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
           </Button>
           <Button variant="default" className="bg-slate-900 text-white shadow-sm hover:bg-slate-800" onClick={() => toast.success('İşlem geçmişi CSV olarak indiriliyor.')}>
              <Download className="w-4 h-4 mr-2" />
              Dışa Aktar
           </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4">
           <div className="flex flex-col sm:flex-row justify-between gap-4">
             <div className="relative w-full sm:max-w-md">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <Input placeholder="İşlem ID, kullanıcı veya modül ara..." className="pl-9 bg-slate-50 border-slate-200" />
             </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">İşlem Kimliği / Zaman</th>
                  <th className="px-6 py-3">Kullanıcı / IP</th>
                  <th className="px-6 py-3">Aksiyon / Modül</th>
                  <th className="px-6 py-3">Hedef Veri</th>
                  <th className="px-6 py-3 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-slate-400">{log.id}</span>
                        <span className="font-medium flex items-center gap-1.5 text-slate-700">
                           <Clock className="w-3 h-3 text-slate-400" />
                           {log.timestamp}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium flex items-center gap-1.5 text-slate-700">
                           <User className="w-3 h-3 text-slate-400" />
                           {log.user}
                        </span>
                        <span className="text-xs text-slate-500">{log.ip}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-900">{log.action}</span>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                           {log.module}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-slate-600 flex items-center gap-1.5">
                         <Database className="w-3 h-3 text-slate-400" />
                         {log.target}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                         {log.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Sistem Güvenlik Notu */}
      <div className="bg-slate-100 rounded-lg p-4 flex items-start gap-4 border border-slate-200">
         <Shield className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
         <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-1">Değiştirilemez Kayıt Zinciri (WORM)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bu ekrandaki tüm loglar KVKK ve bilgi güvenliği standartları gereği yalnızca okunabilir formatta tutulmaktadır. 
              Mali Müşavir, YMM veya sistem yöneticisi dahil hiçbir kullanıcı geçmiş işlem kayıtlarını silemez veya değiştiremez.
            </p>
         </div>
      </div>
    </div>
  );
}
