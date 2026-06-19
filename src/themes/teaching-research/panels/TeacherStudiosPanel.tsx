import { useTeacherStudios } from '@/api/queries/teachingResearch'
import StatusPanel from '@/components/ui/StatusPanel'

const SUBJECT_COLORS: Record<string, string> = {
  '语文': '#f5222d', '数学': '#1890ff', '英语': '#52c41a',
  '物理': '#fa8c16', '化学': '#722ed1', '生物': '#13c2c2',
  '信息技术': '#eb2f96', '心理': '#a0d911',
}

export default function TeacherStudiosPanel() {
  const { data, isLoading, error } = useTeacherStudios()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1, minHeight: 0, overflow: 'auto' }}>
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
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {s.name}
            </span>
            <span style={{
              fontSize: 10,
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
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>主持人: {s.host}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
            <span style={{ color: 'var(--accent)' }}>成员 {s.memberCount}人</span>
            <span style={{ color: 'var(--color-success)' }}>成果 {s.achievementCount}项</span>
          </div>
        </div>
      ))}
    </div>
  )
}
