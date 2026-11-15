import { getSupabase } from '@/lib/supabase';

export type CustomTemplateCategory = 'MALE' | 'FEMALE' | 'POSTURAL';

export interface CustomProgramTemplate {
  id: string;
  code: string;
  title: string;
  description: string;
  category: CustomTemplateCategory;
  daysCount: number;
  primaryEngine: string;
  days: any[];
  createdAt?: string;
  isCustom: true;
}

const LOCAL_FALLBACK_KEY = 'topgym_custom_templates_backup';

export function cloneTemplateDaysWithFreshIds(rawDays: any[]): any[] {
  if (!Array.isArray(rawDays)) return [];
  const cloned = JSON.parse(JSON.stringify(rawDays));
  const idMap: Record<string, string> = {};
  const seed = Date.now();

  cloned.forEach((day: any, dIdx: number) => {
    if (Array.isArray(day.exercises)) {
      day.exercises.forEach((ex: any, eIdx: number) => {
        const oldId = ex.id;
        const newId = `ex_${seed}_${dIdx}_${eIdx}`;
        if (oldId) idMap[oldId] = newId;
        ex.id = newId;
      });
    }
  });

  cloned.forEach((day: any) => {
    if (day.weekOverrides && typeof day.weekOverrides === 'object') {
      const remappedOverrides: Record<number, Record<string, any>> = {};
      Object.keys(day.weekOverrides).forEach((wKey) => {
        const wNum = Number(wKey);
        const weekObj = day.weekOverrides[wKey] || {};
        remappedOverrides[wNum] = {};
        Object.keys(weekObj).forEach((oldExId) => {
          const targetExId = idMap[oldExId] || oldExId;
          remappedOverrides[wNum][targetExId] = { ...weekObj[oldExId] };
        });
      });
      day.weekOverrides = remappedOverrides;
    }
  });

  return cloned;
}

export function buildTemplateDaysSnapshot(
  days: any[],
  clearAthleteWeights: boolean = true
): any[] {
  if (!Array.isArray(days)) return [];
  const snapshot = JSON.parse(JSON.stringify(days));

  snapshot.forEach((day: any) => {
    if (Array.isArray(day.exercises)) {
      day.exercises.forEach((ex: any) => {
        if (clearAthleteWeights) {
          ex.weight = '';
          ex.targetWeight = '';
        }
      });
    }

    if (day.weekOverrides && typeof day.weekOverrides === 'object') {
      Object.keys(day.weekOverrides).forEach((wKey) => {
        const weekMap = day.weekOverrides[wKey];
        if (weekMap && typeof weekMap === 'object') {
          Object.keys(weekMap).forEach((exId) => {
            if (clearAthleteWeights && weekMap[exId]) {
              weekMap[exId].weight = '';
              weekMap[exId].targetWeight = '';
            }
          });
        }
      });
    }
  });

  return snapshot;
}

export async function saveCustomTemplateToSupabase(params: {
  title: string;
  description?: string;
  category: CustomTemplateCategory;
  primaryEngine: string;
  days: any[];
}): Promise<{ success: boolean; template?: CustomProgramTemplate; warning?: string }> {
  const cleanTitle = params.title.trim();
  if (!cleanTitle) {
    return { success: false, warning: 'Inserisci un nome valido per il template.' };
  }

  const code = `PERS-${String(Math.floor(100 + Math.random() * 900))}`;
  const daysCount = Array.isArray(params.days) && params.days.length > 0 ? params.days.length : 3;

  const newTemplate: CustomProgramTemplate = {
    id: `local_${Date.now()}`,
    code,
    title: cleanTitle,
    description: (params.description || '').trim() || `Template personalizzato (${daysCount} giorni) con progressione W1–W16.`,
    category: params.category || 'MALE',
    daysCount,
    primaryEngine: params.primaryEngine || 'TOPGYM',
    days: params.days,
    createdAt: new Date().toISOString(),
    isCustom: true,
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
      const list: CustomProgramTemplate[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify([newTemplate, ...list]));
    } catch {}
  }

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('custom_program_templates')
        .insert([
          {
            code: newTemplate.code,
            title: newTemplate.title,
            description: newTemplate.description,
            category: newTemplate.category,
            days_count: newTemplate.daysCount,
            primary_engine: newTemplate.primaryEngine,
            days: newTemplate.days,
          },
        ])
        .select()
        .single();

      if (error) {
        return {
          success: true,
          template: newTemplate,
          warning: 'Salvato in memoria locale. Esegui la query SQL su Supabase per abilitare la sincronizzazione cloud.',
        };
      }

      if (data) {
        newTemplate.id = data.id;
        newTemplate.createdAt = data.created_at;
      }
    }
  } catch (err) {
    console.warn('Eccezione salvataggio template su Supabase:', err);
  }

  return { success: true, template: newTemplate };
}

export async function fetchCustomTemplatesFromSupabase(): Promise<CustomProgramTemplate[]> {
  let localTemplates: CustomProgramTemplate[] = [];
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
      if (raw) localTemplates = JSON.parse(raw);
    } catch {}
  }

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('custom_program_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped: CustomProgramTemplate[] = data.map((row: any) => ({
          id: row.id,
          code: row.code || 'PERS',
          title: row.title,
          description: row.description || '',
          category: (row.category as CustomTemplateCategory) || 'MALE',
          daysCount: Number(row.days_count) || (Array.isArray(row.days) ? row.days.length : 3),
          primaryEngine: row.primary_engine || 'TOPGYM',
          days: Array.isArray(row.days) ? row.days : [],
          createdAt: row.created_at,
          isCustom: true,
        }));

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(mapped));
          } catch {}
        }
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Errore lettura template personalizzati da Supabase:', err);
  }

  return localTemplates;
}

export async function deleteCustomTemplateFromSupabase(templateId: string): Promise<boolean> {
  if (!templateId) return false;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
      if (raw) {
        const list: CustomProgramTemplate[] = JSON.parse(raw);
        localStorage.setItem(
          LOCAL_FALLBACK_KEY,
          JSON.stringify(list.filter((t) => t.id !== templateId))
        );
      }
    } catch {}
  }

  try {
    const supabase = getSupabase();
    if (supabase && !templateId.startsWith('local_')) {
      await supabase.from('custom_program_templates').delete().eq('id', templateId);
    }
    return true;
  } catch {
    return false;
  }
}