import { useState } from 'react'

export default function PriorityList({ priorities, onChange }) {
  const [draft, setDraft] = useState('')

  function addPriority() {
    const text = draft.trim()
    if (!text) return
    onChange([...priorities, { text, done: false }])
    setDraft('')
  }

  function toggleDone(index) {
    const updated = priorities.map((p, i) =>
      i === index ? { ...p, done: !p.done } : p
    )
    onChange(updated)
  }

  function updateText(index, text) {
    const updated = priorities.map((p, i) =>
      i === index ? { ...p, text } : p
    )
    onChange(updated)
  }

  function removePriority(index) {
    onChange(priorities.filter((_, i) => i !== index))
  }

  return (
    <section className="priorities">
      <h2 className="section-title">Prioridades da semana</h2>

      {priorities.length === 0 && (
        <p className="empty-state">Nenhuma prioridade adicionada ainda.</p>
      )}

      {priorities.map((p, i) => (
        <div className="priority-row" key={i}>
          <input
            type="checkbox"
            checked={p.done}
            onChange={() => toggleDone(i)}
          />
          <input
            type="text"
            value={p.text}
            className={p.done ? 'done' : ''}
            onChange={(e) => updateText(i, e.target.value)}
          />
          <button
            type="button"
            className="remove-btn"
            onClick={() => removePriority(i)}
            aria-label="Remover prioridade"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="add-row">
        <input
          type="text"
          placeholder="Adicionar prioridade..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPriority()}
        />
        <button type="button" onClick={addPriority}>Adicionar</button>
      </div>
    </section>
  )
}
