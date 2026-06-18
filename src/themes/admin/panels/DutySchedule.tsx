import { useDutyData } from '@/api/queries/admin'
import StatusPanel from '@/components/ui/StatusPanel'

const ROLE_COLORS: Record<string, string> = {
  '行政值班': '#4a9eff',
  '教师值班': '#00c853',
  '安保值班': '#ff6d00',
  '医务值班': '#ff1744',
}

export default function DutySchedule() {
  const { data, isLoading, error } = useDutyData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1, minHeight: 0, overflow: 'auto' }}>
      {data.staffs.map(s => (
        <div
          key={s.role}
          style={{
            background: 'rgba(74,158,255,0.06)',
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 11, color: ROLE_COLORS[s.role] || 'var(--accent)', fontWeight: 500 }}>
            {s.role}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
            {s.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
            {s.phone}
          </div>
        </div>
      ))}
    </div>
  )
}
