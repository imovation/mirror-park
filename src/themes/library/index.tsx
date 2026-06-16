import type { PanelConfig } from '@/types/panel'
import LibraryScene from './LibraryScene'
import CollectionOverview from './panels/CollectionOverview'
import BorrowStats from './panels/BorrowStats'
import HotBooks from './panels/HotBooks'
import ClassBorrowRank from './panels/ClassBorrowRank'
import ReadingActivities from './panels/ReadingActivities'
import VisitorStats from './panels/VisitorStats'

export const libraryScene = () => <LibraryScene />

export const libraryPanels: { left: PanelConfig[]; right: PanelConfig[] } = {
  left: [
    { id: 'lib-collection', title: '馆藏概况' },
    { id: 'lib-borrow', title: '借阅统计' },
    { id: 'lib-hot', title: '热门图书' },
  ],
  right: [
    { id: 'lib-class-rank', title: '班级借阅排行' },
    { id: 'lib-activities', title: '阅读活动' },
    { id: 'lib-visitors', title: '入馆统计' },
  ],
}

export function renderLibraryPanel(panelId: string) {
  switch (panelId) {
    case 'lib-collection': return <CollectionOverview />
    case 'lib-borrow': return <BorrowStats />
    case 'lib-hot': return <HotBooks />
    case 'lib-class-rank': return <ClassBorrowRank />
    case 'lib-activities': return <ReadingActivities />
    case 'lib-visitors': return <VisitorStats />
    default: return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>待实现</span>
  }
}
