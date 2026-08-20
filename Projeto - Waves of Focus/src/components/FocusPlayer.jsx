import { useState, useEffect } from 'react'
import { ENVIRONMENTS, STORAGE_KEYS } from '../constants'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useYouTubePlayer } from '../hooks/useYouTubePlayer'
import EnvironmentSelector from './EnvironmentSelector.jsx'
import PlayerControls from './PlayerControls.jsx'

const PLAYER_CONTAINER_ID = 'yt-player'

export default function FocusPlayer() {
  const [environmentId, setEnvironmentId] = useLocalStorage(
    STORAGE_KEYS.environment,
    ENVIRONMENTS[0].id
  )
  const [volume, setVolume] = useLocalStorage(STORAGE_KEYS.volume, 50)

  const environment =
    ENVIRONMENTS.find((env) => env.id === environmentId) || ENVIRONMENTS[0]

  const { isPlaying, togglePlay, setVolume: setPlayerVolume } = useYouTubePlayer(
    PLAYER_CONTAINER_ID,
    environment.videoId,
    volume
  )

  useEffect(() => {
    setPlayerVolume(volume)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume])

  return (
    <div
      className="focus-player"
      style={{ background: environment.gradient }}
    >
      <div className="card">
        <div className="player-frame">
          <div id={PLAYER_CONTAINER_ID} />
        </div>

        <PlayerControls
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          volume={volume}
          onVolumeChange={setVolume}
        />

        <EnvironmentSelector currentId={environmentId} onSelect={setEnvironmentId} />
      </div>
    </div>
  )
}
