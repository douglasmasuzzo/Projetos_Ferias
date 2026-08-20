export default function PlayerControls({ isPlaying, onTogglePlay, volume, onVolumeChange }) {
  return (
    <div className="player-controls">
      <button
        type="button"
        className="play-btn"
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
      >
        {isPlaying ? '❚❚' : '▶'}
      </button>

      <div className="volume-control">
        <span className="volume-icon" aria-hidden="true">🔊</span>
        <input
          type="range"
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
