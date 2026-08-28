import { useState } from 'react'

const DEFAULT_COLOR = '#7a6ba6'

export default function ActivityTypeManager({ activityTypes, onCreate, onDelete }) {
  const [label, setLabel] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)

  function handleCreate() {
    const trimmed = label.trim()
    if (!trimmed) return
    onCreate(trimmed, color)
    setLabel('')
    setColor(DEFAULT_COLOR)
  }

  return (
    <section className="activity-manager">
      <h2 className="section-title">Tipos de atividade</h2>
      <p className="hint">
        Crie os blocos que fazem sentido pra sua rotina — não fique preso a categorias fixas.
      </p>

      <div className="activity-chip-list">
        {activityTypes.map((type) => (
          <span
            key={type.id}
            className="activity-chip"
            style={{ backgroundColor: type.color }}
          >
            {type.label}
            <button
              type="button"
              className="chip-remove"
              onClick={() => onDelete(type.id)}
              aria-label={`Remover ${type.label}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="add-row">
        <input
          type="text"
          placeholder="Nome do novo tipo (ex: Academia, Leitura...)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="color-input"
          aria-label="Cor do tipo de atividade"
        />
        <button type="button" onClick={handleCreate}>Criar</button>
      </div>
    </section>
  )
}
