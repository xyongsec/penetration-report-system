<template>
  <div class="app-container">
    <el-container>
      <!-- 头部 -->
      <el-header class="app-header">
        <div class="header-content">
          <div class="logo">
            <span>🔐 渗透测试报告编写系统</span>
          </div>
          <div class="user-info">
            <span>{{ currentUser }}</span>
            <el-button type="text" @click="logout">退出登录</el-button>
          </div>
        </div>
      </el-header>

      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="200px" class="app-aside">
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/report-write">
              <el-icon><Edit /></el-icon>
              <span>报告编写</span>
            </el-menu-item>
            <el-menu-item index="/report-query">
              <el-icon><Search /></el-icon>
              <span>报告查询</span>
            </el-menu-item>
            <el-menu-item index="/vulnerability-manage">
              <el-icon><Warning /></el-icon>
              <span>漏洞管理</span>
            </el-menu-item>
            <el-menu-item index="/user-manage">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/report-manage">
              <el-icon><DocumentCopy /></el-icon>
              <span>报告管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="app-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Edit, Search, Warning, User, DocumentCopy } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const currentUser = ref('Admin User')

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (path) => {
  router.push(path)
}

const logout = () => {
  // 退出登录逻辑
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e8eaef;
}

.el-menu-vertical {
  border: none;
}

.app-main {
  background-color: #f0f2f5;
  padding: 20px;
}

:deep(.el-header) {
  height: 60px;
  line-height: 60px;
}

:deep(.el-aside) {
  overflow-y: auto;
}

:deep(.el-main) {
  overflow-y: auto;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
