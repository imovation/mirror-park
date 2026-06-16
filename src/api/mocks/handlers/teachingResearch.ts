import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const teachingResearchHandlers = [
  http.get(`${BASE}/teaching-research/resources`, () => {
    return HttpResponse.json({
      resources: [
        { name: '试卷', value: 820, color: '#4a9eff' },
        { name: '学案', value: 640, color: '#00c853' },
        { name: '教学设计', value: 380, color: '#ff6d00' },
        { name: '微课', value: 156, color: '#aa00ff' },
        { name: '课件', value: 720, color: '#ffc107' },
        { name: '素材', value: 1020, color: '#00bcd4' },
      ],
    })
  }),

  http.get(`${BASE}/teaching-research/resource-stats`, () => {
    return HttpResponse.json({
      totalResources: 3736,
      cloudQuestions: 1240,
      cloudResources: 2850,
      recentUpdates: 24,
    })
  }),

  http.get(`${BASE}/teaching-research/updates`, () => {
    return HttpResponse.json({
      recentItems: [
        { id: 'res-1', name: '高二语文期中试卷及答案', subject: '语文', teacher: '陈明', time: '2026/6/15' },
        { id: 'res-2', name: '高一数学函数专题学案', subject: '数学', teacher: '李华', time: '2026/6/15' },
        { id: 'res-3', name: '高三英语阅读理解精练', subject: '英语', teacher: '张伟', time: '2026/6/14' },
        { id: 'res-4', name: '牛顿运动定律教学课件', subject: '物理', teacher: '王芳', time: '2026/6/14' },
        { id: 'res-5', name: '化学实验安全操作微课', subject: '化学', teacher: '刘洋', time: '2026/6/13' },
        { id: 'res-6', name: '细胞分裂教学素材包', subject: '生物', teacher: '赵雪', time: '2026/6/13' },
        { id: 'res-7', name: '中国古代政治制度学案', subject: '政治', teacher: '孙涛', time: '2026/6/12' },
        { id: 'res-8', name: '近现代史专题复习试卷', subject: '历史', teacher: '周静', time: '2026/6/12' },
        { id: 'res-9', name: '气候类型判读教学设计', subject: '地理', teacher: '吴强', time: '2026/6/11' },
        { id: 'res-10', name: 'Python编程基础课件', subject: '信息技术', teacher: '郑鹏', time: '2026/6/11' },
      ],
    })
  }),

  http.get(`${BASE}/teaching-research/topics`, () => {
    return HttpResponse.json({
      lessonCases: 86,
      publicAchievements: 42,
      ongoingTopics: 15,
    })
  }),

  http.get(`${BASE}/teaching-research/projects`, () => {
    return HttpResponse.json({
      projects: [
        { id: 'proj-1', name: '基于大数据的高中课堂教学评价体系研究', leader: '陈明', status: '在研', members: 8 },
        { id: 'proj-2', name: '高中语文整本书阅读教学实践探索', leader: '李华', status: '在研', members: 6 },
        { id: 'proj-3', name: '信息技术与学科教学深度融合策略研究', leader: '王芳', status: '中期', members: 7 },
        { id: 'proj-4', name: '新高考背景下分层走班教学策略研究', leader: '张伟', status: '在研', members: 9 },
        { id: 'proj-5', name: '核心素养导向的高中化学实验教学实践', leader: '刘洋', status: '在研', members: 6 },
        { id: 'proj-6', name: '中学生心理健康教育校本化模式探索', leader: '赵雪', status: '结题', members: 5 },
        { id: 'proj-7', name: 'STEAM教育理念在物理教学中的应用', leader: '周静', status: '中期', members: 7 },
        { id: 'proj-8', name: '学校德育课程一体化建设实践研究', leader: '孙涛', status: '在研', members: 8 },
      ],
    })
  }),

  http.get(`${BASE}/teaching-research/studios`, () => {
    return HttpResponse.json({
      studios: [
        { id: 'studio-1', name: '陈明语文名师工作室', host: '陈明', memberCount: 15, achievementCount: 38, subject: '语文' },
        { id: 'studio-2', name: '李华数学创新教学工作室', host: '李华', memberCount: 12, achievementCount: 42, subject: '数学' },
        { id: 'studio-3', name: '张伟英语教研工作室', host: '张伟', memberCount: 14, achievementCount: 35, subject: '英语' },
        { id: 'studio-4', name: '王芳物理实验教学工作室', host: '王芳', memberCount: 10, achievementCount: 28, subject: '物理' },
        { id: 'studio-5', name: '刘洋化学教研工作室', host: '刘洋', memberCount: 11, achievementCount: 32, subject: '化学' },
        { id: 'studio-6', name: '赵雪心理健康教育工作室', host: '赵雪', memberCount: 8, achievementCount: 25, subject: '心理健康' },
      ],
    })
  }),
]
