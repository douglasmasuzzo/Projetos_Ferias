const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
}

export function IconPlay(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.64-6.86a1.04 1.04 0 0 0 0-1.76L9.56 4.26A1.04 1.04 0 0 0 8 5.14Z" />
    </svg>
  )
}

export function IconPause(props) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4" width="4" height="16" rx="1.4" />
      <rect x="14" y="4" width="4" height="16" rx="1.4" />
    </svg>
  )
}

export function IconPrev(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 5a1 1 0 0 1 2 0v5.2l9.6-5.72A1 1 0 0 1 19 5.32v13.36a1 1 0 0 1-1.4.84L8 13.8V19a1 1 0 0 1-2 0V5Z" />
    </svg>
  )
}

export function IconNext(props) {
  return (
    <svg {...base} {...props}>
      <path d="M18 5a1 1 0 0 0-2 0v5.2L6.4 4.48A1 1 0 0 0 5 5.32v13.36a1 1 0 0 0 1.4.84L16 13.8V19a1 1 0 0 0 2 0V5Z" />
    </svg>
  )
}

export function IconVolumeMute(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6a1 1 0 0 0 1 1h3l3.3 2.48A1 1 0 0 0 13 17.78V6.22a1 1 0 0 0-1.7-.7L8 8H5a1 1 0 0 0-1 1Z" />
      <path d="m16.5 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function IconVolumeLow(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6a1 1 0 0 0 1 1h3l3.3 2.48A1 1 0 0 0 13 17.78V6.22a1 1 0 0 0-1.7-.7L8 8H5a1 1 0 0 0-1 1Z" />
      <path d="M16.5 9.2a4.5 4.5 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function IconVolumeHigh(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6a1 1 0 0 0 1 1h3l3.3 2.48A1 1 0 0 0 13 17.78V6.22a1 1 0 0 0-1.7-.7L8 8H5a1 1 0 0 0-1 1Z" />
      <path d="M16.5 8.7a5.5 5.5 0 0 1 0 6.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M19.2 6.2a9.5 9.5 0 0 1 0 11.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function IconExternal(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 4h7v7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,0)" />
      <path d="M20 4 11 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconRetry(props) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 4v6h6M20 20v-6h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 14.5a7 7 0 0 0 12.1.9M18.5 9.5a7 7 0 0 0-12.1-.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StationGlyph({ children }) {
  return (
    <svg {...base} width={18} height={18}>
      {children}
    </svg>
  )
}

export function IconCloud() {
  return (
    <StationGlyph>
      <path d="M7 18a4.5 4.5 0 0 1-.5-8.98 5.5 5.5 0 0 1 10.7 1.7A3.75 3.75 0 0 1 16.6 18H7Z" />
    </StationGlyph>
  )
}

export function IconCity() {
  return (
    <StationGlyph>
      <path d="M3 21h18M5 21V8l4 3v-3l4 3V6l4 3V4h2v17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </StationGlyph>
  )
}

export function IconRain() {
  return (
    <StationGlyph>
      <path d="M7 5.5A3.75 3.75 0 0 1 14.2 4a3.5 3.5 0 0 1 .8 6.9H7Z" />
      <path d="M8 13.5v2M12 13v2.5M16 13.5v2M10 17.5v2M14 17.5v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </StationGlyph>
  )
}

export function IconNeon() {
  return (
    <StationGlyph>
      <path d="M12 3c3.5 3.5 5.5 6 5.5 9a5.5 5.5 0 1 1-11 0c0-3 2-5.5 5.5-9Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 12a2.2 2.2 0 0 1 0 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </StationGlyph>
  )
}

export const STATION_ICONS = {
  cloud: IconCloud,
  city: IconCity,
  rain: IconRain,
  neon: IconNeon,
}