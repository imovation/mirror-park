import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const academicsHandlers = [
  http.get(`${BASE}/academics/overview`, () => {
    return HttpResponse.json({
      todayCourses: faker.number.int({ min: 80, max: 150 }),
      ongoingCourses: faker.number.int({ min: 10, max: 50 }),
      totalClassrooms: faker.number.int({ min: 60, max: 100 }),
      usageRate: faker.number.int({ min: 50, max: 95 }) / 100,
    })
  }),

  http.get(`${BASE}/academics/schedule`, () => {
    return HttpResponse.json({
      gradeDistribution: [
        { name: '高一', value: faker.number.int({ min: 30, max: 60 }) },
        { name: '高二', value: faker.number.int({ min: 30, max: 60 }) },
        { name: '高三', value: faker.number.int({ min: 25, max: 50 }) },
      ],
      subjectDistribution: [
        { name: '语文', value: faker.number.int({ min: 10, max: 25 }) },
        { name: '数学', value: faker.number.int({ min: 10, max: 25 }) },
        { name: '英语', value: faker.number.int({ min: 10, max: 25 }) },
        { name: '物理', value: faker.number.int({ min: 5, max: 15 }) },
        { name: '化学', value: faker.number.int({ min: 5, max: 15 }) },
        { name: '生物', value: faker.number.int({ min: 5, max: 12 }) },
        { name: '史政地', value: faker.number.int({ min: 8, max: 20 }) },
      ],
      timeDistribution: (() => {
        const hours = Array.from({ length: 9 }, (_, i) => `${i + 8}:00`)
        return { hours, values: hours.map((_, i) => i < 3 || i > 7 ? faker.number.int({ min: 5, max: 20 }) : faker.number.int({ min: 20, max: 40 })) }
      })(),
    })
  }),

  http.get(`${BASE}/academics/classroom-usage`, () => {
    const buildings = ['1号楼', '2号楼', '3号楼', '4号楼']
    return HttpResponse.json({
      inUse: faker.number.int({ min: 30, max: 70 }),
      available: faker.number.int({ min: 10, max: 40 }),
      buildingUsage: buildings.map((name) => ({ name, value: faker.number.int({ min: 40, max: 95 }) })),
      typeDistribution: [
        { name: '普通教室', value: faker.number.int({ min: 30, max: 50 }) },
        { name: '实验室', value: faker.number.int({ min: 5, max: 15 }) },
        { name: '机房', value: faker.number.int({ min: 3, max: 10 }) },
        { name: '音乐/美术', value: faker.number.int({ min: 3, max: 8 }) },
        { name: '多功能厅', value: faker.number.int({ min: 2, max: 5 }) },
      ],
    })
  }),

  http.get(`${BASE}/academics/attendance`, () => {
    return HttpResponse.json({
      todayRate: faker.number.int({ min: 93, max: 99 }) / 100,
      gradeRates: [
        { name: '高一', value: faker.number.int({ min: 93, max: 99 }) },
        { name: '高二', value: faker.number.int({ min: 93, max: 99 }) },
        { name: '高三', value: faker.number.int({ min: 94, max: 99 }) },
      ],
      classRank: Array.from({ length: 10 }, (_, i) => ({
        name: `高一(${i + 1})班`,
        value: faker.number.int({ min: 90, max: 100 }),
      })).sort((a, b) => b.value - a.value),
      trend: (() => {
        const days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (29 - i))
          return `${d.getMonth() + 1}/${d.getDate()}`
        })
        return { days, values: days.map(() => faker.number.int({ min: 93, max: 99 })) }
      })(),
    })
  }),

  http.get(`${BASE}/academics/exam`, () => {
    return HttpResponse.json({
      upcomingExams: Array.from({ length: 4 }, (_, i) => ({
        id: `exam-${i}`,
        subject: faker.helpers.arrayElement(['语文', '数学', '英语', '物理', '化学', '生物']),
        date: faker.date.future().toLocaleDateString('zh-CN'),
        grade: faker.helpers.arrayElement(['高一', '高二', '高三']),
      })),
      semesterExamCount: faker.number.int({ min: 2, max: 8 }),
      gradeAverages: [
        { name: '高一', value: faker.number.int({ min: 65, max: 85 }) },
        { name: '高二', value: faker.number.int({ min: 60, max: 80 }) },
        { name: '高三', value: faker.number.int({ min: 60, max: 80 }) },
      ],
      scoreDistribution: [
        { name: '90-100', value: faker.number.int({ min: 50, max: 200 }) },
        { name: '80-89', value: faker.number.int({ min: 100, max: 400 }) },
        { name: '70-79', value: faker.number.int({ min: 100, max: 400 }) },
        { name: '60-69', value: faker.number.int({ min: 50, max: 250 }) },
        { name: '<60', value: faker.number.int({ min: 10, max: 100 }) },
      ],
    })
  }),

  http.get(`${BASE}/academics/classes`, () => {
    const gradeNames = ['高一', '高二', '高三']
    return HttpResponse.json({
      totalClasses: 62,
      gradeClasses: gradeNames.map((name) => ({
        name,
        count: name === '高三' ? faker.number.int({ min: 18, max: 22 }) : faker.number.int({ min: 18, max: 22 }),
      })),
      classList: Array.from({ length: 8 }, (_, i) => ({
        id: `cls-${i}`,
        name: `${faker.helpers.arrayElement(gradeNames)}(${faker.number.int({ min: 1, max: 22 })})班`,
        headTeacher: faker.person.fullName(),
        studentCount: faker.number.int({ min: 40, max: 55 }),
      })),
    })
  }),

  http.get(`${BASE}/academics/devices`, () => {
    const total = faker.number.int({ min: 300, max: 600 })
    const online = faker.number.int({ min: 250, max: total - 10 })
    const faulty = faker.number.int({ min: 5, max: 30 })
    const offline = total - online - faulty
    return HttpResponse.json({
      total,
      online,
      offline,
      faulty,
      typeDistribution: [
        { name: '投影仪', value: faker.number.int({ min: 50, max: 100 }) },
        { name: '电脑', value: faker.number.int({ min: 60, max: 120 }) },
        { name: '电子白板', value: faker.number.int({ min: 40, max: 80 }) },
        { name: '音响设备', value: faker.number.int({ min: 30, max: 60 }) },
        { name: '录像设备', value: faker.number.int({ min: 10, max: 30 }) },
      ],
    })
  }),
]
