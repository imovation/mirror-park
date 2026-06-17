import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

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

export default function SankeyChart({ data, categories, height = 240, title }: SankeyChartProps) {
  const t = useChartTheme()
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
        label: { color: t.label, fontSize: 11 },
        data: categories.map((name) => ({ name })),
        links: data,
      } as any,
    ],
  }

  if (title) {
    option.title = {
      text: title,
      textStyle: { color: t.title, fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
