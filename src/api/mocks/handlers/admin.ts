import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const adminHandlers = [
  http.get(`${BASE}/admin/overview`, () => {
    return HttpResponse.json({
      departmentCount: faker.number.int({ min: 8, max: 20 }),
      staffCount: 348,
      attendanceRate: faker.number.int({ min: 90, max: 99 }) / 100,
      roomCount: faker.number.int({ min: 20, max: 50 }),
    })
  }),

  http.get(`${BASE}/admin/notices`, () => {
    return HttpResponse.json({
      notices: Array.from({ length: 8 }, (_, i) => ({
        id: `notice-${i}`,
        title: faker.helpers.arrayElement([
          '关于2025年教师继续教育报名的通知', '关于做好期末教学检查的通知',
          '关于校园开放日活动的通知', '关于开展消防演练的通知',
          '关于报送年度考核材料的通知', '关于召开教研组长会议的通知',
          '关于更新教职工信息的通知', '关于组织开展学科竞赛的通知',
        ]),
        department: faker.helpers.arrayElement(['教务处', '后勤处', '校办公室', '学生处', '科研处']),
        date: faker.date.recent().toLocaleDateString('zh-CN'),
        type: faker.helpers.arrayElement(['行政', '教学', '活动', '紧急']),
      })),
    })
  }),

  http.get(`${BASE}/admin/duty`, () => {
    return HttpResponse.json({
      staffs: [
        { role: '行政值班', name: faker.person.fullName(), phone: faker.phone.number() },
        { role: '教师值班', name: faker.person.fullName(), phone: faker.phone.number() },
        { role: '安保值班', name: faker.person.fullName(), phone: faker.phone.number() },
        { role: '医务值班', name: faker.person.fullName(), phone: faker.phone.number() },
      ],
    })
  }),

  http.get(`${BASE}/admin/calendar`, () => {
    return HttpResponse.json({
      thisWeek: [
        { date: '周一 6/16', event: '教研组长会议', type: '会议' },
        { date: '周二 6/17', event: '期中考试', type: '考试' },
        { date: '周三 6/18', event: '校园开放日', type: '活动' },
        { date: '周四 6/19', event: '期中考试', type: '考试' },
        { date: '周五 6/20', event: '消防演练', type: '活动' },
      ],
      upcomingEvents: [
        { date: '6/23', event: '高一年级家长会' },
        { date: '6/25', event: '教职工代表大会' },
        { date: '6/28', event: '学期总结大会' },
      ],
      holidays: [
        { date: '7/1-8/31', event: '暑假' },
        { date: '10/1-10/7', event: '国庆假期' },
      ],
    })
  }),

  http.get(`${BASE}/admin/attendance`, () => {
    return HttpResponse.json({
      todayPresent: faker.number.int({ min: 280, max: 348 }),
      todayLeave: faker.number.int({ min: 5, max: 30 }),
      todayAbsent: faker.number.int({ min: 0, max: 10 }),
      departmentRates: [
        { name: '校办公室', value: faker.number.int({ min: 90, max: 100 }) },
        { name: '教务处', value: faker.number.int({ min: 90, max: 100 }) },
        { name: '学生处', value: faker.number.int({ min: 85, max: 100 }) },
        { name: '后勤处', value: faker.number.int({ min: 85, max: 100 }) },
        { name: '科研处', value: faker.number.int({ min: 90, max: 100 }) },
        { name: '财务处', value: faker.number.int({ min: 90, max: 100 }) },
      ],
      monthlyTrend: (() => {
        const days = Array.from({ length: 30 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (29 - i))
          return `${d.getMonth() + 1}/${d.getDate()}`
        })
        return { days, values: days.map(() => faker.number.int({ min: 90, max: 99 })) }
      })(),
    })
  }),

  http.get(`${BASE}/admin/meetings`, () => {
    return HttpResponse.json({
      todayCount: faker.number.int({ min: 1, max: 5 }),
      weekCount: faker.number.int({ min: 5, max: 20 }),
      rooms: [
        { name: '会议室A', status: faker.helpers.arrayElement(['使用中', '空闲', '空闲']) },
        { name: '会议室B', status: faker.helpers.arrayElement(['使用中', '空闲', '空闲']) },
        { name: '报告厅', status: faker.helpers.arrayElement(['空闲', '空闲', '空闲']) },
        { name: '教研活动室', status: faker.helpers.arrayElement(['使用中', '空闲', '使用中']) },
      ],
      upcoming: Array.from({ length: 5 }, (_, i) => ({
        id: `meet-${i}`,
        title: faker.helpers.arrayElement(['教研组周例会', '行政办公会', '班主任工作会', '课题研究讨论', '招生工作会']),
        time: `${faker.number.int({ min: 8, max: 16 })}:00`,
        room: faker.helpers.arrayElement(['会议室A', '会议室B', '报告厅']),
        date: faker.date.future().toLocaleDateString('zh-CN'),
      })),
    })
  }),
]
