import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface TreemapNode {
  name: string
  value: number
  children?: TreemapNode[]
}

interface TreemapChartProps {
  data: TreemapNode[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function TreemapChart({ data, height = 200, title }: TreemapChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
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
          fontSize: f.legendFontSize,
          color: t.label,
        },
        upperLabel: {
          show: true,
          height: 22,
          fontSize: f.legendFontSize,
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
            color: t.colors,
          },
        ],
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
