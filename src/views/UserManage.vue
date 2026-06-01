<template>
  <div class="user-manage">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">👥 用户管理</span>
          <div class="toolbar">
            <el-button type="primary" @click="openAddDialog">
              + 添加用户
            </el-button>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户名或真实姓名"
              style="width: 280px"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <!-- 用户表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; margin-bottom: 20px"
        :default-sort="{ prop: 'lastLogin', order: 'descending' }"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="updateUserStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="上次登录" width="180" sortable />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="editUser(row)">
              编辑
            </el-button>
            <el-button type="warning" size="small" link @click="resetPassword(row)">
              重置密码
            </el-button>
            <el-button type="danger" size="small" link @click="deleteUser(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @pagination="handlePagination"
      />
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="600px"
      @close="closeDialog"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="isEdit"
          />
        </el-form-item>

        <el-form-item v-if="!isEdit" label="密码" required>
          <el-input
            v-model="formData.password"
            placeholder="请输入初始密码"
            type="password"
          />
        </el-form-item>

        <el-form-item label="真实姓名" required>
          <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
        </el-form-item>

        <el-form-item label="邮箱" required>
          <el-input v-model="formData.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="角色" required>
          <el-select v-model="formData.role" placeholder="请选择用户角色">
            <el-option label="管理员" value="admin" />
            <el-option label="渗透测试员" value="tester" />
            <el-option label="审计员" value="auditor" />
            <el-option label="查看员" value="viewer" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门">
          <el-input v-model="formData.department" placeholder="请输入部门" />
        </el-form-item>

        <el-form-item label="职位">
          <el-input v-model="formData.position" placeholder="请输入职位" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="resetPasswordDialogVisible" title="重置密码" width="400px">
      <el-form :model="resetPasswordForm" label-width="80px">
        <el-form-item label="用户名">
          {{ resetPasswordForm.username }}
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input
            v-model="resetPasswordForm.newPassword"
            placeholder="请输入新密码"
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认密码" required>
          <el-input
            v-model="resetPasswordForm.confirmPassword"
            placeholder="请确认新密码"
            type="password"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResetPassword">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)
const dialogVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const isEdit = ref(false)

const formData = ref({
  id: '',
  username: '',
  password: '',
  realName: '',
  email: '',
  role: '',
  department: '',
  position: ''
})

const resetPasswordForm = ref({
  username: '',
  newPassword: '',
  confirmPassword: ''
})

// 模拟数据
const allTableData = ref([
  {
    id: 1,
    username: 'admin',
    realName: '张三',
    email: 'admin@example.com',
    role: 'admin',
    department: '安全部',
    position: '安全主管',
    status: 'active',
    lastLogin: '2026-05-28 14:30:00'
  },
  {
    id: 2,
    username: 'tester1',
    realName: '李四',
    email: 'tester1@example.com',
    role: 'tester',
    department: '渗透测试部',
    position: '渗透测试工程师',
    status: 'active',
    lastLogin: '2026-05-27 10:15:00'
  },
  {
    id: 3,
    username: 'tester2',
    realName: '王五',
    email: 'tester2@example.com',
    role: 'tester',
    department: '渗透测试部',
    position: '渗透测试工程师',
    status: 'active',
    lastLogin: '2026-05-26 09:00:00'
  },
  {
    id: 4,
    username: 'auditor1',
    realName: '赵六',
    email: 'auditor1@example.com',
    role: 'auditor',
    department: '审计部',
    position: '审计员',
    status: 'active',
    lastLogin: '2026-05-25 15:45:00'
  },
  {
    id: 5,
    username: 'viewer1',
    realName: '孙七',
    email: 'viewer1@example.com',
    role: 'viewer',
    department: '管理部',
    position: '管理员',
    status: 'inactive',
    lastLogin: '2026-05-20 11:20:00'
  }
])

const tableData = ref([])

// 初始化表格数据
const initTableData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  let filteredData = allTableData.value
  if (searchKeyword.value) {
    filteredData = allTableData.value.filter(item =>
      item.username.includes(searchKeyword.value) ||
      item.realName.includes(searchKeyword.value)
    )
    total.value = filteredData.length
  }
  
  tableData.value = filteredData.slice(startIndex, endIndex)
}

const handleSearch = () => {
  currentPage.value = 1
  initTableData()
}

const handlePagination = () => {
  initTableData()
}

const getRoleType = (role) => {
  const typeMap = {
    admin: 'danger',
    tester: 'warning',
    auditor: 'info',
    viewer: 'success'
  }
  return typeMap[role] || 'info'
}

const getRoleLabel = (role) => {
  const labelMap = {
    admin: '管理员',
    tester: '测试员',
    auditor: '审计员',
    viewer: '查看员'
  }
  return labelMap[role] || role
}

const openAddDialog = () => {
  isEdit.value = false
  formData.value = {
    id: '',
    username: '',
    password: '',
    realName: '',
    email: '',
    role: '',
    department: '',
    position: ''
  }
  dialogVisible.value = true
}

const editUser = (row) => {
  isEdit.value = true
  formData.value = { ...row }
  dialogVisible.value = true
}

const deleteUser = (row) => {
  ElMessageBox.confirm(`确定删除用户 "${row.realName}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    allTableData.value = allTableData.value.filter(item => item.id !== row.id)
    initTableData()
    ElMessage.success('用户已删除')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const updateUserStatus = (row) => {
  ElMessage.success(`用户状态已更新为 ${row.status === 'active' ? '激活' : '停用'}`)
}

const resetPassword = (row) => {
  resetPasswordForm.value = {
    username: row.username,
    newPassword: '',
    confirmPassword: ''
  }
  resetPasswordDialogVisible.value = true
}

const confirmResetPassword = () => {
  if (!resetPasswordForm.value.newPassword) {
    ElMessage.error('请输入新密码')
    return
  }
  if (resetPasswordForm.value.newPassword !== resetPasswordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  ElMessage.success('密码重置成功')
  resetPasswordDialogVisible.value = false
}

const saveUser = () => {
  if (!formData.value.username) {
    ElMessage.error('请输入用户名')
    return
  }
  if (!isEdit.value && !formData.value.password) {
    ElMessage.error('请输入密码')
    return
  }
  if (!formData.value.realName) {
    ElMessage.error('请输入真实姓名')
    return
  }
  if (!formData.value.email) {
    ElMessage.error('请输入邮箱')
    return
  }

  if (isEdit.value) {
    const index = allTableData.value.findIndex(item => item.id === formData.value.id)
    if (index > -1) {
      allTableData.value[index] = {
        ...allTableData.value[index],
        ...formData.value
      }
    }
    ElMessage.success('用户已更新')
  } else {
    allTableData.value.push({
      ...formData.value,
      id: Math.max(...allTableData.value.map(item => item.id)) + 1,
      status: 'active',
      lastLogin: '从未登录'
    })
    ElMessage.success('用户已添加')
  }

  dialogVisible.value = false
  currentPage.value = 1
  initTableData()
}

const closeDialog = () => {
  formData.value = {
    id: '',
    username: '',
    password: '',
    realName: '',
    email: '',
    role: '',
    department: '',
    position: ''
  }
}

// 初始化
initTableData()
</script>

<style scoped>
.user-manage {
  padding: 20px;
}

.box-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.toolbar {
  display: flex;
  gap: 15px;
  align-items: center;
}
</style>
