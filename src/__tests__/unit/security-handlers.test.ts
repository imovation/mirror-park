import { setupServer } from 'msw/node'
import { securityHandlers } from '@/api/mocks/handlers/security'

const server = setupServer(...securityHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Security MSW Handlers', () => {
  it('GET /api/security/overview returns 200 with correct values', async () => {
    const res = await fetch('http://localhost:3000/api/security/overview')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('cameraCount', 256)
    expect(data).toHaveProperty('accessDeviceCount', 36)
    expect(data).toHaveProperty('todayAlerts', 3)
    expect(data).toHaveProperty('todayVisitors', 32)
  })

  it('GET /api/security/access returns 200 with points and abnormal records', async () => {
    const res = await fetch('http://localhost:3000/api/security/access')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('todayTotal', 5410)
    expect(data).toHaveProperty('points')
    expect(Array.isArray(data.points)).toBe(true)
    expect(data.points.length).toBe(6)
    expect(data.points[0]).toHaveProperty('name', '南门')
    expect(data).toHaveProperty('abnormalRecords')
    expect(Array.isArray(data.abnormalRecords)).toBe(true)
    expect(data.abnormalRecords.length).toBe(6)
  })

  it('GET /api/security/alerts returns 200 with todayTotal and records', async () => {
    const res = await fetch('http://localhost:3000/api/security/alerts')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('todayTotal', 3)
    expect(data).toHaveProperty('typeDistribution')
    expect(Array.isArray(data.typeDistribution)).toBe(true)
    expect(data).toHaveProperty('records')
    expect(data.records.length).toBe(3)
    expect(data.records[0]).toHaveProperty('id', 'alert-1')
  })
})
