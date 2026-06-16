import { useTeacherTopics } from '@/api/queries/teachingResearch'
import NumberFlip from '@/components/ui/NumberFlip'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeacherTopics() {
  const { data, isLoading, error } = useTeacherTopics()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return null
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      <NumberFlip label="课例数" value={data.lessonCases} unit="个" color="#4a9eff" />
      <NumberFlip label="公开成果数" value={data.publicAchievements} unit="项" color="#00c853" />
      <NumberFlip label="在研课题数" value={data.ongoingTopics} unit="项" color="#ff6d00" />
    </div>
  )
}
