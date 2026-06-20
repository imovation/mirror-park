import { renderWithProviders, screen } from '@/__tests__/test-utils'
import TopMetricsCard from '@/components/ui/TopMetricsCard'

describe('TopMetricsCard', () => {
  it('renders label and value', () => {
    renderWithProviders(<TopMetricsCard label="教师总数" value="196" />)
    expect(screen.getByText('教师总数')).toBeInTheDocument()
    expect(screen.getByText('196')).toBeInTheDocument()
  })
})
