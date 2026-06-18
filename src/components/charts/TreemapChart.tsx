import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme } from '@/config/chartTheme'

interface TreemapNode {
  name: string
  value: number
  children?: TreemapNode[]
}

interface TreemapChartProps {
  data: TreemapNode[]
  height?: number | string
  title?: string
}

export default function TreemapChart({ data, height = '100%', title }: TreemapChartProps) {
  const t = useChartTheme()
  const option: EChartsOption = {
    tooltip: {
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}: ${p.value}`
      },
    },
    series: [
      {
        type: 'treemap',
        data,
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 11,
          color: t.label,
        },
        upperLabel: {
          show: true,
          height: 22,
          fontSize: 11,
          color: t.label,
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
        itemStyle: {
          borderColor: t.borderColor,
          borderWidth: 2,
          gapWidth: 2,
        },
        levels: [
          {
            colorMappingBy: 'value',
            itemStyle: { gapWidth: 2, borderWidth: 2, borderColor: t.borderColor },
          },
          {
            colorMappingBy: 'value',
            color: ['#1a3a5c', '#2a6090', '#4a9eff', '#00c853', 'var(--color-warning)', '#aa00ff'],
          },
        ],
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
