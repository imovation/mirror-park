import { useTeacherStudios } from '@/api/queries/teachingResearch'
import RankList from '@/components/ui/RankList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function TeacherStudiosPanel() {
  const { data, isLoading, error } = useTeacherStudios()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const rankItems = data.studios.map((s, i) => ({
    id: s.id,
    name: s.name,
    value: s.achievementCount,
    unit: '项',
    color: 'var(--accent)'
  }))

  return <RankList items={rankItems} maxHeight={160} />
}
