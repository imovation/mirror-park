import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useChartTheme, getChartFontSizes } from '@/config/chartTheme'

interface SunburstNode {
  name: string
  value?: number
  children?: SunburstNode[]
}

interface SunburstChartProps {
  data: SunburstNode[]
  height?: number
  title?: string
}

const MIN_HEIGHT = 120

export default function SunburstChart({ data, height = 220, title }: SunburstChartProps) {
  const t = useChartTheme()
  const f = getChartFontSizes()
  const option: EChartsOption = {
    tooltip: {
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}: ${p.value ?? ''}`
      },
    },
    series: [
      {
        type: 'sunburst',
        data,
        radius: [0, '95%'],
        sort: 'desc',
        emphasis: { focus: 'descendant' },
        label: {
          rotate: 'radial',
          color: t.label,
          fontSize: f.legendFontSize,
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: t.borderColor,
          borderWidth: 2,
        },
        levels: [
          {} as any,
          {
            color: t.colors,
            colorMappingBy: 'value',
          } as any,
          {
            colorMappingBy: 'value',
            saturation: 0.6,
          } as any,
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
