export const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]
export const TIMES = ["Manhã", "Tarde", "Noite"]
export const CATEGORIES = ["empty", "work", "study", "project", "free"]

export const CATEGORY_LABELS = {
  empty: "",
  work: "Trabalho",
  study: "Estudos",
  project: "Projeto",
  free: "Livre",
}

export const CATEGORY_LEGEND = [
  { key: "work", label: "Trabalho" },
  { key: "study", label: "Estudos (ESIII)" },
  { key: "project", label: "Projeto pessoal" },
  { key: "free", label: "Livre/descanso" },
]

export const STORAGE_KEYS = {
  schedule: "planejador:weekly-schedule",
  priorities: "planejador:weekly-priorities",
}

export function slotKey(day, time) {
  return `${day}_${time}`
}
