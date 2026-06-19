import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface FunnelChartProps {
  data: { name: string; value: number }[]
  height?: number
  title?: string
  color?: string[]
}

const MIN_HEIGHT = 120

export default function FunnelChart({ data, height = 220, title, color }: FunnelChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const funnelColors = color || t.colors
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}: ${p.value}`
      },
    },
    series: [
      {
        type: 'funnel',
        left: '10%',
        right: '10%',
        sort: 'descending',
        gap: 6,
        label: {
          show: true,
          position: 'inside',
          color: t.label,
          fontSize: f.legendFontSize,
          formatter: '{b}: {c}',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: t.borderColor, borderWidth: 2 },
        emphasis: {
          label: { fontSize: f.titleFontSize, fontWeight: 'bold' },
        },
        data: data.map((d, i) => ({ ...d, itemStyle: { color: funnelColors[i % funnelColors.length] } })),
      },
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
