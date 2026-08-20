// IDs de vídeos do YouTube verificados manualmente (transmissões/loops públicos de lofi/ambiência).
export const ENVIRONMENTS = [
  {
    id: 'lofi-sky',
    label: 'Céu Lofi',
    videoId: 'jfKfPfyJRdk',
    gradient: 'linear-gradient(180deg, #2b3a67 0%, #6a89b8 60%, #c9d6e8 100%)',
  },
  {
    id: 'rainy-city-night',
    label: 'Cidade à noite (chuva)',
    videoId: 'Q9SdxeUNzVg',
    gradient: 'linear-gradient(180deg, #10121c 0%, #232946 55%, #3d4a7a 100%)',
  },
  {
    id: 'lofi-rain',
    label: 'Chuva Lofi',
    videoId: 'anJuUR-Unc4',
    gradient: 'linear-gradient(180deg, #1c2b33 0%, #3a5a6b 60%, #7fa8ab 100%)',
  },
  {
    id: 'cyberpunk-rain',
    label: 'Cyberpunk (chuva neon)',
    videoId: 'WckzeouU2zY',
    gradient: 'linear-gradient(180deg, #1a0b2e 0%, #4a1a5c 55%, #ff6ec7 100%)',
  },
]

export const STORAGE_KEYS = {
  environment: 'waves-of-focus:environment',
  volume: 'waves-of-focus:volume',
}
