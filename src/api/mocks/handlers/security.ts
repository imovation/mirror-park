import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const securityHandlers = [
  http.get(`${BASE}/security/overview`, () => {
    return HttpResponse.json({
      cameraCount: 256,
      accessDeviceCount: 36,
      todayAlerts: 3,
      todayVisitors: 32,
    })
  }),

  http.get(`${BASE}/security/monitor`, () => {
    return HttpResponse.json({
      total: 256,
      online: 245,
      offline: 6,
      faulty: 5,
      regionDistribution: [
        { name: '教学区', value: 120 },
        { name: '行政区', value: 28 },
        { name: '宿舍区', value: 40 },
        { name: '运动区', value: 20 },
        { name: '食堂区', value: 16 },
        { name: '校园周边', value: 32 },
      ],
      coverage: 0.91,
    })
  }),

  http.get(`${BASE}/security/access`, () => {
    const hours = Array.from({ length: 14 }, (_, i) => `${i + 6}:00`)
    return HttpResponse.json({
      todayTotal: 5280,
      points: [
        { name: '南门', value: 1580 },
        { name: '北门', value: 1180 },
        { name: '西门', value: 720 },
        { name: '崇德楼', value: 480 },
        { name: '崇智楼', value: 520 },
        { name: '崇文楼', value: 800 },
      ],
      hourlyDistribution: {
        hours,
        values: [360, 1100, 420, 180, 160, 200, 420, 480, 260, 240, 300, 420, 580, 290],
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
      todayTotal: 22,
      typeDistribution: [
        { name: '事假', value: 12 },
        { name: '病假', value: 8 },
        { name: '其他', value: 2 },
      ],
      gradeDistribution: [
        { name: '初一', value: 9 },
        { name: '初二', value: 7 },
        { name: '初三', value: 6 },
      ],
      records: [
        { id: 'leave-1', name: '张明轩', className: '初一(3)班', type: '事假', time: '08:15' },
        { id: 'leave-2', name: '李思雨', className: '初二(8)班', type: '病假', time: '09:30' },
        { id: 'leave-3', name: '王子涵', className: '初三(5)班', type: '事假', time: '10:00' },
        { id: 'leave-4', name: '陈雨桐', className: '初一(15)班', type: '病假', time: '11:20' },
        { id: 'leave-5', name: '刘浩宇', className: '初二(12)班', type: '事假', time: '13:45' },
        { id: 'leave-6', name: '赵文静', className: '初三(8)班', type: '事假', time: '14:30' },
        { id: 'leave-7', name: '孙博文', className: '初一(6)班', type: '病假', time: '15:10' },
        { id: 'leave-8', name: '周思远', className: '初二(1)班', type: '其他', time: '16:00' },
      ],
    })
  }),

  http.get(`${BASE}/security/visitor`, () => {
    return HttpResponse.json({
      todayVisitors: 32,
      currentVisitors: 6,
      purposeDistribution: [
        { name: '办事', value: 14 },
        { name: '参观交流', value: 6 },
        { name: '会议', value: 4 },
        { name: '家长来访', value: 6 },
        { name: '其他', value: 2 },
      ],
      records: [
        { id: 'vis-1', name: '黄建国', time: '08:30', purpose: '办事', idNumber: '441900198012154***' },
        { id: 'vis-2', name: '杨淑芬', time: '09:15', purpose: '参观交流', idNumber: '441900197508093***' },
        { id: 'vis-3', name: '吴志强', time: '10:00', purpose: '会议', idNumber: '441900198503216***' },
        { id: 'vis-4', name: '郑晓丽', time: '11:20', purpose: '家长来访', idNumber: '441900198209187***' },
        { id: 'vis-5', name: '马德福', time: '14:00', purpose: '办事', idNumber: '441900197605142***' },
        { id: 'vis-6', name: '张秀丽', time: '15:30', purpose: '家长来访', idNumber: '441900198611058***' },
      ],
    })
  }),

  http.get(`${BASE}/security/alerts`, () => {
    const unhandled = 1
    const total = 3
    return HttpResponse.json({
      todayTotal: total,
      typeDistribution: [
        { name: '周界入侵', value: 0 },
        { name: '火警预警', value: 0 },
        { name: '设备异常', value: 1 },
        { name: '门禁告警', value: 2 },
        { name: '异常聚集', value: 0 },
      ],
      handledRatio: (total - unhandled) / total,
      unhandledRatio: unhandled / total,
      records: [
        { id: 'alert-1', time: '07:35', type: '门禁告警', location: '南门', status: '已处理' },
        { id: 'alert-2', time: '11:48', type: '门禁告警', location: '崇德楼', status: '处理中' },
        { id: 'alert-3', time: '15:22', type: '设备异常', location: '崇思楼', status: '已处理' },
      ],
    })
  }),

  http.get(`${BASE}/security/canteen`, () => {
    return HttpResponse.json({
      todayTotal: 3520,
      meals: [
        { name: '早餐', value: 1100 },
        { name: '午餐', value: 1680 },
        { name: '晚餐', value: 740 },
      ],
      safetyRecords: [
        { id: 'safe-1', date: '2026/6/15', item: '食材抽检', result: '合格' },
        { id: 'safe-2', date: '2026/6/14', item: '卫生检查', result: '合格' },
        { id: 'safe-3', date: '2026/6/14', item: '留样检测', result: '合格' },
        { id: 'safe-4', date: '2026/6/13', item: '操作规范检查', result: '合格' },
      ],
    })
  }),
]
