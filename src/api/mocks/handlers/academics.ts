import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const academicsHandlers = [
  http.get(`${BASE}/academics/overview`, () => {
    return HttpResponse.json({
      todayCourses: 96,
      activeCourses: 14,
      totalClassrooms: 60,
      usageRate: 0.72,
    })
  }),

  http.get(`${BASE}/academics/schedule`, () => {
    return HttpResponse.json({
      gradeDistribution: [
        { name: '初一', value: 32 },
        { name: '初二', value: 32 },
        { name: '初三', value: 32 },
      ],
      subjectDistribution: [
        { name: '语文', value: 14 },
        { name: '数学', value: 14 },
        { name: '英语', value: 14 },
        { name: '物理', value: 8 },
        { name: '化学', value: 6 },
        { name: '生物', value: 8 },
        { name: '道德与法治', value: 8 },
        { name: '历史', value: 8 },
        { name: '地理', value: 6 },
        { name: '体育', value: 8 },
        { name: '信息技术', value: 6 },
        { name: '艺术', value: 6 },
      ],
      timeDistribution: {
        hours: ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'],
        values: [30, 34, 32, 30, 10, 16, 32, 34, 18],
      },
    })
  }),

  http.get(`${BASE}/academics/classroom-usage`, () => {
    return HttpResponse.json({
      inUse: 42,
      available: 18,
      buildingUsage: [
        { name: '崇德楼', value: 70 },
        { name: '崇智楼', value: 65 },
        { name: '崇信楼', value: 68 },
      ],
      typeDistribution: [
        { name: '普通教室', value: 44 },
        { name: '实验室', value: 6 },
        { name: '机房', value: 4 },
        { name: '音乐/美术', value: 4 },
        { name: '多功能厅', value: 2 },
      ],
    })
  }),

  http.get(`${BASE}/academics/attendance`, () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return `${d.getMonth() + 1}/${d.getDate()}`
    })
    return HttpResponse.json({
      todayRate: 0.974,
      gradeRates: [
        { name: '初一', value: 98 },
        { name: '初二', value: 97 },
        { name: '初三', value: 97 },
      ],
      classRank: [
        { name: '初二(3)班', value: 100 },
        { name: '初一(1)班', value: 99 },
        { name: '初二(8)班', value: 99 },
        { name: '初三(2)班', value: 98 },
        { name: '初一(5)班', value: 98 },
        { name: '初三(6)班', value: 97 },
        { name: '初二(15)班', value: 97 },
        { name: '初一(12)班', value: 96 },
        { name: '初三(11)班', value: 96 },
        { name: '初一(8)班', value: 95 },
      ],
      trend: {
        days,
        values: [96,97,98,97,96,98,97,96,98,97,95,97,98,96,97,98,97,96,98,97,96,97,98,97,96,98,97,96,97,98],
      },
    })
  }),

  http.get(`${BASE}/academics/exam`, () => {
    return HttpResponse.json({
      upcomingExams: [
        { id: 'exam-1', subject: '语文', date: '2026/6/23', grade: '初一' },
        { id: 'exam-2', subject: '数学', date: '2026/6/24', grade: '初二' },
        { id: 'exam-3', subject: '英语', date: '2026/6/25', grade: '初三' },
        { id: 'exam-4', subject: '物理', date: '2026/6/26', grade: '初二' },
        { id: 'exam-5', subject: '化学', date: '2026/6/27', grade: '初三' },
      ],
      semesterExamCount: 5,
      gradeAverages: [
        { name: '初一', value: 78 },
        { name: '初二', value: 74 },
        { name: '初三', value: 76 },
      ],
      scoreDistribution: [
        { name: '90-100', value: 152 },
        { name: '80-89', value: 420 },
        { name: '70-79', value: 560 },
        { name: '60-69', value: 380 },
        { name: '<60', value: 68 },
      ],
    })
  }),

  http.get(`${BASE}/academics/classes`, () => {
    return HttpResponse.json({
      totalClasses: 60,
      gradeClasses: [
        { name: '初一', count: 20 },
        { name: '初二', count: 20 },
        { name: '初三', count: 20 },
      ],
      classList: [
        { id: 'cls-1', name: '初一(1)班', headTeacher: '陈明', studentCount: 47 },
        { id: 'cls-2', name: '初二(3)班', headTeacher: '李华', studentCount: 46 },
        { id: 'cls-3', name: '初三(2)班', headTeacher: '张伟', studentCount: 47 },
        { id: 'cls-4', name: '初一(8)班', headTeacher: '王芳', studentCount: 45 },
        { id: 'cls-5', name: '初二(8)班', headTeacher: '刘洋', studentCount: 47 },
        { id: 'cls-6', name: '初三(11)班', headTeacher: '赵雪', studentCount: 46 },
        { id: 'cls-7', name: '初一(15)班', headTeacher: '孙涛', studentCount: 48 },
        { id: 'cls-8', name: '初二(20)班', headTeacher: '周静', studentCount: 47 },
      ],
    })
  }),

  http.get(`${BASE}/academics/devices`, () => {
    return HttpResponse.json({
      total: 360,
      online: 340,
      offline: 8,
      faulty: 12,
      typeDistribution: [
        { name: '投影仪', value: 56 },
        { name: '电脑', value: 90 },
        { name: '电子白板', value: 60 },
        { name: '音响设备', value: 40 },
        { name: '录像设备', value: 18 },
        { name: '实验设备', value: 56 },
        { name: '其他', value: 40 },
      ],
    })
  }),
]
