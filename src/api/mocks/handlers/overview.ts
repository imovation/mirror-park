import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const overviewHandlers = [
  http.get(`${BASE}/overview/school-info`, () => {
    return HttpResponse.json({
      landArea: 48700,
      buildingArea: 88000,
      classCount: 60,
      buildingCount: 9,
      totalTeachers: 196,
      totalStudents: 2800,
    })
  }),

  http.get(`${BASE}/overview/personnel`, () => {
    return HttpResponse.json({
      totalTeachers: 196,
      maleCount: 79,
      femaleCount: 117,
      maleRatio: 79 / 196,
      femaleRatio: 117 / 196,
      education: [
        { name: '硕士', value: 54 },
        { name: '本科', value: 136 },
        { name: '博士', value: 3 },
        { name: '其他', value: 3 },
      ],
    })
  }),

  http.get(`${BASE}/overview/teacher-distribution`, () => {
    return HttpResponse.json({
      subjects: [
        { name: '语文', value: 28 }, { name: '数学', value: 27 }, { name: '英语', value: 26 },
        { name: '物理', value: 13 }, { name: '化学', value: 11 }, { name: '生物', value: 12 },
        { name: '道德与法治', value: 14 }, { name: '历史', value: 13 }, { name: '地理', value: 11 },
        { name: '体育', value: 16 }, { name: '信息技术', value: 9 }, { name: '音乐', value: 8 }, { name: '美术', value: 8 },
      ],
      titles: [
        { name: '正高级', value: 4 }, { name: '高级', value: 43 },
        { name: '一级', value: 76 }, { name: '二级', value: 56 }, { name: '三级及未定', value: 17 },
      ],
      ageDistribution: [
        { name: '30岁以下', value: 38 },
        { name: '30-39岁', value: 87 },
        { name: '40-49岁', value: 51 },
        { name: '50岁及以上', value: 20 },
      ],
    })
  }),

  http.get(`${BASE}/overview/student-info`, () => {
    return HttpResponse.json({
      grades: [
        { name: '初一', male: 518, female: 474, total: 992 },
        { name: '初二', male: 493, female: 457, total: 950 },
        { name: '初三', male: 447, female: 425, total: 872 },
      ],
      totalStudents: 2814,
      maleRatio: 1458 / 2814,
      femaleRatio: 1356 / 2814,
    })
  }),

  http.get(`${BASE}/overview/activity`, () => {
    const hours = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
    return HttpResponse.json({
      hours,
      values: [135, 2580, 3820, 3470, 3050, 2760, 1640, 2180, 3340, 3170, 2830, 2240, 1860, 720],
    })
  }),

  http.get(`${BASE}/overview/assets`, () => {
    return HttpResponse.json({
      computers: 696,
      projectors: 78,
      airConditioners: 336,
      cameras: 438,
      printers: 38,
      doorLocks: 256,
    })
  }),

  http.get(`${BASE}/overview/rooms`, () => {
    return HttpResponse.json({
      rooms: [
        { name: '普通教室', count: 60 },
        { name: '计算机室', count: 6 },
        { name: '实验室', count: 9 },
        { name: '音乐室', count: 3 },
        { name: '美术室', count: 4 },
        { name: '会议室', count: 5 },
        { name: '图书馆', count: 1 },
        { name: '体育馆', count: 1 },
        { name: '心理健康室', count: 2 },
        { name: '录播教室', count: 3 },
      ],
    })
  }),

  http.get(`${BASE}/overview/recent-activity`, () => {
    const titles = [
      '校园安保巡查完成', '教学设备巡检正常', '图书馆新书上架',
      '体育馆场地预约', '行政会议已结束', '教职工考勤统计更新',
      '校园活动场地布置中', '食堂食品安全检查通过',
      '校车运行正常', '访客登记系统更新',
      '期末考务工作会议', '宿舍消防设施检查',
    ]
    const statuses = ['已完成', '进行中', '正常']
    const items = Array.from({ length: 14 }, (_, i) => ({
      id: `event-${Date.now()}-${i}`,
      time: `${String(Math.floor(Math.random() * 17) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      title: titles[i % titles.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }))
    return HttpResponse.json(items)
  }),
]
