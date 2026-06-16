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
      maleCount,
      femaleCount,
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

  http.get(`${BASE}/overview/teacher-distribution`, () => {
    return HttpResponse.json({
      subjects: [
        { name: '语文', value: faker.number.int({ min: 30, max: 60 }) },
        { name: '数学', value: faker.number.int({ min: 30, max: 60 }) },
        { name: '英语', value: faker.number.int({ min: 30, max: 60 }) },
        { name: '物理', value: faker.number.int({ min: 20, max: 40 }) },
        { name: '化学', value: faker.number.int({ min: 15, max: 35 }) },
        { name: '生物', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '政治', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '历史', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '地理', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '体育', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '信息技术', value: faker.number.int({ min: 5, max: 15 }) },
      ],
      titles: [
        { name: '正高级', value: faker.number.int({ min: 3, max: 10 }) },
        { name: '高级', value: faker.number.int({ min: 40, max: 80 }) },
        { name: '一级', value: faker.number.int({ min: 80, max: 150 }) },
        { name: '二级', value: faker.number.int({ min: 50, max: 100 }) },
        { name: '三级及未定', value: faker.number.int({ min: 10, max: 30 }) },
      ],
    })
  }),

  http.get(`${BASE}/overview/student-info`, () => {
    const grades = ['高一', '高二', '高三']
    const male = grades.map(() => faker.number.int({ min: 600, max: 800 }))
    const female = grades.map(() => faker.number.int({ min: 500, max: 700 }))

    return HttpResponse.json({
      grades: grades.map((name, i) => ({
        name,
        male: male[i],
        female: female[i],
        total: male[i] + female[i],
      })),
    })
  }),

  http.get(`${BASE}/overview/activity`, () => {
    const hours = Array.from({ length: 14 }, (_, i) => `${i + 6}:00`)
    return HttpResponse.json({
      hours,
      values: hours.map(() => faker.number.int({ min: 0, max: 5000 })),
    })
  }),
]
