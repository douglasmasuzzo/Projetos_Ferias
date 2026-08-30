import {
  IconPause,
  IconPlay,
  IconPrev,
  IconNext,
  IconVolumeMute,
  IconVolumeLow,
  IconVolumeHigh,
} from './icons.jsx'

function VolumeIcon({ volume }) {
  if (volume === 0) return <IconVolumeMute />
  if (volume < 40) return <IconVolumeLow />
  return <IconVolumeHigh />
}

export default function PlayerControls({
  isPlaying,
  isReady,
  onTogglePlay,
  onPrev,
  onNext,
  canPrev,
  canNext,
  volume,
  onVolumeChange,
  onMuteToggle,
}) {
  return (
    <div className="player-controls">
      <button
        type="button"
        className="ctl-btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Estação anterior"
        title="Estação anterior"
      >
        <IconPrev />
      </button>

      <button
        type="button"
        className="ctl-btn ctl-btn-primary"
        onClick={onTogglePlay}
        disabled={!isReady}
        aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
        title={isPlaying ? 'Pausar' : 'Reproduzir'}
      >
        {isPlaying ? <IconPause /> : <IconPlay />}
      </button>

      <button
        type="button"
        className="ctl-btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Próxima estação"
        title="Próxima estação"
      >
        <IconNext />
      </button>

      <div className="volume-control">
        <button
          type="button"
          className="ctl-btn ctl-btn-icon"
          onClick={onMuteToggle}
          aria-label={volume === 0 ? 'Ativar som' : 'Silenciar'}
          title={volume === 0 ? 'Ativar som' : 'Silenciar'}
        >
          <VolumeIcon volume={volume} />
        </button>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}