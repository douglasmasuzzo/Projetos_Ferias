import { useEffect, useRef } from 'react'
import { ENVIRONMENTS, STORAGE_KEYS, getEnvironment, toWatchUrl } from '../constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useYouTubePlayer } from '../hooks/useYouTubePlayer'
import EnvironmentSelector from './EnvironmentSelector.jsx'
import PlayerControls from './PlayerControls.jsx'
import PlayerFrame from './PlayerFrame.jsx'
import { IconExternal } from './icons.jsx'

const PLAYER_CONTAINER_ID = 'yt-player'

function WaveLogo({ size = 30 }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.55)}
      viewBox="0 0 48 24"
      fill="none"
      aria-hidden="true"
      className="wave-logo"
    >
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d="M2 12 Q5 4 8 12 T14 12 T20 12 T26 12 T32 12 T38 12 T44 12"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity={0.35 + i * 0.2}
          transform={`translate(0 ${i * -1.5})`}
        />
      ))}
    </svg>
  )
}

export default function FocusPlayer() {
  const [environmentId, setEnvironmentId] = useLocalStorage(
    STORAGE_KEYS.environment,
    getEnvironment().id,
  )
  const [volume, setVolume] = useLocalStorage(STORAGE_KEYS.volume, 50)
  const lastNonZeroVolumeRef = useRef(50)

  const environment = getEnvironment(environmentId)
  const stationIndex = Math.max(0, ENVIRONMENTS.findIndex((env) => env.id === environmentId))

  const status = error ? 'error' : !isReady ? 'loading' : isPlaying ? 'playing' : 'paused'
  const statusText = error ? 'Falha' : !isReady ? 'Sintonizando…' : isPlaying ? 'Tocando' : 'Pausado'

  const { isReady, isPlaying, isLoading, error, setVolume: setPlayerVolume, togglePlay, retry } =
    useYouTubePlayer(PLAYER_CONTAINER_ID, environment.videoId, volume)

  useEffect(() => {
    setPlayerVolume(volume)
  }, [volume, setPlayerVolume])

  const goToStation = (offset) => {
    const nextIndex = (stationIndex + offset + ENVIRONMENTS.length) % ENVIRONMENTS.length
    setEnvironmentId(ENVIRONMENTS[nextIndex].id)
  }

  const toggleMute = () => {
    if (volume > 0) {
      lastNonZeroVolumeRef.current = volume
      setVolume(0)
    } else {
      setVolume(lastNonZeroVolumeRef.current || 50)
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      const target = event.target
      const isFormControl =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLButtonElement
      if (isFormControl) return

      if (event.code === 'Space') {
        event.preventDefault()
        togglePlay()
      } else if (event.code === 'ArrowRight') {
        goToStation(1)
      } else if (event.code === 'ArrowLeft') {
        goToStation(-1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [environmentId])

  return (
    <div
      className="focus-player"
      style={{ '--station-gradient': environment.gradient }}
    >
      <div className="bg-sheen" aria-hidden="true" />

      <main className="card">
        <header className="app-header">
          <span className="app-brand">
            <WaveLogo size={32} />
            <span className="app-title">
              Waves of Focus
              <span className="app-subtitle">Rádio de ambientes para foco</span>
            </span>
          </span>
        </header>

        <PlayerFrame
          containerId={PLAYER_CONTAINER_ID}
          isLoading={isLoading}
          isReady={isReady}
          isPlaying={isPlaying}
          error={error}
          onPlay={togglePlay}
          onRetry={retry}
        />

        <PlayerControls
          isPlaying={isPlaying}
          isReady={isReady}
          onTogglePlay={togglePlay}
          onPrev={() => goToStation(-1)}
          onNext={() => goToStation(1)}
          canPrev={stationIndex > 0}
          canNext={stationIndex < ENVIRONMENTS.length - 1}
          volume={volume}
          onVolumeChange={setVolume}
          onMuteToggle={toggleMute}
        />

        <div className="now-playing">
          <span className={`np-status np-status-${status}`} role="status" aria-live="polite">
            <span className="np-status-dot" aria-hidden="true" />
            {statusText}
            <span className="np-status-vol">vol {volume}%</span>
          </span>
          <div className="now-playing-text">
            <span className="np-station">{environment.label}</span>
            <span className="np-track">
              {environment.title} — {environment.artist}
            </span>
          </div>
          <a
            className="yt-link"
            href={toWatchUrl(environment.videoId)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir "${environment.title}" no YouTube`}
            title="Assistir no YouTube"
          >
            <IconExternal width={18} height={18} />
          </a>
        </div>

        <EnvironmentSelector currentId={environmentId} onSelect={setEnvironmentId} />
      </main>
    </div>
  )
}