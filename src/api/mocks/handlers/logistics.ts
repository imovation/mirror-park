import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const logisticsHandlers = [
  http.get(`${BASE}/logistics/leave`, () => {
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
        { id: 'lv-1', name: '张明轩', className: '初一(3)班', type: '事假', time: '08:15' },
        { id: 'lv-2', name: '李思雨', className: '初二(8)班', type: '病假', time: '09:30' },
        { id: 'lv-3', name: '王子涵', className: '初三(5)班', type: '事假', time: '10:00' },
        { id: 'lv-4', name: '刘子琪', className: '初一(7)班', type: '病假', time: '10:45' },
        { id: 'lv-5', name: '陈浩然', className: '初二(3)班', type: '其他', time: '11:20' },
        { id: 'lv-6', name: '杨雨桐', className: '初三(9)班', type: '事假', time: '13:00' },
        { id: 'lv-7', name: '赵欣怡', className: '初一(5)班', type: '病假', time: '14:10' },
        { id: 'lv-8', name: '周子睿', className: '初二(6)班', type: '事假', time: '15:30' },
      ],
    })
  }),

  http.get(`${BASE}/logistics/visitors`, () => {
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
        { id: 'vis-1', name: '黄建国', time: '08:30', purpose: '办事' },
        { id: 'vis-2', name: '杨淑芬', time: '09:15', purpose: '参观交流' },
        { id: 'vis-3', name: '吴志强', time: '10:00', purpose: '会议' },
        { id: 'vis-4', name: '周美玲', time: '14:20', purpose: '家长来访' },
        { id: 'vis-5', name: '郑伟杰', time: '15:00', purpose: '办事' },
        { id: 'vis-6', name: '林秀英', time: '16:10', purpose: '家长来访' },
      ],
    })
  }),

  http.get(`${BASE}/logistics/canteen`, () => {
    return HttpResponse.json({
      todayTotal: 3520,
      meals: [
        { name: '早餐', value: 1100 },
        { name: '午餐', value: 1680 },
        { name: '晚餐', value: 740 },
      ],
      safetyRecords: [
        { id: 'sf-1', date: '2026/6/15', item: '食材抽检', result: '合格' },
        { id: 'sf-2', date: '2026/6/15', item: '餐具消毒', result: '合格' },
        { id: 'sf-3', date: '2026/6/14', item: '留样检测', result: '合格' },
        { id: 'sf-4', date: '2026/6/14', item: '农药残留', result: '合格' },
        { id: 'sf-5', date: '2026/6/13', item: '食用油检测', result: '合格' },
        { id: 'sf-6', date: '2026/6/13', item: '操作规范', result: '合格' },
        { id: 'sf-7', date: '2026/6/12', item: '食材抽检', result: '合格' },
      ],
    })
  }),
]
