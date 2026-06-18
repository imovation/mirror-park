import { useMemo } from 'react'
import ScrollList from '@/components/ui/ScrollList'
import { faker } from '@faker-js/faker'

const EVENTS = Array.from({ length: 12 }, (_, i) => ({
  id: `event-${i}`,
  time: `${faker.number.int({ min: 6, max: 22 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
  title: faker.helpers.arrayElement([
    '校园安保巡查完成',
    '教学设备巡检正常',
    '图书馆新书上架',
    '体育馆场地预约',
    '行政会议已结束',
    '教职工考勤统计更新',
    '校园活动场地布置中',
    '食堂食品安全检查通过',
    '校车运行正常',
    '访客登记系统更新',
  ]),
  status: faker.helpers.arrayElement(['已完成', '进行中', '正常']),
}))

interface RecentActivity {
  id: string
  time: string
  title: string
  status: string
}

export default function RecentActivity() {
  const items = useMemo(() => EVENTS.map((e: RecentActivity) => ({
    id: e.id,
    content: (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{e.title}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.time}</span>
          <span style={{
            fontSize: 10,
            color: e.status === '进行中' ? 'var(--accent)' : e.status === '已完成' ? 'var(--color-success)' : 'var(--text-tertiary)',
          }}>
            {e.status}
          </span>
        </span>
      </div>
    ),
  })), [])

  return <ScrollList items={items} maxHeight={200} />
}
