import { useTeacherStudios } from '@/api/queries/teachingResearch'
import StatusPanel from '@/components/ui/StatusPanel'

const subjectColors: Record<string, string> = {
  '语文': 'var(--color-danger)',
  '数学': 'var(--accent)',
  '英语': 'var(--color-success)',
  '物理': 'var(--color-warning)',
  '化学': 'var(--color-chart-7)',
  '生物': 'var(--color-chart-1)',
  '信息技术': 'var(--color-chart-3)',
  '心理': 'var(--color-chart-5)',
}

export default function TeacherStudiosPanel() {
  const { data, isLoading, error } = useTeacherStudios()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
      {data.studios.map((s) => (
        <div
          key={s.id}
          style={{
            background: 'rgba(74,158,255,0.06)',
            borderRadius: 6,
            padding: '8px 10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</span>
            <span style={{
              fontSize: 10,
              color: subjectColors[s.subject] || 'var(--accent)',
              background: 'var(--skeleton-bg)',
              padding: '1px 6px',
              borderRadius: 3,
            }}>
              {s.subject}
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>主持人: {s.host}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
            <span style={{ color: 'var(--accent)' }}>成员 {s.memberCount}人</span>
            <span style={{ color: 'var(--color-success)' }}>成果 {s.achievementCount}项</span>
          </div>
        </div>
      ))}
    </div>
  )
}
