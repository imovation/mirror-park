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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1, minHeight: 0, alignContent: 'start' }}>
      {data.studios.map((s) => (
        <div
          key={s.id}
          style={{
            background: 'var(--skeleton-bg)',
            borderRadius: 6,
            padding: '8px 10px',
            border: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.name}
            </span>
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: SUBJECT_COLORS[s.subject] || 'var(--accent)',
              background: `${SUBJECT_COLORS[s.subject] || 'var(--accent)'}20`,
              padding: '2px 6px',
              borderRadius: 3,
              flexShrink: 0,
              marginLeft: 4,
            }}>
              {s.subject}
            </span>
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 2 }}>主持人: {s.host}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 'var(--font-size-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>成员 <b style={{ color: 'var(--text-primary)' }}>{s.memberCount}</b> 人</span>
            <span style={{ color: 'var(--text-secondary)' }}>成果 <b style={{ color: 'var(--text-primary)' }}>{s.achievementCount}</b> 项</span>
          </div>
        </div>
      ))}
    </div>
  )
}
