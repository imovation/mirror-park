import { useTeacherStudios } from '@/api/queries/teachingResearch'
import StatusPanel from '@/components/ui/StatusPanel'

const SUBJECT_COLORS: Record<string, string> = {
  '语文': 'var(--color-danger)', '数学': 'var(--accent)', '英语': 'var(--color-success)',
  '物理': 'var(--color-warning)', '化学': 'var(--color-chart-7)', '生物': 'var(--color-chart-1)',
  '信息技术': 'var(--color-chart-5)', '心理': 'var(--color-chart-4)',
}

export default function TeacherStudiosPanel() {
  const { data, isLoading, error } = useTeacherStudios()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, alignContent: 'start' }}>
      {data.studios.map((s) => (
        <div
          key={s.id}
          style={{
            background: 'var(--skeleton-bg)',
            borderRadius: 4,
            padding: '4px 6px',
            border: '1px solid var(--border-light)',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <span style={{
              fontSize: '0.688rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}
              title={s.name}
            >
              {s.name}
            </span>
            <span style={{
              fontSize: '0.563rem',
              color: SUBJECT_COLORS[s.subject] || 'var(--accent)',
              background: `${SUBJECT_COLORS[s.subject] || 'var(--accent)'}20`,
              padding: '1px 4px',
              borderRadius: 2,
              flexShrink: 0,
            }}>
              {s.subject}
            </span>
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
             主持人: {s.host}
          </div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>
            成果 <b style={{ color: 'var(--text-primary)' }}>{s.achievementCount}</b> 项
          </div>
        </div>
      ))}
    </div>
  )
}
