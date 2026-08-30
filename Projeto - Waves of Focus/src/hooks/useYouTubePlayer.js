import { useCallback, useEffect, useRef, useState } from 'react'

let apiPromise = null

function loadYouTubeApi() {
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT)
  }
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previousHandler = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousHandler === 'function') previousHandler()
        resolve(window.YT)
      }
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      document.head.appendChild(tag)
    })
  }
  return apiPromise
}

const ERROR_MESSAGES = {
  2: 'O parâmetro do vídeo é inválido.',
  5: 'Erro interno do player (HTML5).',
  100: 'Vídeo não encontrado ou removido — URL desatualizada.',
  101: 'O vídeo não permite incorporação.',
  150: 'O vídeo não permite incorporação.',
  blocked: 'A reprodução foi bloqueada neste navegador.',
}

function describeError(code) {
  return ERROR_MESSAGES[code] || 'Não foi possível reproduzir este vídeo.'
}

export function useYouTubePlayer(containerId, videoId, initialVolume) {
  const playerRef = useRef(null)
  const volumeRef = useRef(initialVolume)
  const [reloadKey, setReloadKey] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  volumeRef.current = initialVolume

  useEffect(() => {
    const frame = document.getElementById(containerId)
    if (!frame) return

    let cancelled = false
    let player = null
    let gestureHandler = null

    const detachGestures = () => {
      if (gestureHandler) {
        window.removeEventListener('pointerdown', gestureHandler)
        gestureHandler = null
      }
    }

    // Remove iframes antigos para evitar acumular players no mesmo container
    // (útil em StrictMode ou trocas rápidas de estação).
    frame.innerHTML = ''
    setIsLoading(true)
    setError(null)
    setIsReady(false)
    setIsPlaying(false)

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return

        // Browsers bloqueiam autoplay com som no primeiro acesso. O primeiro
        // gesto real do usuário (clique/toque fora dos controles) libera a
        // reprodução de forma confiável; depois disso o autoplay funciona.
        const startOnGesture = (event) => {
          const interactive = event.target.closest(
            '.ctl-btn, .env-chip, .yt-link, .volume-slider, .player-overlay-play, .player-overlay-error',
          )
          if (interactive) return
          const player = playerRef.current
          if (!player || typeof player.getPlayerState !== 'function') return
          if (player.getPlayerState() !== 1) {
            try {
              player.playVideo()
            } catch {
              // sem efeito
            }
          }
          detachGestures()
        }

        gestureHandler = startOnGesture
        window.addEventListener('pointerdown', startOnGesture)

        player = new YT.Player(containerId, {
          videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return
              player = event.target
              playerRef.current = player
              try {
                player.setVolume(volumeRef.current)
                player.playVideo()
              } catch {
                // Autoplay com som pode ser bloqueado pelo navegador:
                // o overlay de play aparece e o usuário inicia manualmente.
              }
              setIsReady(true)
              setIsLoading(false)
            },
            onStateChange: (event) => {
              if (cancelled) return
              setIsPlaying(event.data === YT.PlayerState.PLAYING)
            },
            onError: (event) => {
              if (cancelled) return
              setIsLoading(false)
              setError(describeError(event.data))
            },
          },
        })
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false)
          setError('Não foi possível carregar o player do YouTube.')
        }
      })

    return () => {
      cancelled = true
      detachGestures()
      if (player && typeof player.destroy === 'function') {
        player.destroy()
      }
      player = null
      playerRef.current = null
    }
  }, [containerId, videoId, reloadKey])

  const setVolume = useCallback((level) => {
    volumeRef.current = level
    const player = playerRef.current
    if (player && typeof player.setVolume === 'function') {
      player.setVolume(level)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const player = playerRef.current
    if (!player || typeof player.getPlayerState !== 'function') return
    if (player.getPlayerState() === 1) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }, [])

  const retry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  return { isReady, isPlaying, isLoading, error, setVolume, togglePlay, retry }
}