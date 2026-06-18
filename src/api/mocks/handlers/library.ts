import { http, HttpResponse } from 'msw'

const BASE = '/api'

export const libraryHandlers = [
  http.get(`${BASE}/library/collection`, () => {
    return HttpResponse.json({
      paperBooks: 102580,
      ebooks: 6200,
      journals: 132,
      newspapers: 28,
    })
  }),

  http.get(`${BASE}/library/borrow-stats`, () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return `${d.getMonth() + 1}/${d.getDate()}`
    })
    return HttpResponse.json({
      todayBorrow: 5,
      todayReturn: 4,
      totalBorrowed: 1320,
      overdue: 16,
      trend: {
        days,
        borrow: [12,8,15,6,18,9,22,14,7,11,19,5,16,10,13,8,20,6,17,9,14,11,8,5,12,7,18,10,15,9],
        return:  [10,6,13,5,16,7,20,12,6,9,17,4,14,8,11,7,18,5,15,8,13,10,7,4,11,6,16,9,14,8],
      },
    })
  }),

  http.get(`${BASE}/library/hot-books`, () => {
    return HttpResponse.json({
      top10: [
        { name: '三体', author: '刘慈欣', count: 482 },
        { name: '活着', author: '余华', count: 435 },
        { name: '红楼梦', author: '曹雪芹', count: 412 },
        { name: '百年孤独', author: '加西亚·马尔克斯', count: 380 },
        { name: '平凡的世界', author: '路遥', count: 365 },
        { name: '围城', author: '钱钟书', count: 342 },
        { name: '朝花夕拾', author: '鲁迅', count: 325 },
        { name: '骆驼祥子', author: '老舍', count: 308 },
        { name: '边城', author: '沈从文', count: 285 },
        { name: '呐喊', author: '鲁迅', count: 268 },
      ],
      categoryRatio: [
        { name: '社会科学', value: 78 },
        { name: '自然科学', value: 12 },
        { name: '文学艺术', value: 6 },
        { name: '其他', value: 4 },
      ],
      recommendBooks: [
        { name: '乡土中国', author: '费孝通', cover: '' },
        { name: '万历十五年', author: '黄仁宇', cover: '' },
        { name: '刻意练习', author: '安德斯·艾利克森', cover: '' },
        { name: '时间简史', author: '史蒂芬·霍金', cover: '' },
        { name: '苏东坡传', author: '林语堂', cover: '' },
      ],
    })
  }),

  http.get(`${BASE}/library/class-rank`, () => {
    return HttpResponse.json({
      classRank: [
        { name: '初一(1)班', value: 186 },
        { name: '初二(3)班', value: 172 },
        { name: '初一(5)班', value: 165 },
        { name: '初三(2)班', value: 158 },
        { name: '初二(8)班', value: 152 },
        { name: '初一(12)班', value: 148 },
        { name: '初三(6)班', value: 142 },
        { name: '初二(15)班', value: 138 },
        { name: '初一(8)班', value: 135 },
        { name: '初三(11)班', value: 130 },
      ],
      gradeComparison: [
        { name: '初一', value: 2200 },
        { name: '初二', value: 2100 },
        { name: '初三', value: 1900 },
      ],
      readingStars: [
        { name: '陈思雨', className: '初一(1)班', count: 78 },
        { name: '李浩然', className: '初二(3)班', count: 72 },
        { name: '王诗涵', className: '初三(2)班', count: 68 },
        { name: '赵文博', className: '初一(12)班', count: 65 },
        { name: '刘子轩', className: '初二(5)班', count: 61 },
      ],
    })
  }),

  http.get(`${BASE}/library/activities`, () => {
    return HttpResponse.json({
      activities: [
        { id: 'act-1', title: '校园读书节', date: '2026/5/15', status: '进行中' },
        { id: 'act-2', title: '经典诵读大赛', date: '2026/5/20', status: '即将开始' },
        { id: 'act-3', title: '好书推荐展', date: '2026/5/10', status: '已结束' },
        { id: 'act-4', title: '作家进校园讲座', date: '2026/6/5', status: '即将开始' },
        { id: 'act-5', title: '阅读分享会', date: '2026/4/28', status: '已结束' },
        { id: 'act-6', title: '读书笔记展评', date: '2026/5/8', status: '已结束' },
      ],
    })
  }),

  http.get(`${BASE}/library/visitors`, () => {
    const hours = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']
    return HttpResponse.json({
      todayVisitors: 353,
      currentVisitors: 68,
      hourlyDistribution: {
        hours,
        values: [0, 4, 15, 26, 30, 35, 45, 38, 24, 28, 38, 42, 22, 6],
      },
    })
  }),
]
