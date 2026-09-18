// components/NotificationBell.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Dumbbell, X } from 'lucide-react';
import { supabase } from '../lib/store';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  userId?: string;
  onNavigateToWorkout?: () => void;
}

export default function NotificationBell({ userId, onNavigateToWorkout }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!supabase || !userId) return;
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setNotifications(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  // Chiudi dropdown al click fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (supabase) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (supabase && userId) {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
    }
  };

  const handleNotificationClick = async (notif: InAppNotification) => {
    await markAsRead(notif.id);
    if (notif.type === 'program_assigned' && onNavigateToWorkout) {
      setIsOpen(false);
      onNavigateToWorkout();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
        title="Notifiche"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1E1E1E] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/60">
            <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#E50914]" /> Notifiche TopGym
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-[#E50914] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Segna tutte come lette
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/60">
            {notifications.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">Nessuna notifica presente</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 transition cursor-pointer flex items-start gap-2.5 ${
                    n.read ? 'bg-[#1E1E1E] opacity-75 hover:opacity-100' : 'bg-zinc-900/80 hover:bg-zinc-900'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/80 text-[#E50914] mt-0.5 flex-shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs ${!n.read ? 'font-black text-white' : 'font-bold text-zinc-300'}`}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#E50914] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[9px] font-mono text-zinc-500 mt-1 block">
                      {new Date(n.created_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}