import { setupServer } from 'msw/node'
import { academicsHandlers } from '@/api/mocks/handlers/academics'

const server = setupServer(...academicsHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

describe('Academics MSW Handlers', () => {
  it('GET /api/academics/overview returns 200 with correct values', async () => {
    const res = await fetch('http://localhost:3000/api/academics/overview')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('todayCourses', 98)
    expect(data).toHaveProperty('ongoingCourses', 16)
    expect(data).toHaveProperty('totalClassrooms', 60)
    expect(data).toHaveProperty('usageRate', 0.74)
  })

  it('GET /api/academics/exam returns 200 with upcoming exams and score distribution', async () => {
    const res = await fetch('http://localhost:3000/api/academics/exam')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('upcomingExams')
    expect(Array.isArray(data.upcomingExams)).toBe(true)
    expect(data.upcomingExams.length).toBe(12)
    expect(data.upcomingExams[0]).toHaveProperty('subject', '语文')
    expect(data).toHaveProperty('semesterExamCount', 6)
    expect(data).toHaveProperty('scoreDistribution')
    expect(Array.isArray(data.scoreDistribution)).toBe(true)
    expect(data.scoreDistribution.length).toBe(5)
  })

  it('GET /api/academics/classes returns 200 with totalClasses', async () => {
    const res = await fetch('http://localhost:3000/api/academics/classes')
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalClasses', 60)
    expect(data).toHaveProperty('classList')
    expect(Array.isArray(data.classList)).toBe(true)
    expect(data.classList.length).toBe(10)
    expect(data.classList[0]).toHaveProperty('id', 'cls-1')
    expect(data.classList[0]).toHaveProperty('name', '初一(1)班')
  })
})
