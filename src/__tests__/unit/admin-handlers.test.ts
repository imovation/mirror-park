import { setupServer } from 'msw/node'
import { adminHandlers } from '@/api/mocks/handlers/admin'

const server = setupServer(...adminHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Admin MSW Handlers', () => {
  it('GET /api/admin/overview returns 200 with correct shape', async () => {
    const res = await fetch('http://localhost:3000/api/admin/overview')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('departmentCount', 10)
    expect(data).toHaveProperty('staffCount', 196)
    expect(data).toHaveProperty('attendanceRate', 0.959)
    expect(data).toHaveProperty('roomCount', 28)
  })

  it('GET /api/admin/notices returns 200 with notice array', async () => {
    const res = await fetch('http://localhost:3000/api/admin/notices')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('notices')
    expect(Array.isArray(data.notices)).toBe(true)
    expect(data.notices.length).toBe(8)
    expect(data.notices[0]).toHaveProperty('id', 'notice-1')
    expect(data.notices[0]).toHaveProperty('title')
    expect(data.notices[0]).toHaveProperty('department')
    expect(data.notices[0]).toHaveProperty('type')
  })

  it('GET /api/admin/calendar returns 200 with thisWeek and holidays', async () => {
    const res = await fetch('http://localhost:3000/api/admin/calendar')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('thisWeek')
    expect(Array.isArray(data.thisWeek)).toBe(true)
    expect(data.thisWeek.length).toBe(5)
    expect(data.thisWeek[0]).toHaveProperty('date', '周一 6/16')
    expect(data).toHaveProperty('holidays')
    expect(data.holidays[0]).toHaveProperty('event', '暑假')
  })
})
