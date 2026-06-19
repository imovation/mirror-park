import type { PanelConfig } from '@/types/panel'
import LibraryScene from './LibraryScene'
import LibraryTopMetrics from './panels/LibraryTopMetrics'
import BorrowStats from './panels/BorrowStats'
import BookBorrowRank from './panels/BookBorrowRank'
import ReadingActivities from './panels/ReadingActivities'
import VisitorStats from './panels/VisitorStats'

export const libraryScene = () => <LibraryScene />

export const libraryTopMetrics = () => <LibraryTopMetrics />

export const libraryPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'lib-borrow', title: '借阅统计', height: 'flex-2' },
    { id: 'lib-book-rank', title: '图书借阅多维排行', height: 'flex-3', collapsible: true, collapsedSummary: '热门图书、班级排行、阅读之星' },
  ],
  right: [
    { id: 'lib-activities', title: '阅读活动', height: 'flex-1' },
    { id: 'lib-visitors', title: '入馆统计', height: 'flex-2' },
  ],
}

export function renderLibraryPanel(panelId: string) {
  switch (panelId) {
    case 'lib-borrow': return <BorrowStats />
    case 'lib-book-rank': return <BookBorrowRank />
    case 'lib-activities': return <ReadingActivities />
    case 'lib-visitors': return <VisitorStats />
    default: return <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>待实现</span>
  }
}
