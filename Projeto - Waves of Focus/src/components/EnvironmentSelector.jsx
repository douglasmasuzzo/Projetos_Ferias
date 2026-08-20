import { ENVIRONMENTS } from '../constants'

export default function EnvironmentSelector({ currentId, onSelect }) {
  return (
    <div className="environment-selector">
      {ENVIRONMENTS.map((env) => (
        <button
          key={env.id}
          type="button"
          className={`env-chip ${env.id === currentId ? 'active' : ''}`}
          onClick={() => onSelect(env.id)}
        >
          {env.label}
        </button>
      ))}
    </div>
  )
}
