import { useDutyData } from '@/api/queries/admin'
import StatCard from '@/components/ui/StatCard'
import StatusPanel from '@/components/ui/StatusPanel'
import ChartLabel from '@/components/ui/ChartLabel'

const ROLE_COLORS: Record<string, string> = {
  '行政值班': 'var(--accent)',
  '教师值班': 'var(--color-success)',
  '安保值班': 'var(--color-pending)',
  '医务值班': 'var(--color-chart-5)',
  '行政副值班': 'var(--accent)',
  '教师副值班': 'var(--color-success)',
  '巡逻安保': 'var(--color-pending)',
  '值班组长': 'var(--color-chart-5)',
}

const ROLE_ICONS: Record<string, string> = {
  '行政值班': '👔',
  '教师值班': '👨‍🏫',
  '安保值班': '🛡️',
  '医务值班': '⚕️',
  '行政副值班': '👔',
  '教师副值班': '👨‍🏫',
  '巡逻安保': '🚶',
  '值班组长': '⭐',
}

function todayStr() {
  const d = new Date()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`
}

function getWeekSchedule(staffs: { role: string; name: string; phone: string }[]) {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const d = new Date()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return weekDays.map((day, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const staff = staffs[i % Math.max(staffs.length, 1)] || staffs[0]
    return {
      day,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      staff,
    }
  })
}

export default function DutySchedule() {
  const { data, isLoading, error } = useDutyData()
  if (isLoading) return <StatusPanel type="loading" />
  if (error) return <StatusPanel type="error" />
  if (!data) return <StatusPanel type="empty" />

  const weekSchedule = getWeekSchedule(data.staffs)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, padding: '0 2px' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>今日值班</span>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{todayStr()}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
        {data.staffs.map(s => (
          <StatCard
            key={s.role}
            icon={ROLE_ICONS[s.role] || '👤'}
            iconColor={ROLE_COLORS[s.role] || 'var(--accent)'}
            value={s.name}
            label={s.role}
            sublabel={s.phone}
            sublabelColor="var(--text-tertiary)"
          />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
        <ChartLabel>本周值班排班</ChartLabel>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
          {weekSchedule.map((row) => (
            <div
              key={row.day}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 6px',
                borderRadius: 4,
                background: 'var(--panel-bg)',
                border: '1px solid var(--border-light)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <span style={{ minWidth: 32, fontWeight: 600, color: 'var(--accent)' }}>{row.day}</span>
              <span style={{ minWidth: 32, color: 'var(--text-tertiary)' }}>{row.date}</span>
              <span style={{ flex: 1, color: 'var(--text-primary)' }}>{row.staff?.name ?? '--'}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-2xs)' }}>{row.staff?.phone ?? ''}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexShrink: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
        <span>总值班人数 <b style={{ color: 'var(--text-primary)' }}>{data.staffs.length}</b> 人</span>
        <span style={{ color: 'var(--border-light)' }}>|</span>
        <span>值班电话 <b style={{ color: 'var(--text-primary)' }}>0769-****8000</b></span>
      </div>
    </div>
  )
}
