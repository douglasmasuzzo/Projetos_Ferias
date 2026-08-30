// Estações de foco do Waves of Focus.
// Cada estação aponta para um vídeo/transmissão pública do YouTube com playability
// verificada (checada em 29/08/2026 via página de watch e oEmbed).
export const ENVIRONMENTS = [
  {
    id: 'lofi-sky',
    label: 'Céu Lofi',
    title: 'Above the Clouds',
    artist: 'Fantasy Lofi Lounge',
    videoId: 'LsSST3L5MT4',
    icon: 'cloud',
    gradient: 'linear-gradient(180deg, #2b3a67 0%, #6a89b8 60%, #c9d6e8 100%)',
  },
  {
    id: 'rainy-city-night',
    label: 'Cidade à noite (chuva)',
    title: "90's Tokyo Street • Rainy Lofi",
    artist: 'Lofi on the Rooftop',
    videoId: '4Q9jq-tdOoE',
    icon: 'city',
    gradient: 'linear-gradient(180deg, #10121c 0%, #232946 55%, #3d4a7a 100%)',
  },
  {
    id: 'lofi-rain',
    label: 'Chuva Lofi',
    title: 'Lofi Rain Ambience',
    artist: "90's City Night",
    videoId: 'anJuUR-Unc4',
    icon: 'rain',
    gradient: 'linear-gradient(180deg, #1c2b33 0%, #3a5a6b 60%, #7fa8ab 100%)',
  },
  {
    id: 'cyberpunk-rain',
    label: 'Cyberpunk (chuva neon)',
    title: 'Neon Cyberpunk City Rain',
    artist: 'Lofi Ambient',
    videoId: 'WckzeouU2zY',
    icon: 'neon',
    gradient: 'linear-gradient(180deg, #1a0b2e 0%, #4a1a5c 55%, #ff6ec7 100%)',
  },
]

export function getEnvironment(id) {
  return ENVIRONMENTS.find((env) => env.id === id) || ENVIRONMENTS[0]
}

export function toWatchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`
}

export const STORAGE_KEYS = {
  environment: 'waves-of-focus:environment',
  volume: 'waves-of-focus:volume',
}