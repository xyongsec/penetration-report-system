import { createRouter, createWebHistory } from 'vue-router'
import ReportWrite from './views/ReportWrite.vue'
import ReportQuery from './views/ReportQuery.vue'
import VulnerabilityManage from './views/VulnerabilityManage.vue'
import UserManage from './views/UserManage.vue'
import ReportManage from './views/ReportManage.vue'

const routes = [
  {
    path: '/',
    redirect: '/report-query'
  },
  {
    path: '/report-write',
    name: 'ReportWrite',
    component: ReportWrite,
    meta: { title: '报告编写' }
  },
  {
    path: '/report-query',
    name: 'ReportQuery',
    component: ReportQuery,
    meta: { title: '报告查询' }
  },
  {
    path: '/vulnerability-manage',
    name: 'VulnerabilityManage',
    component: VulnerabilityManage,
    meta: { title: '漏洞管理' }
  },
  {
    path: '/user-manage',
    name: 'UserManage',
    component: UserManage,
    meta: { title: '用户管理' }
  },
  {
    path: '/report-manage',
    name: 'ReportManage',
    component: ReportManage,
    meta: { title: '报告管理' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
