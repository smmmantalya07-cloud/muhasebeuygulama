import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, FileText, AlertTriangle, CheckCircle2, Search, ArrowRight, Mail, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'kep',
    title: 'Yeni KEP İletisi',
    description: 'GİB tarafından yeni bir KEP iletisi alındı.',
    date: '10 Dk Önce',
    firm: 'ABC İnşaat Ltd. Şti.',
    isRead: false,
    priority: 'high',
    icon: Mail,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    id: '2',
    type: 'declaration',
    title: 'Beyanname Onay Bekliyor',
    description: 'Nisan 2026 KDV1 Beyannamesi onay için hazır.',
    date: '1 Saat Önce',
    firm: 'Gama Medikal Pazarlama A.Ş.',
    isRead: false,
    priority: 'medium',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: '3',
    type: 'risk',
    title: 'Yüksek Kasa Bakiyesi Uyarısı',
    description: 'Kasa hesabı günlük limiti aşıldı (450.000 TL). İzaha davet riski bulunuyor.',
    date: '3 Saat Önce',
    firm: 'ABC İnşaat Ltd. Şti.',
    isRead: true,
    priority: 'high',
    icon: AlertTriangle,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
  {
    id: '4',
    type: 'system',
    title: 'Sistem Güncellemesi',
    description: 'Yeni risk analizi modülü devreye alındı. Kanıt merkezi aktif edildi.',
    date: '1 Gün Önce',
    firm: 'Sistem',
    isRead: true,
    priority: 'low',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.firm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !n.isRead) ||
                         (filter === n.type);
                         
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            Bildirimler
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 font-bold">{unreadCount} Yeni</Badge>
            )}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Sistem, mükellef ve mevzuat uyarılarını takip edin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={markAllAsRead} className="h-10 font-bold uppercase tracking-widest text-xs">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Tümünü Okundu İşaretle
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Bildirim, Mükellef veya Konu Ara..." 
            className="pl-9 h-11 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')}
            className={`h-11 font-bold text-xs ${filter === 'all' ? 'bg-indigo-600 text-white' : ''}`}
          >
            Tümü
          </Button>
          <Button 
            variant={filter === 'unread' ? 'default' : 'outline'} 
            onClick={() => setFilter('unread')}
            className={`h-11 font-bold text-xs ${filter === 'unread' ? 'bg-indigo-600 text-white' : ''}`}
          >
            Okunmayanlar
          </Button>
          <Button 
            variant={filter === 'kep' ? 'default' : 'outline'} 
            onClick={() => setFilter('kep')}
            className={`h-11 font-bold text-xs ${filter === 'kep' ? 'bg-indigo-600 text-white' : ''}`}
          >
            KEP / Tebligat
          </Button>
          <Button 
            variant={filter === 'risk' ? 'default' : 'outline'} 
            onClick={() => setFilter('risk')}
            className={`h-11 font-bold text-xs ${filter === 'risk' ? 'bg-indigo-600 text-white' : ''}`}
          >
            Risk & Uyarılar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card key={notification.id} className={`transition-all ${notification.isRead ? 'opacity-70 bg-slate-50 border-slate-200' : 'bg-white border-indigo-200 shadow-sm'}`}>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notification.bgColor}`}>
                    <Icon className={`w-5 h-5 ${notification.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{notification.firm}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{notification.date}</span>
                    </div>
                    <h3 className={`text-base font-bold text-slate-900 mb-1 ${!notification.isRead ? 'font-black' : ''}`}>{notification.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{notification.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end mt-4 sm:mt-0 shrink-0">
                    {!notification.isRead && (
                      <Button variant="ghost" size="icon" onClick={() => markAsRead(notification.id)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" title="Okundu İşaretle">
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="outline" className="h-9 text-xs font-bold uppercase tracking-widest">
                      Detay <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bildirim Bulunmuyor</h3>
            <p className="text-slate-500">Seçili filtrelere uygun bildirim bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
