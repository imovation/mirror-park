import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const academicsHandlers = [
  http.get(`${BASE}/academics/overview`, () => {
    return HttpResponse.json({
      todayCourses: 98,
      ongoingCourses: 16,
      totalClassrooms: 60,
      usageRate: 0.74,
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
        { name: '语文', value: 15 },
        { name: '数学', value: 16 },
        { name: '英语', value: 14 },
        { name: '物理', value: 9 },
        { name: '化学', value: 6 },
        { name: '生物', value: 7 },
        { name: '道德与法治', value: 8 },
        { name: '历史', value: 7 },
        { name: '地理', value: 5 },
        { name: '体育', value: 9 },
        { name: '信息技术', value: 5 },
        { name: '艺术', value: 6 },
      ],
      timeDistribution: {
        hours: ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'],
        values: [28, 36, 34, 28, 8, 18, 34, 32, 20],
      },
    })
  }),

  http.get(`${BASE}/academics/classroom-usage`, () => {
    return HttpResponse.json({
      inUse: 44,
      available: 16,
      buildingUsage: [
        { name: '崇德楼', value: 72 },
        { name: '崇智楼', value: 64 },
        { name: '崇信楼', value: 70 },
      ],
      typeDistribution: [
        { name: '普通教室', value: 46 },
        { name: '实验室', value: 7 },
        { name: '机房', value: 5 },
        { name: '音乐/美术', value: 3 },
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
      todayRate: 0.972,
      gradeRates: [
        { name: '初一', value: 97.6 },
        { name: '初二', value: 97.1 },
        { name: '初三', value: 96.8 },
      ],
      classRank: [
        { name: '初二(3)班', value: 100 },
        { name: '初一(1)班', value: 99.1 },
        { name: '初二(8)班', value: 98.7 },
        { name: '初三(2)班', value: 98.5 },
        { name: '初一(5)班', value: 98.2 },
        { name: '初三(6)班', value: 97.6 },
        { name: '初二(15)班', value: 97.3 },
        { name: '初一(12)班', value: 96.8 },
        { name: '初三(11)班', value: 96.4 },
        { name: '初一(8)班', value: 95.9 },
      ],
      trend: {
        days,
        values: [96.2,97.1,97.8,97.3,96.5,98.2,97.4,96.8,98.1,97.6,95.8,97.4,98.3,96.7,97.5,98.0,97.2,96.6,98.4,97.3,96.9,97.8,98.2,97.5,96.7,98.5,97.3,96.8,97.9,98.1],
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
        { id: 'exam-6', subject: '历史', date: '2026/6/28', grade: '初一' },
        { id: 'exam-7', subject: '地理', date: '2026/6/28', grade: '初二' },
        { id: 'exam-8', subject: '政治', date: '2026/6/29', grade: '初一' },
        { id: 'exam-9', subject: '生物', date: '2026/6/29', grade: '初二' },
        { id: 'exam-10', subject: '英语', date: '2026/6/30', grade: '初三' },
        { id: 'exam-11', subject: '数学', date: '2026/7/1', grade: '初一' },
        { id: 'exam-12', subject: '语文', date: '2026/7/1', grade: '初二' },
      ],
      semesterExamCount: 6,
      gradeAverages: [
        { name: '初一', value: 78.4 },
        { name: '初二', value: 74.2 },
        { name: '初三', value: 76.7 },
      ],
      scoreDistribution: [
        { name: '90-100', value: 148 },
        { name: '80-89', value: 435 },
        { name: '70-79', value: 548 },
        { name: '60-69', value: 392 },
        { name: '<60', value: 73 },
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
        { id: 'cls-9', name: '初三(7)班', headTeacher: '吴敏', studentCount: 44 },
        { id: 'cls-10', name: '初一(11)班', headTeacher: '郑磊', studentCount: 46 },
      ],
    })
  }),

  http.get(`${BASE}/academics/devices`, () => {
    return HttpResponse.json({
      total: 372,
      online: 351,
      offline: 10,
      faulty: 11,
      typeDistribution: [
        { name: '投影仪', value: 58 },
        { name: '电脑', value: 94 },
        { name: '电子白板', value: 62 },
        { name: '音响设备', value: 38 },
        { name: '录像设备', value: 20 },
        { name: '实验设备', value: 54 },
        { name: '其他', value: 46 },
      ],
    })
  }),
]
