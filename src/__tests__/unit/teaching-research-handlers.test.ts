import { setupServer } from 'msw/node'
import { teachingResearchHandlers } from '@/api/mocks/handlers/teaching-research'

const server = setupServer(...teachingResearchHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Teaching Research MSW Handlers', () => {
  it('GET /api/teaching-research/resources returns 200 with correct shape', async () => {
    const res = await fetch('http://localhost:3000/api/teaching-research/resources')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('resources')
    expect(Array.isArray(data.resources)).toBe(true)
    expect(data.resources[0]).toHaveProperty('name')
    expect(data.resources[0]).toHaveProperty('value')
    expect(data.resources[0]).toHaveProperty('color')
  })

  it('GET /api/teaching-research/resource-stats returns 200 with correct values', async () => {
    const res = await fetch('http://localhost:3000/api/teaching-research/resource-stats')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalResources', 6500)
    expect(data).toHaveProperty('cloudQuestions', 1840)
    expect(data).toHaveProperty('cloudResources', 3200)
    expect(data).toHaveProperty('recentUpdates', 48)
  })

  it('GET /api/teaching-research/studios returns 200 with studio array', async () => {
    const res = await fetch('http://localhost:3000/api/teaching-research/studios')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('studios')
    expect(Array.isArray(data.studios)).toBe(true)
    expect(data.studios.length).toBe(6)
    expect(data.studios[0]).toHaveProperty('id', 'studio-0')
    expect(data.studios[0]).toHaveProperty('name', '语文名师工作室')
    expect(data.studios[0]).toHaveProperty('host', '张明华')
  })
})
