import { useTeacherStudios } from '@/api/queries/teachingResearch'
import StatusPanel from '@/components/ui/StatusPanel'

const subjectColors: Record<string, string> = {
  '语文': '#e74c3c',
  '数学': '#4a9eff',
  '英语': '#00c853',
  '物理': '#ff6d00',
  '化学': '#aa00ff',
  '生物': '#00bcd4',
  '信息技术': '#ffc107',
  '心理': '#ff80ab',
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
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{s.name}</span>
            <span style={{
              fontSize: 10,
              color: subjectColors[s.subject] || '#4a9eff',
              background: `${subjectColors[s.subject] || '#4a9eff'}15`,
              padding: '1px 6px',
              borderRadius: 3,
            }}>
              {s.subject}
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>主持人: {s.host}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
            <span style={{ color: '#4a9eff' }}>成员 {s.memberCount}人</span>
            <span style={{ color: '#00c853' }}>成果 {s.achievementCount}项</span>
          </div>
        </div>
      ))}
    </div>
  )
}
