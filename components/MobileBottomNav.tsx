// components/MobileBottomNav.tsx
'use client';

import React, { useState } from 'react';
import { 
  Dumbbell, Gauge, TrendingUp, MoreHorizontal, Trophy, 
  Target, Medal, Settings, Users, UserCheck, X, ChevronRight, Lock
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userRole: 'ATHLETE' | 'COACH';
  onOpenCoachPin?: () => void;
}

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  userRole,
  onOpenCoachPin
}: MobileBottomNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  // Se l'atleta ha selezionato una voce dentro "Altro", evidenziamo il tasto Altro
  const isMoreActive = ['records', 'goals', 'leaderboard', 'settings'].includes(activeTab);

  return (
    <>
      {/* 1. BOTTOM BAR FISSA IN BASSO (VISIBILE SOLO SU SMARTPHONE / TABLET PICCOLI) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#12151B]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around">
          
          {/* VISTA ATLETA */}
          {userRole === 'ATHLETE' && (
            <>
              <button
                type="button"
                onClick={() => handleSelectTab('workout')}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'workout' ? 'text-[#E50914]' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Dumbbell className={`w-5 h-5 ${activeTab === 'workout' ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Workout</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('readiness')}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'readiness' ? 'text-green-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Gauge className={`w-5 h-5 ${activeTab === 'readiness' ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Readiness</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('analytics')}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'analytics' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <TrendingUp className={`w-5 h-5 ${activeTab === 'analytics' ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Progressi</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMoreOpen(true)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isMoreActive ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MoreHorizontal className={`w-5 h-5 ${isMoreActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Altro</span>
              </button>
            </>
          )}

          {/* VISTA COACH */}
          {userRole === 'COACH' && (
            <>
              <button
                type="button"
                onClick={() => handleSelectTab('coachDashboard')}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'coachDashboard' ? 'text-indigo-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Atleti</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('builder')}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'builder' ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Scheda</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('analytics')}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  activeTab === 'analytics' ? 'text-blue-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Volume</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMoreOpen(true)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isMoreActive ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MoreHorizontal className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1 tracking-tight">Extra</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* 2. CASSETTO "ALTRO" MODALE (SLIDE-UP DAL BASSO) */}
      {isMoreOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setIsMoreOpen(false)}
        >
          <div 
            className="bg-[#12151B] border-t border-white/10 rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <MoreHorizontal className="text-[#E50914] w-4 h-4" /> Menu & Funzioni
              </h3>
              <button 
                type="button" 
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleSelectTab('records')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  activeTab === 'records' ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-900/60 border-white/5 text-zinc-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-yellow-400" /> Record Personali (PR)
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('goals')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  activeTab === 'goals' ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-900/60 border-white/5 text-zinc-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-[#E50914]" /> Obiettivi Atleta
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('leaderboard')}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  activeTab === 'leaderboard' ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-900/60 border-white/5 text-zinc-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Medal className="w-4 h-4 text-yellow-500" /> Classifica & Badge
                </span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {userRole === 'ATHLETE' && (
                <button
                  type="button"
                  onClick={() => handleSelectTab('settings')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                    activeTab === 'settings' ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-900/60 border-white/5 text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-zinc-400" /> Profilo & Impostazioni
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-xs font-bold text-zinc-300 text-center"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}