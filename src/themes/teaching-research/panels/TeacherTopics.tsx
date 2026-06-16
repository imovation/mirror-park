import { useTeacherTopics } from '@/api/queries/teachingResearch'
import NumberFlip from '@/components/ui/NumberFlip'

export default function TeacherTopics() {
  const { data, isLoading, error } = useTeacherTopics()
  if (isLoading) return <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>加载中...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>数据加载失败</div>
  if (!data) return null
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <NumberFlip label="课例数" value={data.lessonCases} unit="个" color="#4a9eff" />
      <NumberFlip label="公开成果数" value={data.publicAchievements} unit="项" color="#00c853" />
      <NumberFlip label="在研课题数" value={data.ongoingTopics} unit="项" color="#ff6d00" />
    </div>
  )
}
