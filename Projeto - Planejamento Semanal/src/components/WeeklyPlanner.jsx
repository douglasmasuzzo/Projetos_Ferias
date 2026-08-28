import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../constants'
import * as api from '../api'
import ScheduleGrid from './ScheduleGrid.jsx'
import ActivityTypeManager from './ActivityTypeManager.jsx'
import PriorityList from './PriorityList.jsx'

const SUPABASE_CONFIGURED = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function WeeklyPlanner() {
  // Cache local: usado como valor inicial (resposta instantânea) e como
  // fallback caso a conexão com o Supabase falhe.
  const [scheduleCache, setScheduleCache] = useLocalStorage(STORAGE_KEYS.schedule, {})
  const [activityTypesCache, setActivityTypesCache] = useLocalStorage(STORAGE_KEYS.activityTypes, [])
  const [prioritiesCache, setPrioritiesCache] = useLocalStorage(STORAGE_KEYS.priorities, [])

  const [schedule, setSchedule] = useState(scheduleCache)
  const [activityTypes, setActivityTypes] = useState(activityTypesCache)
  const [priorities, setPriorities] = useState(prioritiesCache)

  const [syncStatus, setSyncStatus] = useState(
    SUPABASE_CONFIGURED ? 'loading' : 'offline'
  )

  // Evita que uma resposta lenta do servidor sobrescreva edições locais feitas
  // enquanto a carga inicial ainda estava em andamento.
  const didMutateRef = useRef(false)

  // Mantém o cache local sempre espelhado ao estado atual em tela.
  useEffect(() => setScheduleCache(schedule), [schedule, setScheduleCache])
  useEffect(() => setActivityTypesCache(activityTypes), [activityTypes, setActivityTypesCache])
  useEffect(() => setPrioritiesCache(priorities), [priorities, setPrioritiesCache])

  const markMutated = useCallback(() => {
    didMutateRef.current = true
  }, [])

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return
    let cancelled = false
    ;(async () => {
      try {
        const [types, slots, tasks] = await Promise.all([
          api.fetchActivityTypes(),
          api.fetchScheduleSlots(),
          api.fetchPriorities(),
        ])
        if (cancelled || didMutateRef.current) return
        setActivityTypes(types)
        const scheduleMap = {}
        slots.forEach((slot) => {
          if (slot.activity_type_id) {
            scheduleMap[`${slot.day}_${slot.time_slot}`] = slot.activity_type_id
          }
        })
        setSchedule(scheduleMap)
        setPriorities(tasks)
        setSyncStatus('synced')
      } catch (error) {
        console.error('Falha ao sincronizar com o Supabase, usando cache local.', error)
        if (!cancelled && !didMutateRef.current) {
          setActivityTypes(activityTypesCache)
          setSchedule(scheduleCache)
          setPriorities(prioritiesCache)
        }
        setSyncStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activityTypesCache, scheduleCache, prioritiesCache])

  // ---------- Tipos de atividade ----------

  async function handleCreateActivityType(label, color) {
    markMutated()
    const optimistic = { id: `temp-${Date.now()}`, label, color }
    setActivityTypes((prev) => [...prev, optimistic])
    if (!SUPABASE_CONFIGURED) return
    try {
      const created = await api.createActivityType(label, color)
      setActivityTypes((prev) =>
        prev.map((t) => (t.id === optimistic.id ? created : t))
      )
    } catch (error) {
      console.error('Erro ao criar tipo de atividade no Supabase.', error)
      setSyncStatus('error')
    }
  }

  async function handleDeleteActivityType(id) {
    markMutated()
    setActivityTypes((prev) => prev.filter((t) => t.id !== id))
    setSchedule((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((key) => {
        if (next[key] === id) delete next[key]
      })
      return next
    })
    if (!SUPABASE_CONFIGURED || id.startsWith('temp-')) return
    try {
      await api.deleteActivityType(id)
    } catch (error) {
      console.error('Erro ao remover tipo de atividade no Supabase.', error)
      setSyncStatus('error')
    }
  }

  // ---------- Grade semanal ----------

  async function handleChangeSlot(day, time, activityTypeId) {
    markMutated()
    setSchedule((prev) => {
      const next = { ...prev }
      const key = `${day}_${time}`
      if (activityTypeId) {
        next[key] = activityTypeId
      } else {
        delete next[key]
      }
      return next
    })
    if (!SUPABASE_CONFIGURED) return
    try {
      await api.upsertScheduleSlot(day, time, activityTypeId)
    } catch (error) {
      console.error('Erro ao salvar bloco da grade no Supabase.', error)
      setSyncStatus('error')
    }
  }

  // ---------- Prioridades ----------

  async function handleCreatePriority(text, priorityLevel) {
    markMutated()
    const optimistic = {
      id: `temp-${Date.now()}`,
      text,
      priority_level: priorityLevel,
      done: false,
    }
    setPriorities((prev) => [...prev, optimistic])
    if (!SUPABASE_CONFIGURED) return
    try {
      const created = await api.createPriority(text, priorityLevel)
      setPriorities((prev) =>
        prev.map((p) => (p.id === optimistic.id ? created : p))
      )
    } catch (error) {
      console.error('Erro ao criar prioridade no Supabase.', error)
      setSyncStatus('error')
    }
  }

  async function handleUpdatePriority(id, changes) {
    markMutated()
    setPriorities((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    )
    if (!SUPABASE_CONFIGURED || id.startsWith('temp-')) return
    try {
      await api.updatePriority(id, changes)
    } catch (error) {
      console.error('Erro ao atualizar prioridade no Supabase.', error)
      setSyncStatus('error')
    }
  }

  async function handleDeletePriority(id) {
    markMutated()
    setPriorities((prev) => prev.filter((p) => p.id !== id))
    if (!SUPABASE_CONFIGURED || id.startsWith('temp-')) return
    try {
      await api.deletePriority(id)
    } catch (error) {
      console.error('Erro ao remover prioridade no Supabase.', error)
      setSyncStatus('error')
    }
  }

  const statusMessage = {
    loading: 'Sincronizando com o Supabase...',
    synced: 'Sincronizado com o Supabase.',
    error: 'Não foi possível sincronizar agora — usando dados salvos neste navegador.',
    offline: 'Supabase não configurado — usando apenas este navegador (.env ausente).',
  }[syncStatus]

  return (
    <main className="planner">
      <header>
        <h1>Planejador Semanal</h1>
        <p className="subtitle">
          Trabalho/estágio, estudos e projetos pessoais em um só lugar
        </p>
      </header>

      <ActivityTypeManager
        activityTypes={activityTypes}
        onCreate={handleCreateActivityType}
        onDelete={handleDeleteActivityType}
      />

      <ScheduleGrid
        schedule={schedule}
        activityTypes={activityTypes}
        onChangeSlot={handleChangeSlot}
      />

      <PriorityList
        priorities={priorities}
        onCreate={handleCreatePriority}
        onUpdate={handleUpdatePriority}
        onDelete={handleDeletePriority}
      />

      <p className={`status status-${syncStatus}`}>{statusMessage}</p>
    </main>
  )
}
