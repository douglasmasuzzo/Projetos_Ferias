import { ENVIRONMENTS } from '../constants'
import { STATION_ICONS } from './icons.jsx'

export default function EnvironmentSelector({ currentId, onSelect }) {
  return (
    <div className="environment-selector" role="tablist" aria-label="Estações de foco">
      {ENVIRONMENTS.map((env) => {
        const StationIcon = STATION_ICONS[env.icon] || STATION_ICONS.cloud
        const isActive = env.id === currentId
        return (
          <button
            key={env.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`env-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(env.id)}
            style={isActive ? { '--chip-accent': env.gradient } : undefined}
          >
            <StationIcon />
            <span>{env.label}</span>
          </button>
        )
      })}
    </div>
  )
}