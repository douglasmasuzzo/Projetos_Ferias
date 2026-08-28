import { useState } from 'react'
import { PRIORITY_LEVELS, getPriorityMeta } from '../constants'

// Campo de texto com estado local: só persiste (onUpdate) ao sair do campo
// (blur) ou ao pressionar Enter, evitando uma escrita no Supabase a cada tecla.
function PriorityTextInput({ id, value, done, onCommit }) {
  const [text, setText] = useState(value)

  function handleBlur() {
    const next = text.trim()
    if (next === value) return
    onCommit(id, { text: next })
  }

  return (
    <input
      type="text"
      value={text}
      className={done ? 'done' : ''}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
    />
  )
}

export default function PriorityList({ priorities, onCreate, onUpdate, onDelete }) {
  const [draft, setDraft] = useState('')
  const [draftLevel, setDraftLevel] = useState('media')

  function addPriority() {
    const text = draft.trim()
    if (!text) return
    onCreate(text, draftLevel)
    setDraft('')
    setDraftLevel('media')
  }

  // Ordena por peso da prioridade (Alta primeiro), mantendo tarefas concluídas no fim
  const sorted = [...priorities].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    const weightA = getPriorityMeta(a.priority_level).weight
    const weightB = getPriorityMeta(b.priority_level).weight
    return weightB - weightA
  })

  return (
    <section className="priorities">
      <h2 className="section-title">Prioridades da semana</h2>

      {sorted.length === 0 && (
        <p className="empty-state">Nenhuma prioridade adicionada ainda.</p>
      )}

      {sorted.map((p) => {
        const meta = getPriorityMeta(p.priority_level)
        return (
          <div className="priority-row" key={p.id}>
            <input
              type="checkbox"
              checked={p.done}
              onChange={() => onUpdate(p.id, { done: !p.done })}
            />
            <span
              className="priority-badge"
              style={{ backgroundColor: meta.color }}
              title={`Prioridade ${meta.label}`}
            >
              {meta.label}
            </span>
            <PriorityTextInput
              id={p.id}
              value={p.text}
              done={p.done}
              onCommit={onUpdate}
            />
            <select
              value={p.priority_level}
              onChange={(e) => onUpdate(p.id, { priority_level: e.target.value })}
              className="priority-select"
              aria-label="Nível de prioridade"
            >
              {PRIORITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="remove-btn"
              onClick={() => onDelete(p.id)}
              aria-label="Remover prioridade"
            >
              ✕
            </button>
          </div>
        )
      })}

      <div className="add-row">
        <input
          type="text"
          placeholder="Adicionar prioridade..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPriority()}
        />
        <select
          value={draftLevel}
          onChange={(e) => setDraftLevel(e.target.value)}
          className="priority-select"
          aria-label="Nível de prioridade da nova tarefa"
        >
          {PRIORITY_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={addPriority}>Adicionar</button>
      </div>
    </section>
  )
}
