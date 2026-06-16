import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const libraryHandlers = [
  http.get(`${BASE}/library/collection`, () => {
    return HttpResponse.json({
      paperBooks: faker.number.int({ min: 100000, max: 120000 }),
      ebooks: faker.number.int({ min: 5000, max: 30000 }),
      journals: faker.number.int({ min: 100, max: 500 }),
      newspapers: faker.number.int({ min: 30, max: 100 }),
    })
  }),

  http.get(`${BASE}/library/borrow-stats`, () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return `${d.getMonth() + 1}/${d.getDate()}`
    })
    return HttpResponse.json({
      todayBorrow: faker.number.int({ min: 0, max: 30 }),
      todayReturn: faker.number.int({ min: 0, max: 25 }),
      totalBorrowed: faker.number.int({ min: 500, max: 2000 }),
      overdue: faker.number.int({ min: 10, max: 100 }),
      trend: {
        days,
        borrow: days.map(() => faker.number.int({ min: 0, max: 40 })),
        return: days.map(() => faker.number.int({ min: 0, max: 35 })),
      },
    })
  }),

  http.get(`${BASE}/library/hot-books`, () => {
    const categories = ['文学', '社科', '自然科学', '艺术', '历史', '教育', '计算机']
    return HttpResponse.json({
      top10: Array.from({ length: 10 }, (_, i) => ({
        name: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
        author: faker.person.fullName(),
        count: faker.number.int({ min: 200, max: 800 }),
      })).sort((a, b) => b.count - a.count),
      categoryRatio: categories.map((name) => ({
        name,
        value: faker.number.int({ min: 5, max: 40 }),
      })),
      recommendBooks: Array.from({ length: 5 }, () => ({
        name: faker.lorem.words(3),
        author: faker.person.fullName(),
        cover: '',
      })),
    })
  }),

  http.get(`${BASE}/library/class-rank`, () => {
    return HttpResponse.json({
      classRank: Array.from({ length: 10 }, (_, i) => ({
        name: `高一(${i + 1})班`,
        value: faker.number.int({ min: 50, max: 200 }),
      })).sort((a, b) => b.value - a.value),
      gradeComparison: [
        { name: '高一', value: faker.number.int({ min: 1000, max: 3000 }) },
        { name: '高二', value: faker.number.int({ min: 1000, max: 3000 }) },
        { name: '高三', value: faker.number.int({ min: 800, max: 2500 }) },
      ],
      readingStars: Array.from({ length: 5 }, () => ({
        name: faker.person.fullName(),
        className: faker.helpers.arrayElement(['高一(1)班', '高二(3)班', '高三(5)班']),
        count: faker.number.int({ min: 30, max: 80 }),
      })),
    })
  }),

  http.get(`${BASE}/library/activities`, () => {
    return HttpResponse.json({
      activities: Array.from({ length: 6 }, (_, i) => ({
        id: `act-${i}`,
        title: faker.helpers.arrayElement([
          '校园读书节活动', '阅读分享会', '新书推荐展览', '阅读之星评选',
          '经典诵读大赛', '图书漂流活动', '作家进校园讲座', '读书笔记展评',
        ]),
        date: faker.date.future().toLocaleDateString('zh-CN'),
        status: faker.helpers.arrayElement(['进行中', '即将开始', '已结束']),
      })),
    })
  }),

  http.get(`${BASE}/library/visitors`, () => {
    const hours = Array.from({ length: 14 }, (_, i) => `${i + 6}:00`)
    return HttpResponse.json({
      todayVisitors: faker.number.int({ min: 100, max: 500 }),
      currentVisitors: faker.number.int({ min: 20, max: 150 }),
      hourlyDistribution: {
        hours,
        values: hours.map(() => faker.number.int({ min: 0, max: 80 })),
      },
    })
  }),
]
