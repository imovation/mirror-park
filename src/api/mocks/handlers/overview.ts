import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const overviewHandlers = [
  http.get(`${BASE}/overview/school-info`, () => {
    return HttpResponse.json({
      landArea: faker.number.int({ min: 50000, max: 200000 }),
      buildingArea: faker.number.int({ min: 30000, max: 100000 }),
      classCount: 62,
      buildingCount: 9,
    })
  }),

  http.get(`${BASE}/overview/personnel`, () => {
    const maleCount = faker.number.int({ min: 100, max: 200 })
    const femaleCount = faker.number.int({ min: 100, max: 200 })
    const total = maleCount + femaleCount

    return HttpResponse.json({
      totalTeachers: total,
      maleRatio: maleCount / total,
      femaleRatio: femaleCount / total,
      education: [
        { name: '博士', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '硕士', value: faker.number.int({ min: 50, max: 100 }) },
        { name: '本科', value: faker.number.int({ min: 150, max: 250 }) },
        { name: '其他', value: faker.number.int({ min: 5, max: 30 }) },
      ],
    })
  }),
]
