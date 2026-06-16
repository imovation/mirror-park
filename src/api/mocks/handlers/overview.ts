import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const overviewHandlers = [
  http.get(`${BASE}/overview/school-info`, () => {
    return HttpResponse.json({
      landArea: 48700,
      buildingArea: 88000,
      classCount: 60,
      buildingCount: 9,
    })
  }),

  http.get(`${BASE}/overview/personnel`, () => {
    return HttpResponse.json({
      totalTeachers: 196,
      maleCount: 82,
      femaleCount: 114,
      maleRatio: 82 / 196,
      femaleRatio: 114 / 196,
      education: [
        { name: '硕士', value: 52 },
        { name: '本科', value: 138 },
        { name: '博士', value: 2 },
        { name: '其他', value: 4 },
      ],
    })
  }),

  http.get(`${BASE}/overview/teacher-distribution`, () => {
    return HttpResponse.json({
      subjects: [
        { name: '语文', value: 26 }, { name: '数学', value: 26 }, { name: '英语', value: 26 },
        { name: '物理', value: 14 }, { name: '化学', value: 10 }, { name: '生物', value: 12 },
        { name: '道德与法治', value: 14 }, { name: '历史', value: 14 }, { name: '地理', value: 12 },
        { name: '体育', value: 14 }, { name: '信息技术', value: 10 }, { name: '音乐', value: 8 }, { name: '美术', value: 8 },
      ],
      titles: [
        { name: '正高级', value: 3 }, { name: '高级', value: 42 },
        { name: '一级', value: 78 }, { name: '二级', value: 55 }, { name: '三级及未定', value: 18 },
      ],
      ageDistribution: [
        { name: '30岁以下', value: 40 },
        { name: '30-39岁', value: 85 },
        { name: '40-49岁', value: 50 },
        { name: '50岁及以上', value: 21 },
      ],
    })
  }),

  http.get(`${BASE}/overview/student-info`, () => {
    return HttpResponse.json({
      grades: [
        { name: '初一', male: 480, female: 450, total: 930 },
        { name: '初二', male: 470, female: 460, total: 930 },
        { name: '初三', male: 460, female: 480, total: 940 },
      ],
      totalStudents: 2800,
      maleRatio: 1410 / 2800,
      femaleRatio: 1390 / 2800,
    })
  }),

  http.get(`${BASE}/overview/activity`, () => {
    const hours = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
    return HttpResponse.json({
      hours,
      values: [120, 2600, 3800, 3500, 3000, 2800, 1600, 2200, 3300, 3200, 2800, 2200, 1900, 700],
    })
  }),
]
