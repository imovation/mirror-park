# API 接口文档 — 智慧校园可视化平台

## 总览

- **基础路径**: `/api`（可通过 `VITE_API_BASE_URL` 环境变量覆盖）
- **数据获取**: `fetchApi<T>(path)` 泛型封装
- **SSE 推送**: `/api/sse`（开发模式自动切换 Mock）
- **刷新策略**: 实时(5s) / 近实时(5min) / 周期(1h) / 静态(不自动刷新)
- **Mock**: MSW 浏览器端拦截，生产构建自动排除

---

## 1. 综合态势 (Overview) — 8 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /overview/school-info` | `useSchoolInfo()` | `['overview','schoolInfo']` | — | `SchoolInfo { landArea, buildingArea, classCount, buildingCount, totalTeachers, totalStudents }` |
| 2 | `GET /overview/personnel` | `usePersonnelComposition()` | `['overview','personnel']` | 5min | `PersonnelComposition { totalTeachers, maleCount, femaleCount, maleRatio, femaleRatio, education[] }` |
| 3 | `GET /overview/teacher-distribution` | `useTeacherDistribution()` | `['overview','teacherDistribution']` | — | `TeacherDistribution { subjects[], titles[], ageDistribution[] }` |
| 4 | `GET /overview/student-info` | `useStudentInfo()` | `['overview','studentInfo']` | — | `StudentInfo { grades[], totalStudents, maleRatio, femaleRatio }` |
| 5 | `GET /overview/activity` | `useActivity()` | `['overview','activity']` | 5min | `ActivityData { hours[], values[] }` |
| 6 | `GET /overview/recent-activity` | `useRecentActivity()` | `['overview','recentActivity']` | 5min | `RecentActivityItem[]` |
| 7 | `GET /overview/assets` | `useAssetData()` | `['overview','assets']` | — | `AssetData { computers, projectors, airConditioners, cameras, printers, doorLocks }` |
| 8 | `GET /overview/rooms` | `useRoomDistribution()` | `['overview','rooms']` | — | `RoomDistributionData { rooms[] }` |

## 2. 教学研究 (Teaching Research) — 6 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /teaching-research/resources` | `useTeachingResources()` | `['tr','resources']` | — | `TeachingResources { resources[] }` |
| 2 | `GET /teaching-research/resource-stats` | `useResourceStats()` | `['tr','resourceStats']` | — | `ResourceStats { totalResources, cloudQuestions, cloudResources, recentUpdates }` |
| 3 | `GET /teaching-research/updates` | `useResourceUpdates()` | `['tr','updates']` | 1h | `ResourceUpdates { recentItems[] }` |
| 4 | `GET /teaching-research/topics` | `useTeacherTopics()` | `['tr','topics']` | — | `TeacherTopics { lessonCases, publicAchievements, ongoingTopics }` |
| 5 | `GET /teaching-research/projects` | `useResearchProjects()` | `['tr','projects']` | — | `ResearchProjects { projects[] }` |
| 6 | `GET /teaching-research/studios` | `useTeacherStudios()` | `['tr','studios']` | — | `TeacherStudios { studios[] }` |

## 3. 行政办公 (Admin) — 6 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /admin/overview` | `useAdminOverview()` | `['admin','overview']` | 5min | `AdminOverview { departmentCount, staffCount, attendanceRate, roomCount }` |
| 2 | `GET /admin/notices` | `useNoticeData()` | `['admin','notices']` | — | `NoticeData { notices[] }` |
| 3 | `GET /admin/duty` | `useDutyData()` | `['admin','duty']` | — | `DutyData { staffs[] }` |
| 4 | `GET /admin/calendar` | `useCalendarData()` | `['admin','calendar']` | — | `CalendarData { thisWeek[], upcomingEvents[], holidays[] }` |
| 5 | `GET /admin/attendance` | `useAdminAttendance()` | `['admin','attendance']` | 5min | `AdminAttendance { todayPresent, todayLeave, todayAbsent, departmentRates[], monthlyTrend }` |
| 6 | `GET /admin/meetings` | `useMeetingData()` | `['admin','meetings']` | 5min | `MeetingData { todayCount, weekCount, rooms[], upcoming[] }` |

## 4. 智慧图书 (Library) — 6 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /library/collection` | `useCollection()` | `['library','collection']` | — | `Collection { paperBooks, ebooks, journals, newspapers }` |
| 2 | `GET /library/borrow-stats` | `useBorrowStats()` | `['library','borrowStats']` | 5min | `BorrowStats { todayBorrow, yesterdayBorrow, todayReturn, totalBorrowed, overdue, trend }` |
| 3 | `GET /library/hot-books` | `useHotBooks()` | `['library','hotBooks']` | — | `HotBooks { top10[], categoryRatio[], recommendBooks[] }` |
| 4 | `GET /library/class-rank` | `useClassRank()` | `['library','classRank']` | — | `ClassRank { classRank[], gradeComparison[], readingStars[] }` |
| 5 | `GET /library/activities` | `useLibraryActivities()` | `['library','activities']` | — | `LibraryActivities { activities[] }` |
| 6 | `GET /library/visitors` | `useLibraryVisitors()` | `['library','visitors']` | 5min | `LibraryVisitors { todayVisitors, currentVisitors, hourlyDistribution }` |

## 5. 智慧教学 (Academics) — 7 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /academics/overview` | `useAcademicsOverview()` | `['academics','overview']` | 5min | `AcademicsOverview { todayCourses, ongoingCourses, totalClassrooms, usageRate }` |
| 2 | `GET /academics/schedule` | `useScheduleData()` | `['academics','schedule']` | — | `ScheduleData { gradeDistribution[], subjectDistribution[], timeDistribution }` |
| 3 | `GET /academics/classroom-usage` | `useClassroomUsage()` | `['academics','classroomUsage']` | 5min | `ClassroomUsage { inUse, available, buildingUsage[], typeDistribution[] }` |
| 4 | `GET /academics/attendance` | `useAttendanceData()` | `['academics','attendance']` | 5min | `AttendanceData { todayRate, gradeRates[], classRank[], trend }` |
| 5 | `GET /academics/exam` | `useExamData()` | `['academics','exam']` | — | `ExamData { upcomingExams[], semesterExamCount, gradeAverages[], scoreDistribution[] }` |
| 6 | `GET /academics/classes` | `useClassData()` | `['academics','classes']` | — | `ClassData { totalClasses, gradeClasses[], classList[] }` |
| 7 | `GET /academics/devices` | `useDeviceData()` | `['academics','devices']` | 5s | `DeviceData { total, online, offline, faulty, typeDistribution[] }` |

## 6. 智慧安防 (Security) — 7 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /security/overview` | `useSecurityOverview()` | `['security','overview']` | 5s | `SecurityOverview { cameraCount, accessDeviceCount, todayAlerts, todayVisitors }` |
| 2 | `GET /security/monitor` | `useMonitorStatus()` | `['security','monitor']` | 5s | `MonitorStatus { total, online, offline, faulty, regionDistribution[], coverage }` |
| 3 | `GET /security/access` | `useAccessData()` | `['security','access']` | 5s | `AccessData { todayTotal, points[], hourlyDistribution, abnormalRecords[] }` |
| 4 | `GET /security/leave` | `useLeaveData()` | `['security','leave']` | 5min | `LeaveData { todayTotal, typeDistribution[], gradeDistribution[], records[] }` |
| 5 | `GET /security/visitor` | `useVisitorData()` | `['security','visitor']` | 5s | `VisitorData { todayVisitors, currentVisitors, purposeDistribution[], records[] }` |
| 6 | `GET /security/alerts` | `useAlertData()` | `['security','alerts']` | 5s | `AlertData { todayTotal, yesterdayTotal, typeDistribution[], handledRatio, unhandledRatio, records[] }` |
| 7 | `GET /security/canteen` | `useCanteenData()` | `['security','canteen']` | 5s | `CanteenData { todayTotal, meals[], safetyRecords[] }` |

## 7. 智慧后勤 (Logistics) — 4 端点

| # | 路径 | Hook | 键 | 刷新 | 返回类型 |
|---|------|------|----|------|---------|
| 1 | `GET /logistics/leave` | `useLogisticsLeave()` | `['logistics','leave']` | 5min | `LeaveData { todayTotal, typeDistribution[], gradeDistribution[], records[] }` |
| 2 | `GET /logistics/visitors` | `useLogisticsVisitors()` | `['logistics','visitors']` | 5min | `VisitorData { todayVisitors, currentVisitors, purposeDistribution[], records[] }` |
| 3 | `GET /logistics/canteen` | `useLogisticsCanteen()` | `['logistics','canteen']` | 5s | `CanteenData { todayTotal, meals[], safetyRecords[] }` |
| 4 | `GET /logistics/dorm` | `useDormData()` | `['logistics','dorm']` | 5min | `DormData { occupied, available, maintenance, buildingOccupancy[] }` |

## SSE 事件

SSE 端点: `/api/sse`（开发模式自动切换 Mock）

Mock 推送事件:

| 事件名 | 间隔 | 数据 |
|--------|------|------|
| `overview.activity` | 15s | `ActivityData` |
| `overview.personnel` | 18s | `PersonnelComposition` |
| `overview.schoolInfo` | 21s | `SchoolInfo` |
| `overview.teacherDistribution` | 24s | `TeacherDistribution` |
| `overview.studentInfo` | 27s | `StudentInfo` |
| `security.alerts` | 30s | `AlertData` |

## 对接注意事项

1. 所有接口通过 `fetchApi<T>(path)` 调用，自动拼接 `VITE_API_BASE_URL`
2. MSW handler 仅在 `import.meta.env.DEV` 时注册，生产构建自动移除
3. 认证 token 需在 `fetchApi` 中添加 `Authorization` header
4. SSE 事件名按 `.` 分割为 query key（如 `security.alerts` → `['security','alerts']`）
5. 实时刷新接口（`REALTIME` = 5s）在高并发场景需考虑服务端限流
6. Mock 数据基于镇远中学真实资料（73亩/8.8万m²/60班/2800学生）
