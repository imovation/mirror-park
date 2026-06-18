import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

const BASE = '/api'

export const teachingResearchHandlers = [
  http.get(`${BASE}/teaching-research/resources`, () => {
    const subjectColors = ['#4a9eff', '#00c853', '#ff6d00', '#aa00ff', '#ffc107', '#00bcd4']
    return HttpResponse.json({
      resources: [
        { name: '试卷', value: faker.number.int({ min: 500, max: 2000 }), color: subjectColors[0] },
        { name: '学案', value: faker.number.int({ min: 300, max: 1500 }), color: subjectColors[1] },
        { name: '教学设计', value: faker.number.int({ min: 200, max: 1000 }), color: subjectColors[2] },
        { name: '微课', value: faker.number.int({ min: 100, max: 800 }), color: subjectColors[3] },
        { name: '课件', value: faker.number.int({ min: 400, max: 1800 }), color: subjectColors[4] },
        { name: '素材', value: faker.number.int({ min: 500, max: 2500 }), color: subjectColors[5] },
      ],
    })
  }),

  http.get(`${BASE}/teaching-research/resource-stats`, () => {
    return HttpResponse.json({
      totalResources: 6500,
      cloudQuestions: faker.number.int({ min: 500, max: 3000 }),
      cloudResources: faker.number.int({ min: 1000, max: 5000 }),
      recentUpdates: faker.number.int({ min: 10, max: 100 }),
    })
  }),

  http.get(`${BASE}/teaching-research/updates`, () => {
    const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '道德与法治', '历史', '地理']
    return HttpResponse.json({
      recentItems: Array.from({ length: 10 }, (_, i) => ({
        id: `res-${i}`,
        name: faker.lorem.words(faker.number.int({ min: 2, max: 4 })),
        subject: faker.helpers.arrayElement(subjects),
        teacher: faker.person.fullName(),
        time: faker.date.recent({ days: 7 }).toLocaleDateString('zh-CN'),
      })),
    })
  }),

  http.get(`${BASE}/teaching-research/topics`, () => {
    return HttpResponse.json({
      lessonCases: faker.number.int({ min: 50, max: 200 }),
      publicAchievements: faker.number.int({ min: 20, max: 80 }),
      ongoingTopics: faker.number.int({ min: 5, max: 30 }),
    })
  }),

  http.get(`${BASE}/teaching-research/projects`, () => {
    return HttpResponse.json({
      projects: Array.from({ length: 6 }, (_, i) => ({
        id: `proj-${i}`,
        name: faker.helpers.arrayElement([
          '基于大数据的课堂教学评价研究', '高中语文整本书阅读教学实践',
          '信息技术与学科教学深度融合研究', '新高考背景下的分层教学策略',
          '核心素养导向的化学实验教学研究', 'STEAM教育理念在物理教学中的应用',
          '中学生心理健康教育模式探索', '学校德育课程一体化建设研究',
        ]),
        leader: faker.person.fullName(),
        status: faker.helpers.arrayElement(['在研', '在研', '在研', '中期', '结题']),
        members: faker.number.int({ min: 3, max: 10 }),
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
