import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const logisticsHandlers = [
  http.get(`${BASE}/logistics/leave`, () => {
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
        { id: 'lv-1', name: '张明轩', className: '初一(3)班', type: '事假', time: '08:15', reason: '家庭事假' },
        { id: 'lv-2', name: '李思雨', className: '初二(8)班', type: '病假', time: '09:30', reason: '感冒发热' },
        { id: 'lv-3', name: '王子涵', className: '初三(5)班', type: '事假', time: '10:00', reason: '参加婚礼' },
        { id: 'lv-4', name: '刘子琪', className: '初一(7)班', type: '病假', time: '10:45', reason: '头痛' },
        { id: 'lv-5', name: '陈浩然', className: '初二(3)班', type: '其他', time: '11:20', reason: '竞赛培训' },
        { id: 'lv-6', name: '杨雨桐', className: '初三(9)班', type: '事假', time: '13:00', reason: '家长会陪同' },
        { id: 'lv-7', name: '赵欣怡', className: '初一(5)班', type: '病假', time: '14:10', reason: '肠胃炎' },
        { id: 'lv-8', name: '周子睿', className: '初二(6)班', type: '事假', time: '15:30', reason: '看病复查' },
        { id: 'lv-9', name: '林佳怡', className: '初三(2)班', type: '病假', time: '07:40', reason: '发烧' },
        { id: 'lv-10', name: '郑子轩', className: '初一(13)班', type: '其他', time: '12:15', reason: '体育特长生集训' },
      ],
    })
  }),

  http.get(`${BASE}/logistics/visitors`, () => {
    return HttpResponse.json({
      todayVisitors: 41,
      currentVisitors: 9,
      purposeDistribution: [
        { name: '办事', value: 15 },
        { name: '参观交流', value: 8 },
        { name: '会议', value: 5 },
        { name: '家长来访', value: 9 },
        { name: '其他', value: 4 },
      ],
      records: [
        { id: 'vis-1', name: '黄建国', time: '08:30', purpose: '办事' },
        { id: 'vis-2', name: '杨淑芬', time: '09:15', purpose: '参观交流' },
        { id: 'vis-3', name: '吴志强', time: '10:00', purpose: '会议' },
        { id: 'vis-4', name: '周美玲', time: '14:20', purpose: '家长来访' },
        { id: 'vis-5', name: '郑伟杰', time: '15:00', purpose: '办事' },
        { id: 'vis-6', name: '林秀英', time: '16:10', purpose: '家长来访' },
        { id: 'vis-7', name: '邓丽萍', time: '08:50', purpose: '参观交流' },
        { id: 'vis-8', name: '罗建国', time: '11:30', purpose: '其他' },
      ],
    })
  }),

  http.get(`${BASE}/logistics/canteen`, () => {
    return HttpResponse.json({
      todayTotal: 3764,
      meals: [
        { name: '早餐', value: 1148 },
        { name: '午餐', value: 1756 },
        { name: '晚餐', value: 860 },
      ],
      safetyRecords: [
        { id: 'sf-1', date: '2026/6/15', item: '食材抽检', result: '合格' },
        { id: 'sf-2', date: '2026/6/15', item: '餐具消毒', result: '合格' },
        { id: 'sf-3', date: '2026/6/14', item: '留样检测', result: '合格' },
        { id: 'sf-4', date: '2026/6/14', item: '农药残留', result: '待复检' },
        { id: 'sf-5', date: '2026/6/13', item: '食用油检测', result: '合格' },
        { id: 'sf-6', date: '2026/6/13', item: '操作规范', result: '合格' },
        { id: 'sf-7', date: '2026/6/12', item: '食材抽检', result: '合格' },
        { id: 'sf-8', date: '2026/6/16', item: '饮用水检测', result: '合格' },
        { id: 'sf-9', date: '2026/6/11', item: '防鼠防虫', result: '合格' },
      ],
    })
  }),

  http.get(`${BASE}/logistics/dorm`, () => {
    return HttpResponse.json({
      occupied: 2184,
      available: 488,
      maintenance: 28,
      buildingOccupancy: [
        { name: '1号楼', value: 93.2 },
        { name: '2号楼', value: 87.6 },
        { name: '3号楼', value: 94.8 },
        { name: '4号楼', value: 76.5 },
        { name: '5号楼', value: 84.2 },
        { name: '6号楼', value: 91.7 },
      ],
    })
  }),
]
