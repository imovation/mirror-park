import { useResourceUpdates, useResourceStats } from '@/api/queries/teachingResearch'
import ScrollList from '@/components/ui/ScrollList'
import StatusPanel from '@/components/ui/StatusPanel'

export default function ResourceUpdates() {
  const resQuery = useResourceUpdates()
  const statsQuery = useResourceStats()

  if (resQuery.isLoading || statsQuery.isLoading) return <StatusPanel type="loading" />
  if (resQuery.error || statsQuery.error) return <StatusPanel type="error" />
  if (!resQuery.data || !statsQuery.data) return <StatusPanel type="empty" />

  const stats = statsQuery.data

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <div style={{ flex: 1, textAlign: 'center', background: 'rgba(74,158,255,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '4px 6px' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--accent)' }}>{stats.totalResources}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>资源总量</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'rgba(0,200,83,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '4px 6px' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-success)' }}>{stats.cloudResources}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>云资源</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,109,0,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '4px 6px' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-warning)' }}>{stats.cloudQuestions}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>云端题库</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', background: 'rgba(74,158,255,0.08)', border: '1px solid var(--border-light)', borderRadius: 6, padding: '4px 6px' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--accent)' }}>{stats.recentUpdates}</div>
          <div style={{ fontSize: 'var(--font-size-2xs)', color: 'var(--text-muted)' }}>近期更新</div>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ScrollList
          header="近期更新资源"
          items={resQuery.data.recentItems.map((item) => ({
            id: item.id,
            content: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
                  {item.name}
                </span>
                <span style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{
                    fontSize: 'var(--font-size-2xs)',
                    color: '#fff',
                    background: 'var(--accent)',
                    padding: '1px 5px',
                    borderRadius: 3,
                    opacity: 0.85,
                    whiteSpace: 'nowrap',
                  }}>{item.subject}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.teacher}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.time}</span>
                </span>
              </div>
            ),
          }))}
        />
      </div>
    </div>
  )
}
