export const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
export const TIMES = ["Manhã", "Tarde", "Noite"]

export const PRIORITY_LEVELS = [
  { value: "baixa", label: "Baixa", weight: 1, color: "#b8ad8f" },
  { value: "media", label: "Média", weight: 2, color: "#d8923f" },
  { value: "alta", label: "Alta", weight: 3, color: "#c8433f" },
]

export function getPriorityMeta(level) {
  return PRIORITY_LEVELS.find((p) => p.value === level) || PRIORITY_LEVELS[1]
}

// Chaves usadas apenas como cache local (fallback caso o Supabase esteja
// indisponível); a fonte de verdade passa a ser o banco remoto.
export const STORAGE_KEYS = {
  schedule: "planejador:weekly-schedule:cache",
  priorities: "planejador:weekly-priorities:cache",
  activityTypes: "planejador:activity-types:cache",
}

export function slotKey(day, time) {
  return `${day}_${time}`
}
