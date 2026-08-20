import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../constants'
import ScheduleGrid from './ScheduleGrid.jsx'
import PriorityList from './PriorityList.jsx'

export default function WeeklyPlanner() {
  const [schedule, setSchedule] = useLocalStorage(STORAGE_KEYS.schedule, {})
  const [priorities, setPriorities] = useLocalStorage(STORAGE_KEYS.priorities, [])

  return (
    <main className="planner">
      <header>
        <h1>Planejador Semanal</h1>
        <p className="subtitle">
          Trabalho/estágio, estudos e projetos pessoais em um só lugar
        </p>
      </header>

      <ScheduleGrid schedule={schedule} onChange={setSchedule} />
      <PriorityList priorities={priorities} onChange={setPriorities} />

      <p className="status">Seus dados são salvos automaticamente neste navegador.</p>
    </main>
  )
}
