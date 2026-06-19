import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface SankeyLink {
  source: string
  target: string
  value: number
}

interface SankeyChartProps {
  data: SankeyLink[]
  categories: string[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function SankeyChart({ data, categories, height = 200, title }: SankeyChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.data?.source || p.name} → ${p.data?.target || ''}: ${p.data?.value || p.value}`
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        layoutIterations: 32,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', opacity: 0.4 },
        label: { color: t.label, fontSize: f.legendFontSize },
        data: categories.map((name) => ({ name })),
        links: data,
      } as any,
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: f.titleFontSize, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height: Math.max(height, MIN_HEIGHT), width: '100%' }} notMerge />
}
