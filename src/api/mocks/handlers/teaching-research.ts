import { http, HttpResponse } from 'msw'

const BASE = '/api'

const SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '道德与法治', '历史', '地理']
const LEADERS = ['张志远', '李晓华', '王建平', '赵丽华', '陈光明', '刘芳']
const RESOURCE_NAMES = [
  '九年级数学期中试卷汇编', '初二物理实验学案', '高一语文整本书阅读设计',
  '化学反应速率微课', '英语语法专题课件', '生物细胞结构素材包',
  '历史地图集素材', '体育教学设计方案', '信息技术课件合集',
  '地理气候类型学案',
]

export const teachingResearchHandlers = [
  http.get(`${BASE}/teaching-research/resources`, () => {
    return HttpResponse.json({
      resources: [
        { name: '试卷', value: 1240, color: '#4a9eff' },
        { name: '学案', value: 860, color: '#00c853' },
        { name: '教学设计', value: 520, color: '#ff6d00' },
        { name: '微课', value: 380, color: '#aa00ff' },
        { name: '课件', value: 980, color: '#ffc107' },
        { name: '素材', value: 1540, color: '#00bcd4' },
      ],
    })
  }),

  http.get(`${BASE}/teaching-research/resource-stats`, () => {
    return HttpResponse.json({
      totalResources: 6500,
      cloudQuestions: 1840,
      cloudResources: 3200,
      recentUpdates: 48,
    })
  }),

  http.get(`${BASE}/teaching-research/updates`, () => {
    return HttpResponse.json({
      recentItems: Array.from({ length: 10 }, (_, i) => ({
        id: `res-${i}`,
        name: RESOURCE_NAMES[i],
        subject: SUBJECTS[i % SUBJECTS.length],
        teacher: LEADERS[i % LEADERS.length],
        time: `2026-06-${String(10 + i).padStart(2, '0')}`,
      })),
    })
  }),

  http.get(`${BASE}/teaching-research/topics`, () => {
    return HttpResponse.json({
      lessonCases: 128,
      publicAchievements: 45,
      ongoingTopics: 18,
    })
  }),

  http.get(`${BASE}/teaching-research/projects`, () => {
    const PROJECT_NAMES = [
      '基于大数据的课堂教学评价研究',
      '高中语文整本书阅读教学实践',
      '信息技术与学科教学深度融合研究',
      '新高考背景下的分层教学策略',
      '核心素养导向的化学实验教学研究',
      'STEAM教育理念在物理教学中的应用',
    ]
    const STATUSES: Array<'在研' | '中期' | '结题'> = ['在研', '在研', '在研', '在研', '中期', '结题']
    return HttpResponse.json({
      projects: Array.from({ length: 6 }, (_, i) => ({
        id: `proj-${i}`,
        name: PROJECT_NAMES[i],
        leader: LEADERS[i],
        status: STATUSES[i],
        members: [5, 7, 4, 8, 6, 3][i],
      })),
    })
  }),

  http.get(`${BASE}/teaching-research/studios`, () => {
    return HttpResponse.json({
      studios: [
        { id: 'studio-0', name: '语文名师工作室', host: '张明华', memberCount: 15, achievementCount: 42, subject: '语文' },
        { id: 'studio-1', name: '数学创新教学工作室', host: '李志强', memberCount: 12, achievementCount: 38, subject: '数学' },
        { id: 'studio-2', name: '英语教研工作室', host: '王秀丽', memberCount: 18, achievementCount: 28, subject: '英语' },
        { id: 'studio-3', name: '物理实验教学工作室', host: '刘建国', memberCount: 10, achievementCount: 22, subject: '物理' },
        { id: 'studio-4', name: '化学教研工作室', host: '陈思远', memberCount: 8, achievementCount: 16, subject: '化学' },
        { id: 'studio-5', name: '生物学科工作室', host: '赵晓梅', memberCount: 11, achievementCount: 19, subject: '生物' },
      ],
    })
  }),
]
