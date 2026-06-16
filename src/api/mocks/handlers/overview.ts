import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const overviewHandlers = [
  http.get(`${BASE}/overview/school-info`, () => {
    return HttpResponse.json({
      landArea: 86700,
      buildingArea: 52000,
      classCount: 62,
      buildingCount: 9,
    })
  }),

  http.get(`${BASE}/overview/personnel`, () => {
    return HttpResponse.json({
      totalTeachers: 348,
      maleCount: 146,
      femaleCount: 202,
      maleRatio: 146 / 348,
      femaleRatio: 202 / 348,
      education: [
        { name: '硕士', value: 86 },
        { name: '本科', value: 252 },
        { name: '博士', value: 6 },
        { name: '其他', value: 4 },
      ],
    })
  }),

  http.get(`${BASE}/overview/teacher-distribution`, () => {
    return HttpResponse.json({
      subjects: [
        { name: '语文', value: 48 }, { name: '数学', value: 46 }, { name: '英语', value: 44 },
        { name: '物理', value: 32 }, { name: '化学', value: 28 }, { name: '生物', value: 22 },
        { name: '政治', value: 20 }, { name: '历史', value: 20 }, { name: '地理', value: 18 },
        { name: '体育', value: 16 }, { name: '信息技术', value: 10 }, { name: '艺术', value: 12 },
      ],
      titles: [
        { name: '正高级', value: 8 }, { name: '高级', value: 72 },
        { name: '一级', value: 138 }, { name: '二级', value: 106 }, { name: '三级及未定', value: 24 },
      ],
      ageDistribution: [
        { name: '30岁以下', value: 62 },
        { name: '30-39岁', value: 128 },
        { name: '40-49岁', value: 106 },
        { name: '50岁及以上', value: 52 },
      ],
    })
  }),

  http.get(`${BASE}/overview/student-info`, () => {
    return HttpResponse.json({
      grades: [
        { name: '高一', male: 710, female: 660, total: 1370 },
        { name: '高二', male: 690, female: 650, total: 1340 },
        { name: '高三', male: 680, female: 640, total: 1320 },
      ],
      totalStudents: 4030,
      maleRatio: 2080 / 4030,
      femaleRatio: 1950 / 4030,
    })
  }),

  http.get(`${BASE}/overview/activity`, () => {
    const hours = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
    return HttpResponse.json({
      hours,
      values: [120, 2800, 4100, 3800, 3200, 2900, 1800, 2200, 3600, 3500, 3000, 2400, 2100, 800],
    })
  }),

  http.get(`${BASE}/overview/facilities`, () => {
    return HttpResponse.json({
      buildings: [
        { name: '教学楼A栋', floors: 5, area: 6200, type: '教学' },
        { name: '教学楼B栋', floors: 5, area: 5800, type: '教学' },
        { name: '教学楼C栋', floors: 5, area: 5600, type: '教学' },
        { name: '行政综合楼', floors: 6, area: 4800, type: '行政' },
        { name: '图书馆', floors: 3, area: 3200, type: '图书' },
        { name: '实验楼', floors: 4, area: 4500, type: '实验' },
        { name: '体育馆', floors: 2, area: 3800, type: '体育' },
        { name: '食堂', floors: 2, area: 2800, type: '餐饮' },
        { name: '学生宿舍', floors: 6, area: 8200, type: '宿舍' },
      ],
      sports: [
        { name: '标准田径场', count: 1 },
        { name: '篮球场', count: 8 },
        { name: '排球场', count: 4 },
        { name: '羽毛球场', count: 6 },
        { name: '乒乓球台', count: 20 },
        { name: '网球场', count: 2 },
      ],
    })
  }),
]
