// components/AthleteGoals.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/store';

export interface Goal {
  id: string;
  athlete_id: string;
  created_by?: string;
  title: string;
  category: string;
  current_value: number;
  target_value: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed';
}

interface AthleteGoalsProps {
  athleteId: string;
  athleteName: string;
  userRole: 'ATHLETE' | 'COACH';
}

export default function AthleteGoals({ athleteId, athleteName, userRole }: AthleteGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('exercise_weight');
  const [newCurrent, setNewCurrent] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newDeadline, setNewDeadline] = useState('');

  const fetchGoals = async () => {
    if (!supabase || !athleteId) return;
    try {
      const { data } = await supabase
        .from('athlete_goals')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false });
      if (data) setGoals(data);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [athleteId]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    const newGoal: Goal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal-${Date.now()}`,
      athlete_id: athleteId,
      title: newTitle.trim(),
      category: newCategory,
      current_value: parseFloat(newCurrent) || 0,
      target_value: parseFloat(newTarget),
      unit: newUnit,
      deadline: newDeadline || undefined,
      status: 'active'
    };

    setGoals(prev => [newGoal, ...prev]);
    setShowAddForm(false);
    setNewTitle('');
    setNewCurrent('');
    setNewTarget('');

    if (supabase) {
      await supabase.from('athlete_goals').insert([newGoal]);
    }
  };

  const handleToggleStatus = async (goal: Goal) => {
    const updatedStatus = goal.status === 'active' ? 'completed' : 'active';
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status: updatedStatus } : g));
    if (supabase) {
      await supabase.from('athlete_goals').update({ status: updatedStatus }).eq('id', goal.id);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Vuoi eliminare questo obiettivo?')) return;
    setGoals(prev => prev.filter(g => g.id !== id));
    if (supabase) {
      await supabase.from('athlete_goals').delete().eq('id', id);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-5">
      <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#E50914]" /> Obiettivi {userRole === 'COACH' ? `(${athleteName})` : ''}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Traguardi di forza, peso e frequenza con monitoraggio avanzamento.</p>
        </div>

        {userRole === 'COACH' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-[#E50914] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-red-700 transition"
          >
            <Plus className="w-4 h-4" /> Assegna Obiettivo
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddGoal} className="p-4 bg-zinc-900 rounded-xl border border-zinc-700 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Titolo Obiettivo (es. Panca Piana 110kg)</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white outline-none focus:border-[#E50914]"
                placeholder="Nome obiettivo"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Categoria</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="exercise_weight">Carico Esercizio</option>
                <option value="body_weight">Peso Corporeo</option>
                <option value="weekly_workouts">Frequenza Settimanale</option>
                <option value="custom">Altro Obiettivo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Valore Attuale</label>
              <input
                type="number"
                step="0.5"
                value={newCurrent}
                onChange={e => setNewCurrent(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Valore Target</label>
              <input
                type="number"
                step="0.5"
                required
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                placeholder="110"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 mb-1">Unità</label>
              <input
                type="text"
                value={newUnit}
                onChange={e => setNewUnit(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                placeholder="kg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-500"
            >
              Salva Obiettivo
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <p className="text-xs text-zinc-400 text-center py-6">Nessun obiettivo attivo al momento.</p>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.min(100, Math.max(0, Math.round((g.current_value / g.target_value) * 100)));
            const isDone = g.status === 'completed' || pct >= 100;

            return (
              <div
                key={g.id}
                className={`p-4 rounded-xl border transition ${
                  isDone ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      {g.title}
                      {isDone && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Attuale: <b className="text-white">{g.current_value} {g.unit}</b> · Obiettivo: <b className="text-white">{g.target_value} {g.unit}</b>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-black ${isDone ? 'text-emerald-400' : 'text-[#E50914]'}`}>
                      {pct}%
                    </span>
                    {userRole === 'COACH' && (
                      <button
                        onClick={() => handleDeleteGoal(g.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded"
                        title="Elimina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-[#E50914]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}