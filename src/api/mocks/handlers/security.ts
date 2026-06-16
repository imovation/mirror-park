import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const securityHandlers = [
  http.get(`${BASE}/security/overview`, () => {
    return HttpResponse.json({
      cameraCount: faker.number.int({ min: 200, max: 500 }),
      accessDeviceCount: faker.number.int({ min: 20, max: 60 }),
      todayAlerts: faker.number.int({ min: 0, max: 15 }),
      todayVisitors: faker.number.int({ min: 10, max: 100 }),
    })
  }),

  http.get(`${BASE}/security/monitor`, () => {
    const online = faker.number.int({ min: 180, max: 450 })
    const offline = faker.number.int({ min: 0, max: 20 })
    const faulty = faker.number.int({ min: 0, max: 10 })
    const total = online + offline + faulty
    return HttpResponse.json({
      total,
      online,
      offline,
      faulty,
      regionDistribution: [
        { name: '教学区', value: faker.number.int({ min: 50, max: 150 }) },
        { name: '行政区', value: faker.number.int({ min: 20, max: 50 }) },
        { name: '宿舍区', value: faker.number.int({ min: 30, max: 80 }) },
        { name: '运动区', value: faker.number.int({ min: 10, max: 40 }) },
        { name: '食堂区', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '校园周边', value: faker.number.int({ min: 20, max: 60 }) },
      ],
      coverage: faker.number.int({ min: 75, max: 98 }) / 100,
    })
  }),

  http.get(`${BASE}/security/access`, () => {
    const hours = Array.from({ length: 14 }, (_, i) => `${i + 6}:00`)
    return HttpResponse.json({
      todayTotal: faker.number.int({ min: 3000, max: 8000 }),
      points: [
        { name: '南门', value: faker.number.int({ min: 500, max: 2000 }) },
        { name: '北门', value: faker.number.int({ min: 300, max: 1500 }) },
        { name: '西门', value: faker.number.int({ min: 200, max: 1000 }) },
        { name: '行政楼', value: faker.number.int({ min: 100, max: 800 }) },
        { name: '教学楼', value: faker.number.int({ min: 500, max: 2000 }) },
        { name: '图书馆', value: faker.number.int({ min: 300, max: 1200 }) },
      ],
      hourlyDistribution: { hours, values: hours.map(() => faker.number.int({ min: 0, max: 800 })) },
      abnormalRecords: Array.from({ length: 6 }, (_, i) => ({
        id: `abn-${i}`,
        time: `${faker.number.int({ min: 6, max: 22 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
        location: faker.helpers.arrayElement(['南门', '北门', '行政楼', '教学楼']),
        type: faker.helpers.arrayElement(['未授权通行', '重复刷卡', '超时逗留', '无效卡号']),
        status: faker.helpers.arrayElement(['已处理', '处理中']),
      })),
    })
  }),

  http.get(`${BASE}/security/leave`, () => {
    return HttpResponse.json({
      todayTotal: faker.number.int({ min: 10, max: 60 }),
      typeDistribution: [
        { name: '事假', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '病假', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '其他', value: faker.number.int({ min: 1, max: 10 }) },
      ],
      gradeDistribution: [
        { name: '高一', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '高二', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '高三', value: faker.number.int({ min: 3, max: 15 }) },
      ],
      records: Array.from({ length: 8 }, (_, i) => ({
        id: `leave-${i}`,
        name: faker.person.fullName(),
        className: faker.helpers.arrayElement(['高一(1)班', '高二(3)班', '高三(5)班']),
        type: faker.helpers.arrayElement(['事假', '病假']),
        time: `${faker.number.int({ min: 8, max: 17 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
      })),
    })
  }),

  http.get(`${BASE}/security/visitor`, () => {
    return HttpResponse.json({
      todayVisitors: faker.number.int({ min: 10, max: 100 }),
      currentVisitors: faker.number.int({ min: 2, max: 30 }),
      purposeDistribution: [
        { name: '办事', value: faker.number.int({ min: 10, max: 30 }) },
        { name: '参观交流', value: faker.number.int({ min: 5, max: 20 }) },
        { name: '会议', value: faker.number.int({ min: 5, max: 15 }) },
        { name: '家长来访', value: faker.number.int({ min: 5, max: 15 }) },
        { name: '其他', value: faker.number.int({ min: 1, max: 10 }) },
      ],
      records: Array.from({ length: 6 }, (_, i) => ({
        id: `vis-${i}`,
        name: faker.person.fullName(),
        time: `${faker.number.int({ min: 8, max: 17 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
        purpose: faker.helpers.arrayElement(['办事', '参观交流', '会议', '家长来访']),
        idNumber: faker.string.alphanumeric(18),
      })),
    })
  }),

  http.get(`${BASE}/security/alerts`, () => {
    return HttpResponse.json({
      todayTotal: faker.number.int({ min: 0, max: 15 }),
      typeDistribution: [
        { name: '周界入侵', value: faker.number.int({ min: 0, max: 5 }) },
        { name: '火警预警', value: faker.number.int({ min: 0, max: 3 }) },
        { name: '设备异常', value: faker.number.int({ min: 0, max: 5 }) },
        { name: '门禁告警', value: faker.number.int({ min: 0, max: 5 }) },
        { name: '异常聚集', value: faker.number.int({ min: 0, max: 3 }) },
      ],
      handledRatio: faker.number.int({ min: 60, max: 100 }) / 100,
      unhandledRatio: 0,
      records: Array.from({ length: 8 }, (_, i) => ({
        id: `alert-${i}`,
        time: `${faker.number.int({ min: 6, max: 22 })}:${faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0')}`,
        type: faker.helpers.arrayElement(['周界入侵', '设备异常', '门禁告警', '火警预警']),
        location: faker.helpers.arrayElement(['南围墙', '体育馆', '行政楼', '教学楼A区', '宿舍楼1单元']),
        status: faker.helpers.arrayElement(['已处理', '处理中', '未处理']),
      })),
    })
  }),

  http.get(`${BASE}/security/canteen`, () => {
    return HttpResponse.json({
      todayTotal: faker.number.int({ min: 3000, max: 6000 }),
      meals: [
        { name: '早餐', value: faker.number.int({ min: 1000, max: 2000 }) },
        { name: '午餐', value: faker.number.int({ min: 1500, max: 3000 }) },
        { name: '晚餐', value: faker.number.int({ min: 800, max: 2000 }) },
      ],
      safetyRecords: Array.from({ length: 4 }, (_, i) => ({
        id: `safe-${i}`,
        date: faker.date.recent().toLocaleDateString('zh-CN'),
        item: faker.helpers.arrayElement(['食材抽检', '卫生检查', '留样检测', '操作规范检查']),
        result: faker.helpers.arrayElement(['合格', '合格', '合格', '合格']),
      })),
    })
  }),
]
