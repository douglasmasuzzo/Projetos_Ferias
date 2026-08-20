import { DAYS, TIMES, CATEGORIES, CATEGORY_LABELS, CATEGORY_LEGEND, slotKey } from '../constants'

export default function ScheduleGrid({ schedule, onChange }) {
  function cycleSlot(day, time) {
    const key = slotKey(day, time)
    const current = schedule[key] || 'empty'
    const idx = CATEGORIES.indexOf(current)
    const next = CATEGORIES[(idx + 1) % CATEGORIES.length]
    onChange({ ...schedule, [key]: next })
  }

  return (
    <section>
      <div className="legend">
        {CATEGORY_LEGEND.map((item) => (
          <span key={item.key} className="legend-item">
            <span className={`dot dot-${item.key}`} />
            {item.label}
          </span>
        ))}
      </div>

      <p className="hint">Toque em um bloco para alternar entre as categorias.</p>

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
              const cat = schedule[key] || 'empty'
              return (
                <div className="cell" key={key}>
                  <button
                    type="button"
                    className={`slot slot-${cat}`}
                    onClick={() => cycleSlot(day, time)}
                    aria-label={`${day} - ${time}: ${CATEGORY_LABELS[cat] || 'vazio'}`}
                  >
                    {CATEGORY_LABELS[cat]}
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
