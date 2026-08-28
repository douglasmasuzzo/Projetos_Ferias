import { supabase } from './supabaseClient'

// ---------- Tipos de atividade ----------

export async function fetchActivityTypes() {
  const { data, error } = await supabase
    .from('activity_types')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createActivityType(label, color) {
  const { data, error } = await supabase
    .from('activity_types')
    .insert({ label, color })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteActivityType(id) {
  const { error } = await supabase.from('activity_types').delete().eq('id', id)
  if (error) throw error
}

// ---------- Grade semanal ----------

export async function fetchScheduleSlots() {
  const { data, error } = await supabase.from('schedule_slots').select('*')
  if (error) throw error
  return data
}

export async function upsertScheduleSlot(day, timeSlot, activityTypeId) {
  const { data, error } = await supabase
    .from('schedule_slots')
    .upsert(
      { day, time_slot: timeSlot, activity_type_id: activityTypeId, updated_at: new Date().toISOString() },
      { onConflict: 'day,time_slot' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

// ---------- Prioridades ----------

export async function fetchPriorities() {
  const { data, error } = await supabase
    .from('priorities')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createPriority(text, priorityLevel) {
  const { data, error } = await supabase
    .from('priorities')
    .insert({ text, priority_level: priorityLevel, done: false })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePriority(id, changes) {
  const { data, error } = await supabase
    .from('priorities')
    .update(changes)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePriority(id) {
  const { error } = await supabase.from('priorities').delete().eq('id', id)
  if (error) throw error
}
