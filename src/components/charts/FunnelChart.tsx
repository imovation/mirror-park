import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface FunnelChartProps {
  data: { name: string; value: number }[]
  height?: number
  title?: string
  color?: string[]
}

const DEFAULT_COLORS = ['#4a9eff', '#00c853', '#ffd600', '#ff6d00', '#aa00ff']

export default function FunnelChart({ data, height = 260, title, color = DEFAULT_COLORS }: FunnelChartProps) {
  const t = useChartTheme()
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
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          color: t.label,
          fontSize: 12,
          formatter: '{b}: {c}',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: t.borderColor, borderWidth: 2 },
        emphasis: {
          label: { fontSize: 14, fontWeight: 'bold' },
        },
        data: data.map((d, i) => ({ ...d, itemStyle: { color: color[i % color.length] } })),
      },
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
