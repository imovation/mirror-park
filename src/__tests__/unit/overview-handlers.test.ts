import { setupServer } from 'msw/node'
import { overviewHandlers } from '@/api/mocks/handlers/overview'

const server = setupServer(...overviewHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Overview MSW Handlers', () => {
  it('GET /api/overview/school-info returns 200 with correct shape', async () => {
    const res = await fetch('http://localhost:3000/api/overview/school-info')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('landArea', 48700)
    expect(data).toHaveProperty('buildingArea', 88000)
    expect(data).toHaveProperty('classCount', 60)
    expect(data).toHaveProperty('buildingCount', 9)
    expect(data).toHaveProperty('totalTeachers', 196)
    expect(data).toHaveProperty('totalStudents', 2800)
  })

  it('GET /api/overview/assets returns 200 with correct values', async () => {
    const res = await fetch('http://localhost:3000/api/overview/assets')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('computers', 680)
    expect(data).toHaveProperty('projectors', 72)
    expect(data).toHaveProperty('airConditioners', 320)
    expect(data).toHaveProperty('cameras', 420)
    expect(data).toHaveProperty('printers', 36)
    expect(data).toHaveProperty('doorLocks', 240)
  })

  it('GET /api/overview/personnel returns 200 with education array', async () => {
    const res = await fetch('http://localhost:3000/api/overview/personnel')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalTeachers', 196)
    expect(data).toHaveProperty('maleRatio', 82 / 196)
    expect(data).toHaveProperty('education')
    expect(Array.isArray(data.education)).toBe(true)
    expect(data.education.length).toBeGreaterThan(0)
  })
})
