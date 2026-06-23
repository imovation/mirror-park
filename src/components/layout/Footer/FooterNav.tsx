import {
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BookOpenIcon,
  PresentationChartBarIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'
import type { ComponentType, FC } from 'react'
import { ThemeId } from '@/types/theme'
import { useThemeStore } from '@/stores/useThemeStore'
import { useLayoutStore } from '@/stores/useLayoutStore'
import FooterNavItem from './FooterNavItem'

interface NavItem {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  labelCn: string
  labelEn: string
  themeId: ThemeId
}

const NAV_ITEMS: NavItem[] = [
  { icon: HomeIcon, labelCn: '综合态势', labelEn: 'OVERVIEW', themeId: ThemeId.OVERVIEW },
  { icon: AcademicCapIcon, labelCn: '教学研究', labelEn: 'RESEARCH', themeId: ThemeId.TEACHING_RESEARCH },
  { icon: BriefcaseIcon, labelCn: '行政办公', labelEn: 'ADMIN', themeId: ThemeId.ADMIN },
  { icon: BookOpenIcon, labelCn: '智慧图书', labelEn: 'LIBRARY', themeId: ThemeId.LIBRARY },
  { icon: PresentationChartBarIcon, labelCn: '智慧教学', labelEn: 'TEACHING', themeId: ThemeId.ACADEMICS },
  { icon: ShieldCheckIcon, labelCn: '智慧安防', labelEn: 'SECURITY', themeId: ThemeId.SECURITY },
  { icon: BuildingOffice2Icon, labelCn: '智慧后勤', labelEn: 'LOGISTICS', themeId: ThemeId.LOGISTICS },
]

const FooterNav: FC = () => {
  const activeModule = useLayoutStore((s) => s.activeModule)
  const setActiveModule = useLayoutStore((s) => s.setActiveModule)
  const switchTheme = useThemeStore((s) => s.switchTheme)

  const handleClick = (themeId: ThemeId) => {
    setActiveModule(themeId)
    switchTheme(themeId)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {NAV_ITEMS.map((item) => (
        <FooterNavItem
          key={item.themeId}
          icon={item.icon}
          labelCn={item.labelCn}
          labelEn={item.labelEn}
          themeId={item.themeId}
          isActive={activeModule === item.themeId}
          onClick={() => handleClick(item.themeId)}
        />
      ))}
    </div>
  )
}

export default FooterNav
