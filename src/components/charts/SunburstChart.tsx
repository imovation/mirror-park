import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

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

export default function SunburstChart({ data, height = 260, title }: SunburstChartProps) {
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
          color: '#fff',
          fontSize: 11,
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0a1628',
          borderWidth: 2,
        },
        levels: [
          {} as any,
          {
            color: ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffd600', '#00bcd4'],
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
      textStyle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 'normal' },
      left: 'center',
      top: -5,
    }
  }

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />
}
