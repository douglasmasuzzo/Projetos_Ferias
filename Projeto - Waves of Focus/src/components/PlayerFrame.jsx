import { IconPlay, IconRetry } from './icons.jsx'

export default function PlayerFrame({ containerId, isLoading, isReady, isPlaying, error, onPlay, onRetry }) {
  const showOverlay = Boolean(error) || (!isPlaying && isReady)
  const showLoading = isLoading && !error

  return (
    <div className="player-frame" aria-busy={isLoading}>
      <div id={containerId} />

      {showLoading && (
        <div className="player-overlay" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true" />
          <span className="overlay-text">Sintonizando a estação…</span>
        </div>
      )}

      {error ? (
        <div className="player-overlay player-overlay-error" role="alert">
          <p className="overlay-title">Falha na estação</p>
          <p className="overlay-text">{error}</p>
          <button type="button" className="ghost-btn" onClick={onRetry}>
            <IconRetry width={16} height={16} />
            Tentar novamente
          </button>
        </div>
      ) : (
        showOverlay && (
          <button
            type="button"
            className="player-overlay player-overlay-play"
            onClick={onPlay}
            aria-label="Reproduzir vídeo"
          >
            <span className="big-play" aria-hidden="true">
              <IconPlay />
            </span>
            <span className="overlay-text">Pressione para reproduzir</span>
          </button>
        )
      )}
    </div>
  )
}