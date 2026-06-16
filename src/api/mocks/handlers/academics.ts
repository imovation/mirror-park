import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const academicsHandlers = [
  http.get(`${BASE}/academics/overview`, () => {
    return HttpResponse.json({
      todayCourses: 124,
      ongoingCourses: 18,
      totalClassrooms: 72,
      usageRate: 0.68,
    })
  }),

  http.get(`${BASE}/academics/schedule`, () => {
    return HttpResponse.json({
      gradeDistribution: [
        { name: '高一', value: 42 },
        { name: '高二', value: 40 },
        { name: '高三', value: 42 },
      ],
      subjectDistribution: [
        { name: '语文', value: 18 },
        { name: '数学', value: 18 },
        { name: '英语', value: 16 },
        { name: '物理', value: 10 },
        { name: '化学', value: 10 },
        { name: '生物', value: 8 },
        { name: '史政地', value: 14 },
        { name: '体育', value: 8 },
        { name: '信息技术', value: 6 },
        { name: '艺术', value: 6 },
        { name: '其他', value: 10 },
      ],
      timeDistribution: {
        hours: ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'],
        values: [38, 42, 40, 38, 12, 18, 40, 42, 20],
      },
    })
  }),

  http.get(`${BASE}/academics/classroom-usage`, () => {
    return HttpResponse.json({
      inUse: 48,
      available: 24,
      buildingUsage: [
        { name: '1号楼', value: 72 },
        { name: '2号楼', value: 65 },
        { name: '3号楼', value: 68 },
        { name: '4号楼', value: 55 },
      ],
      typeDistribution: [
        { name: '普通教室', value: 48 },
        { name: '实验室', value: 10 },
        { name: '机房', value: 6 },
        { name: '音乐/美术', value: 5 },
        { name: '多功能厅', value: 3 },
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
        { name: '高一', value: 97 },
        { name: '高二', value: 98 },
        { name: '高三', value: 96 },
      ],
      classRank: [
        { name: '高二(3)班', value: 100 },
        { name: '高一(1)班', value: 99 },
        { name: '高二(8)班', value: 99 },
        { name: '高三(2)班', value: 98 },
        { name: '高一(5)班', value: 98 },
        { name: '高三(6)班', value: 97 },
        { name: '高二(15)班', value: 97 },
        { name: '高一(12)班', value: 96 },
        { name: '高三(11)班', value: 96 },
        { name: '高一(8)班', value: 95 },
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
        { id: 'exam-1', subject: '语文', date: '2026/6/23', grade: '高一' },
        { id: 'exam-2', subject: '数学', date: '2026/6/24', grade: '高二' },
        { id: 'exam-3', subject: '英语', date: '2026/6/25', grade: '高三' },
        { id: 'exam-4', subject: '物理', date: '2026/6/26', grade: '高一' },
        { id: 'exam-5', subject: '化学', date: '2026/6/27', grade: '高二' },
      ],
      semesterExamCount: 6,
      gradeAverages: [
        { name: '高一', value: 78 },
        { name: '高二', value: 74 },
        { name: '高三', value: 76 },
      ],
      scoreDistribution: [
        { name: '90-100', value: 186 },
        { name: '80-89', value: 520 },
        { name: '70-79', value: 680 },
        { name: '60-69', value: 420 },
        { name: '<60', value: 84 },
      ],
    })
  }),

  http.get(`${BASE}/academics/classes`, () => {
    return HttpResponse.json({
      totalClasses: 62,
      gradeClasses: [
        { name: '高一', count: 21 },
        { name: '高二', count: 21 },
        { name: '高三', count: 20 },
      ],
      classList: [
        { id: 'cls-1', name: '高一(1)班', headTeacher: '陈明', studentCount: 48 },
        { id: 'cls-2', name: '高二(3)班', headTeacher: '李华', studentCount: 50 },
        { id: 'cls-3', name: '高三(2)班', headTeacher: '张伟', studentCount: 46 },
        { id: 'cls-4', name: '高一(8)班', headTeacher: '王芳', studentCount: 49 },
        { id: 'cls-5', name: '高二(8)班', headTeacher: '刘洋', studentCount: 47 },
        { id: 'cls-6', name: '高三(11)班', headTeacher: '赵雪', studentCount: 45 },
        { id: 'cls-7', name: '高一(15)班', headTeacher: '孙涛', studentCount: 51 },
        { id: 'cls-8', name: '高二(20)班', headTeacher: '周静', studentCount: 48 },
      ],
    })
  }),

  http.get(`${BASE}/academics/devices`, () => {
    return HttpResponse.json({
      total: 480,
      online: 452,
      offline: 12,
      faulty: 16,
      typeDistribution: [
        { name: '投影仪', value: 68 },
        { name: '电脑', value: 120 },
        { name: '电子白板', value: 72 },
        { name: '音响设备', value: 52 },
        { name: '录像设备', value: 24 },
        { name: '实验设备', value: 86 },
        { name: '其他', value: 58 },
      ],
    })
  }),
]
