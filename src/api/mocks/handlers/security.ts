import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const securityHandlers = [
  http.get(`${BASE}/security/overview`, () => {
    return HttpResponse.json({
      cameraCount: 264,
      accessDeviceCount: 38,
      todayAlerts: 7,
      todayVisitors: 41,
    })
  }),

  http.get(`${BASE}/security/monitor`, () => {
    return HttpResponse.json({
      total: 264,
      online: 251,
      offline: 8,
      faulty: 5,
      regionDistribution: [
        { name: '教学区', value: 124 },
        { name: '行政区', value: 30 },
        { name: '宿舍区', value: 42 },
        { name: '运动区', value: 18 },
        { name: '食堂区', value: 14 },
        { name: '校园周边', value: 36 },
      ],
      coverage: 0.93,
    })
  }),

  http.get(`${BASE}/security/access`, () => {
    const hours = Array.from({ length: 14 }, (_, i) => `${i + 6}:00`)
    const accessPoints = [
      { name: '南门', value: 1724 },
      { name: '北门', value: 1256 },
      { name: '西门', value: 815 },
      { name: '崇德楼', value: 523 },
      { name: '崇智楼', value: 578 },
      { name: '崇文楼', value: 936 },
    ]
    return HttpResponse.json({
      points: [...accessPoints].sort((a, b) => b.value - a.value),
      todayTotal: accessPoints.reduce((s, d) => s + d.value, 0),
      hourlyDistribution: {
        hours,
        values: [382, 1172, 458, 196, 148, 212, 448, 506, 272, 254, 328, 446, 612, 318],
      },
      abnormalRecords: [
        { id: 'abn-1', time: '07:35', location: '南门', type: '未授权通行', status: '已处理' },
        { id: 'abn-2', time: '09:12', location: '崇德楼', type: '重复刷卡', status: '已处理' },
        { id: 'abn-3', time: '11:48', location: '崇智楼', type: '超时逗留', status: '处理中' },
        { id: 'abn-4', time: '14:20', location: '北门', type: '无效卡号', status: '已处理' },
        { id: 'abn-5', time: '16:55', location: '南门', type: '重复刷卡', status: '已处理' },
        { id: 'abn-6', time: '18:30', location: '西门', type: '未授权通行', status: '处理中' },
      ],
    })
  }),

  http.get(`${BASE}/security/leave`, () => {
    return HttpResponse.json({
      todayTotal: 27,
      typeDistribution: [
        { name: '事假', value: 14 },
        { name: '病假', value: 9 },
        { name: '其他', value: 4 },
      ],
      gradeDistribution: [
        { name: '初一', value: 11 },
        { name: '初二', value: 9 },
        { name: '初三', value: 7 },
      ],
      records: [
        { id: 'leave-1', name: '张明轩', className: '初一(3)班', type: '事假', time: '08:15', reason: '家庭事假' },
        { id: 'leave-2', name: '李思雨', className: '初二(8)班', type: '病假', time: '09:30', reason: '感冒发热' },
        { id: 'leave-3', name: '王子涵', className: '初三(5)班', type: '事假', time: '10:00', reason: '参加婚礼' },
        { id: 'leave-4', name: '陈雨桐', className: '初一(15)班', type: '病假', time: '11:20', reason: '肠胃不适' },
        { id: 'leave-5', name: '刘浩宇', className: '初二(12)班', type: '事假', time: '13:45', reason: '医院复查' },
        { id: 'leave-6', name: '赵文静', className: '初三(8)班', type: '事假', time: '14:30', reason: '家长出差陪同' },
        { id: 'leave-7', name: '孙博文', className: '初一(6)班', type: '病假', time: '15:10', reason: '牙科治疗' },
        { id: 'leave-8', name: '周思远', className: '初二(1)班', type: '其他', time: '16:00', reason: '竞赛集训' },
        { id: 'leave-9', name: '黄子涵', className: '初三(3)班', type: '事假', time: '07:50', reason: '家中急事' },
        { id: 'leave-10', name: '吴宇航', className: '初一(11)班', type: '病假', time: '10:15', reason: '过敏性鼻炎' },
      ],
    })
  }),

  http.get(`${BASE}/security/visitor`, () => {
    return HttpResponse.json({
      todayVisitors: 41,
      currentVisitors: 8,
      purposeDistribution: [
        { name: '办事', value: 16 },
        { name: '参观交流', value: 8 },
        { name: '会议', value: 5 },
        { name: '家长来访', value: 9 },
        { name: '其他', value: 3 },
      ],
      records: [
        { id: 'vis-1', name: '黄建国', time: '08:30', purpose: '办事', idNumber: '441900198012154***' },
        { id: 'vis-2', name: '杨淑芬', time: '09:15', purpose: '参观交流', idNumber: '441900197508093***' },
        { id: 'vis-3', name: '吴志强', time: '10:00', purpose: '会议', idNumber: '441900198503216***' },
        { id: 'vis-4', name: '郑晓丽', time: '11:20', purpose: '家长来访', idNumber: '441900198209187***' },
        { id: 'vis-5', name: '马德福', time: '14:00', purpose: '办事', idNumber: '441900197605142***' },
        { id: 'vis-6', name: '张秀丽', time: '15:30', purpose: '家长来访', idNumber: '441900198611058***' },
        { id: 'vis-7', name: '冯国华', time: '09:50', purpose: '参观交流', idNumber: '441900199003215***' },
        { id: 'vis-8', name: '何秀兰', time: '16:20', purpose: '办事', idNumber: '441900198308126***' },
      ],
    })
  }),

  http.get(`${BASE}/security/alerts`, () => {
    const unhandled = 4
    const total = 12
    return HttpResponse.json({
      todayTotal: total,
      yesterdayTotal: 5,
      typeDistribution: [
        { name: '周界入侵', value: 3 },
        { name: '火警预警', value: 2 },
        { name: '设备异常', value: 3 },
        { name: '门禁告警', value: 3 },
        { name: '异常聚集', value: 1 },
      ],
      handledRatio: (total - unhandled) / total,
      unhandledRatio: unhandled / total,
      records: [
        { id: 'alert-1', time: '06:30', type: '周界入侵', location: '东侧围墙', status: '已处理' },
        { id: 'alert-2', time: '07:15', type: '门禁告警', location: '南门', status: '已处理' },
        { id: 'alert-3', time: '08:40', type: '门禁告警', location: '北门', status: '已处理' },
        { id: 'alert-4', time: '09:55', type: '异常聚集', location: '食堂门口', status: '处理中' },
        { id: 'alert-5', time: '10:30', type: '设备异常', location: '崇德楼', status: '已处理' },
        { id: 'alert-6', time: '11:20', type: '周界入侵', location: '西侧围墙', status: '已处理' },
        { id: 'alert-7', time: '12:45', type: '火警预警', location: '食堂厨房', status: '已处理' },
        { id: 'alert-8', time: '14:00', type: '门禁告警', location: '崇智楼', status: '未处理' },
        { id: 'alert-9', time: '15:30', type: '设备异常', location: '监控中心', status: '处理中' },
        { id: 'alert-10', time: '17:10', type: '周界入侵', location: '南侧围墙', status: '已处理' },
        { id: 'alert-11', time: '19:00', type: '异常聚集', location: '运动场', status: '未处理' },
        { id: 'alert-12', time: '22:15', type: '门禁告警', location: '图书馆', status: '未处理' },
      ],
    })
  }),

  http.get(`${BASE}/security/canteen`, () => {
    return HttpResponse.json({
      todayTotal: 3764,
      meals: [
        { name: '早餐', value: 1148 },
        { name: '午餐', value: 1756 },
        { name: '晚餐', value: 860 },
      ],
      safetyRecords: [
        { id: 'safe-1', date: '2026/6/15', item: '食材抽检', result: '合格' },
        { id: 'safe-2', date: '2026/6/15', item: '餐具消毒', result: '合格' },
        { id: 'safe-3', date: '2026/6/14', item: '留样检测', result: '合格' },
        { id: 'safe-4', date: '2026/6/14', item: '农药残留', result: '待复检' },
        { id: 'safe-5', date: '2026/6/13', item: '卫生检查', result: '合格' },
        { id: 'safe-6', date: '2026/6/13', item: '冷链运输', result: '合格' },
        { id: 'safe-7', date: '2026/6/12', item: '操作规范', result: '合格' },
        { id: 'safe-8', date: '2026/6/16', item: '饮用水检测', result: '合格' },
        { id: 'safe-9', date: '2026/6/16', item: '食用油检测', result: '合格' },
        { id: 'safe-10', date: '2026/6/11', item: '防鼠防虫', result: '待整改' },
      ],
    })
  }),
]
