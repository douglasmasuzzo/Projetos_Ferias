import { DAYS, TIMES, slotKey } from '../constants'

export default function ScheduleGrid({ schedule, activityTypes, onChangeSlot }) {
  function findActivityType(activityTypeId) {
    return activityTypes.find((t) => t.id === activityTypeId)
  }

  function cycleSlot(day, time) {
    const key = slotKey(day, time)
    const current = schedule[key] // activity_type_id atual ou undefined
    const currentIndex = activityTypes.findIndex((t) => t.id === current)

    // Ciclo: vazio -> tipo 1 -> tipo 2 -> ... -> vazio
    let nextId = null
    if (activityTypes.length > 0) {
      const nextIndex = currentIndex + 1
      nextId = nextIndex < activityTypes.length ? activityTypes[nextIndex].id : null
    }
    onChangeSlot(day, time, nextId)
  }

  return (
    <section>
      {activityTypes.length > 0 && (
        <div className="legend">
          {activityTypes.map((type) => (
            <span key={type.id} className="legend-item">
              <span className="dot" style={{ backgroundColor: type.color }} />
              {type.label}
            </span>
          ))}
        </div>
      )}

      <p className="hint">
        Toque em um bloco para alternar entre os tipos de atividade que você criou abaixo.
      </p>

      <div className="grid">
        <div className="head" />
        {DAYS.map((day) => (
          <div className="head" key={day}>{day}</div>
        ))}

        {TIMES.map((time) => (
          <div className="row" key={time}>
            <div className="timelabel">{time}</div>
            {DAYS.map((day) => {
              const key = slotKey(day, time)
              const activityTypeId = schedule[key]
              const type = findActivityType(activityTypeId)
              return (
                <div className="cell" key={key}>
                  <button
                    type="button"
                    className={`slot ${!type ? 'slot-empty' : ''}`}
                    style={type ? { backgroundColor: type.color } : undefined}
                    onClick={() => cycleSlot(day, time)}
                    aria-label={`${day} - ${time}: ${type ? type.label : 'vazio'}`}
                  >
                    {type ? type.label : ''}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
