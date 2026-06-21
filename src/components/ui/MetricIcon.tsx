type IconType =
  | 'map' | 'building' | 'block' | 'group' | 'teacher' | 'student'
  | 'book' | 'library' | 'file' | 'flask' | 'person' | 'clock'
  | 'department' | 'attendance' | 'calendar' | 'room' | 'chart'
  | 'camera' | 'signal' | 'alert' | 'lock' | 'enter' | 'arrow-up'
  | 'users' | 'food' | 'check' | 'tablet' | 'briefcase' | 'door'

const PATHS: Record<IconType, JSX.Element> = {
  map: <path d="M1 6v15l7-4 8 4 7-4V2l-7 4-8-4-7 4zm7-3v15M16 4v15" />,
  building: <path d="M3 21V7l9-4 9 4v14M9 21v-6h6v6M7 9h2M7 12h2M7 15h2M15 9h2M15 12h2M15 15h2" />,
  block: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  group: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-1a6 6 0 0112 0v1M16 11a3 3 0 100-6M21 21v-1a6 6 0 00-3-5.2" /></>,
  teacher: <><circle cx="12" cy="7" r="3" /><path d="M5 21v-1a7 7 0 0114 0v1M3 10l9-4 9 4-9 4z" /></>,
  student: <><path d="M22 10L12 5 2 10l10 5 10-5zM6 12v5a6 6 0 0012 0v-5" /></>,
  book: <><path d="M4 4a2 2 0 012-2h13v18H6a2 2 0 01-2-2V4zM4 18a2 2 0 002 2h13" /><path d="M9 7h7M9 11h7" /></>,
  library: <><path d="M3 21V8l9-5 9 5v13M3 21h18M9 21V12h6v9M7 9h2M7 12h2M7 15h2M15 9h2M15 12h2M15 15h2" /></>,
  file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  flask: <><path d="M9 3h6M10 3v6L4 19a2 2 0 002 3h12a2 2 0 002-3l-6-10V3" /><path d="M7 14h10" /></>,
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0116 0v1" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  department: <><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-7h6v7M9 11h6" /></>,
  attendance: <><path d="M9 11l3 3 8-8M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  room: <><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21V12h6v9" /><path d="M9 11h.01M15 11h.01" /></>,
  chart: <><path d="M3 21V5M3 21h18M7 16v-5M12 16V8M17 16v-3" /></>,
  camera: <><path d="M3 7h4l2-3h6l2 3h4v12H3z" /><circle cx="12" cy="13" r="4" /></>,
  signal: <><path d="M2 20h2v-3M7 20v-7M12 20v-11M17 20v-15M22 20v-19" /></>,
  alert: <><path d="M12 2L2 21h20L12 2zM12 9v5M12 17v.01" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>,
  enter: <><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></>,
  'arrow-up': <><path d="M12 19V5M5 12l7-7 7 7" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-1a6 6 0 0112 0v1M17 11a3 3 0 100-6M21 21v-1a6 6 0 00-3-5.2" /></>,
  food: <><path d="M3 11h18M5 11V8a7 7 0 0114 0v3M12 3v2M7 16h10v5H7z" /></>,
  check: <><path d="M5 12l5 5L20 7" /></>,
  tablet: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M11 18h2" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></>,
  door: <><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M3 21h18M14 12h.01" /></>,
}

interface MetricIconProps {
  type: IconType
  size?: number
  color?: string
  strokeWidth?: number
}

export default function MetricIcon({ type, size = 16, color = 'var(--theme-primary)', strokeWidth = 1.5 }: MetricIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {PATHS[type]}
    </svg>
  )
}

export type { IconType }
