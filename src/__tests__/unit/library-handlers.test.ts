import { setupServer } from 'msw/node'
import { libraryHandlers } from '@/api/mocks/handlers/library'

const server = setupServer(...libraryHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Library MSW Handlers', () => {
  it('GET /api/library/collection returns 200 with correct values', async () => {
    const res = await fetch('http://localhost:3000/api/library/collection')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('paperBooks', 102580)
    expect(data).toHaveProperty('ebooks', 6200)
    expect(data).toHaveProperty('journals', 132)
    expect(data).toHaveProperty('newspapers', 28)
  })

  it('GET /api/library/hot-books returns 200 with top10 array', async () => {
    const res = await fetch('http://localhost:3000/api/library/hot-books')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('top10')
    expect(Array.isArray(data.top10)).toBe(true)
    expect(data.top10.length).toBe(10)
    expect(data.top10[0]).toHaveProperty('name', '三体')
    expect(data.top10[0]).toHaveProperty('author', '刘慈欣')
    expect(data.top10[0]).toHaveProperty('count', 482)
    expect(data).toHaveProperty('categoryRatio')
    expect(data).toHaveProperty('recommendBooks')
  })

  it('GET /api/library/visitors returns 200 with hourly distribution', async () => {
    const res = await fetch('http://localhost:3000/api/library/visitors')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('todayVisitors', 353)
    expect(data).toHaveProperty('currentVisitors', 68)
    expect(data).toHaveProperty('hourlyDistribution')
    expect(data.hourlyDistribution).toHaveProperty('hours')
    expect(data.hourlyDistribution).toHaveProperty('values')
  })
})
