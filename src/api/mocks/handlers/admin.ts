import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const adminHandlers = [
  http.get(`${BASE}/admin/overview`, () => {
    return HttpResponse.json({
      departmentCount: 10,
      staffCount: 196,
      attendanceRate: 0.962,
      roomCount: 30,
    })
  }),

  http.get(`${BASE}/admin/notices`, () => {
    return HttpResponse.json({
      notices: [
        { id: 'notice-1', title: '关于开展2026年教师继续教育培训的通知', department: '教务处', date: '2026/6/15', type: '教学' },
        { id: 'notice-2', title: '关于做好期末教学质量检测工作的通知', department: '教务处', date: '2026/6/14', type: '教学' },
        { id: 'notice-3', title: '关于举办校园开放日活动的通知', department: '校办公室', date: '2026/6/13', type: '活动' },
        { id: 'notice-4', title: '关于开展夏季消防安全演练的通知', department: '后勤处', date: '2026/6/12', type: '紧急' },
        { id: 'notice-5', title: '关于报送年度考核材料的重要通知', department: '校办公室', date: '2026/6/11', type: '行政' },
        { id: 'notice-6', title: '关于召开教研组长工作会议的通知', department: '教务处', date: '2026/6/10', type: '教学' },
        { id: 'notice-7', title: '关于组织学生参加学科竞赛的通知', department: '学生处', date: '2026/6/9', type: '活动' },
        { id: 'notice-8', title: '关于加强校园食品安全管理的通知', department: '后勤处', date: '2026/6/8', type: '行政' },
      ],
    })
  }),

  http.get(`${BASE}/admin/duty`, () => {
    return HttpResponse.json({
      staffs: [
        { role: '行政值班', name: '陈建国', phone: '137****6890' },
        { role: '教师值班', name: '李明华', phone: '138****5721' },
        { role: '安保值班', name: '王志刚', phone: '139****3825' },
        { role: '医务值班', name: '赵丽萍', phone: '136****4187' },
        { role: '巡逻安保', name: '刘铁柱', phone: '137****4680' },
        { role: '值班组长', name: '赵志刚', phone: '138****5791' },
      ],
    })
  }),

  http.get(`${BASE}/admin/calendar`, () => {
    return HttpResponse.json({
      thisWeek: [
        { date: '周一 6/16', event: '教研组长会议', type: '会议' },
        { date: '周二 6/17', event: '初一年级月考', type: '考试' },
        { date: '周三 6/18', event: '校园开放日', type: '活动' },
        { date: '周四 6/19', event: '消防演练', type: '活动' },
        { date: '周五 6/20', event: '班主任工作例会', type: '会议' },
        { date: '周六 6/21', event: '校园设施维护', type: '后勤' },
        { date: '周日 6/22', event: '宿舍安全检查', type: '后勤' },
      ],
      upcomingEvents: [
        { date: '周二 6/23', event: '初一年级家长会' },
        { date: '周三 6/24', event: '语文教研组公开课' },
        { date: '周四 6/25', event: '教职工代表大会' },
        { date: '周五 6/26', event: '校园十佳歌手比赛' },
        { date: '周日 6/28', event: '学期总结大会' },
        { date: '周二 6/30', event: '教学成果展布展' },
        { date: '周四 7/2', event: '初一初二期末考试' },
      ],
      holidays: [
        { date: '7/12-8/31', event: '暑假' },
        { date: '10/1-10/7', event: '国庆假期' },
      ],
    })
  }),

  http.get(`${BASE}/admin/attendance`, () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return `${d.getMonth() + 1}/${d.getDate()}`
    })
    return HttpResponse.json({
      todayPresent: 186,
      todayLeave: 8,
      todayAbsent: 2,
      departmentRates: [
        { name: '办公室', value: 98 },
        { name: '教务处', value: 96 },
        { name: '总务处', value: 94 },
        { name: '信息中心', value: 91 },
      ],
      monthlyTrend: {
        days,
        values: [96.3,97.2,95.8,96.5,98.1,97.4,96.2,95.7,97.6,96.9,98.3,97.5,96.1,95.4,97.8,96.7,98.5,97.3,96.2,95.9,97.1,96.8,98.2,97.6,96.4,95.8,97.9,96.5,98.4,97.7],
      },
    })
  }),

  http.get(`${BASE}/admin/meetings`, () => {
    return HttpResponse.json({
      todayCount: 4,
      weekCount: 12,
      rooms: [
        { name: '会议室A', status: '使用中' },
        { name: '会议室B', status: '空闲' },
        { name: '报告厅', status: '空闲' },
        { name: '教研活动室', status: '使用中' },
        { name: '录播教室', status: '空闲' },
      ],
      upcoming: [
        { id: 'meet-1', title: '教研组周例会', time: '10:00', room: '会议室A', date: '2026/6/17' },
        { id: 'meet-2', title: '行政办公会', time: '08:30', room: '会议室B', date: '2026/6/18' },
        { id: 'meet-3', title: '班主任工作会', time: '14:00', room: '报告厅', date: '2026/6/19' },
        { id: 'meet-4', title: '课题研究讨论会', time: '15:00', room: '教研活动室', date: '2026/6/20' },
        { id: 'meet-5', title: '初一年级家长会筹备', time: '09:00', room: '会议室B', date: '2026/6/21' },
        { id: 'meet-6', title: '信息中心设备验收', time: '14:30', room: '会议室A', date: '2026/6/22' },
      ],
    })
  }),
]
