<template>
  <div class="report-manage">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">📋 报告管理</span>
          <div class="toolbar">
            <el-button type="primary" @click="exportReports">
              📊 导出数据
            </el-button>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索单位名称或系统名称"
              style="width: 300px"
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

      <!-- 报告表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; margin-bottom: 20px"
        :default-sort="{ prop: 'editDate', order: 'descending' }"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="companyName" label="单位名称" width="140" />
        <el-table-column prop="systemName" label="系统名称" width="150" show-overflow-tooltip />
        <el-table-column prop="vulnerabilityDistribution" label="漏洞分布" width="180">
          <template #default="{ row }">
            <div class="distribution-chart">
              <el-tag type="danger" v-if="row.vulnerabilityDistribution.critical > 0">
                严重: {{ row.vulnerabilityDistribution.critical }}
              </el-tag>
              <el-tag type="warning" v-if="row.vulnerabilityDistribution.high > 0">
                高: {{ row.vulnerabilityDistribution.high }}
              </el-tag>
              <el-tag type="warning" v-if="row.vulnerabilityDistribution.medium > 0">
                中: {{ row.vulnerabilityDistribution.medium }}
              </el-tag>
              <el-tag type="info" v-if="row.vulnerabilityDistribution.low > 0">
                低: {{ row.vulnerabilityDistribution.low }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="editDate" label="编写时间" width="180" sortable />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewReport(row)">
              查看详情
            </el-button>
            <el-button type="warning" size="small" link @click="editReport(row)">
              编辑
            </el-button>
            <el-button type="info" size="small" link @click="downloadReport(row)">
              下载PDF
            </el-button>
            <el-button type="danger" size="small" link @click="deleteReport(row)">
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

    <!-- 查看报告详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="报告详情" width="85%" max-height="90vh">
      <div v-if="selectedReport" class="report-detail">
        <div class="detail-section">
          <h3>基础信息</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="单位名称">
              {{ selectedReport.companyName }}
            </el-descriptions-item>
            <el-descriptions-item label="系统名称">
              {{ selectedReport.systemName }}
            </el-descriptions-item>
            <el-descriptions-item label="目标类型">
              {{ selectedReport.targetType }}
            </el-descriptions-item>
            <el-descriptions-item label="网络类型">
              {{ selectedReport.networkType }}
            </el-descriptions-item>
            <el-descriptions-item label="测试地址">
              {{ selectedReport.testAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="编写时间">
              {{ selectedReport.editDate }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider />

        <div class="detail-section">
          <h3>漏洞统计</h3>
          <div class="statistics-grid">
            <div class="stat-card critical">
              <div class="stat-value">{{ selectedReport.vulnerabilityDistribution.critical }}</div>
              <div class="stat-label">严重漏洞</div>
            </div>
            <div class="stat-card high">
              <div class="stat-value">{{ selectedReport.vulnerabilityDistribution.high }}</div>
              <div class="stat-label">高危漏洞</div>
            </div>
            <div class="stat-card medium">
              <div class="stat-value">{{ selectedReport.vulnerabilityDistribution.medium }}</div>
              <div class="stat-label">中危漏洞</div>
            </div>
            <div class="stat-card low">
              <div class="stat-value">{{ selectedReport.vulnerabilityDistribution.low }}</div>
              <div class="stat-label">低危漏洞</div>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="detail-section">
          <h3>漏洞列表</h3>
          <el-table :data="selectedReport.vulnerabilities" stripe>
            <el-table-column prop="name" label="漏洞名称" />
            <el-table-column prop="severity" label="严重程度">
              <template #default="{ row }">
                <el-tag :type="getLevelType(row.severity)">
                  {{ getLevelLabel(row.severity) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="introduction" label="漏洞简介" show-overflow-tooltip />
            <el-table-column prop="url" label="漏洞地址" show-overflow-tooltip />
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 统计面板 -->
    <el-card class="statistics-card" style="margin-top: 20px">
      <template #header>
        <span>📊 报告统计</span>
      </template>

      <div class="statistics-container">
        <div class="stat-item">
          <div class="stat-label">总报告数</div>
          <div class="stat-value">{{ total }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">总漏洞数</div>
          <div class="stat-value">{{ totalVulnerabilities }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">严重漏洞</div>
          <div class="stat-value critical-text">{{ totalCritical }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">高危漏洞</div>
          <div class="stat-value high-text">{{ totalHigh }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">中危漏洞</div>
          <div class="stat-value medium-text">{{ totalMedium }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">低危漏洞</div>
          <div class="stat-value low-text">{{ totalLow }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)
const viewDialogVisible = ref(false)
const selectedReport = ref(null)

// 模拟数据
const allTableData = ref([
  {
    id: 1,
    companyName: '某某银行',
    systemName: '客户管理系统',
    targetType: 'Web网站',
    networkType: '互联网测试',
    testAddress: '192.168.1.100',
    vulnerabilityDistribution: { critical: 2, high: 3, medium: 5, low: 8 },
    editDate: '2026-05-28 14:30:00',
    vulnerabilities: [
      { name: 'SQL注入', severity: 'critical', introduction: '登录处SQL注入', url: '/login.php' },
      { name: 'XSS漏洞', severity: 'high', introduction: '评论处存储型XSS', url: '/comment.php' }
    ]
  },
  {
    id: 2,
    companyName: '某某医院',
    systemName: '挂号系统',
    targetType: '微信小程序',
    networkType: '互联网测试',
    testAddress: '192.168.1.101',
    vulnerabilityDistribution: { critical: 1, high: 2, medium: 3, low: 5 },
    editDate: '2026-05-27 10:15:00',
    vulnerabilities: [
      { name: '任意文件上传', severity: 'high', introduction: '头像上传功能', url: '/upload.php' },
      { name: '信息泄露', severity: 'medium', introduction: '错误页面泄露', url: '/error.php' }
    ]
  },
  {
    id: 3,
    companyName: '某某电商',
    systemName: '购物平台',
    targetType: 'Web网站',
    networkType: '互联网测试',
    testAddress: '192.168.1.102',
    vulnerabilityDistribution: { critical: 3, high: 5, medium: 7, low: 12 },
    editDate: '2026-05-26 09:00:00',
    vulnerabilities: [
      { name: '支付逻辑绕过', severity: 'critical', introduction: '支付功能漏洞', url: '/pay.php' },
      { name: '账户横向越权', severity: 'high', introduction: '订单查询越权', url: '/order.php' }
    ]
  }
])

const tableData = ref([])

// 计算统计数据
const totalVulnerabilities = computed(() => {
  return allTableData.value.reduce((sum, report) => {
    return sum + (report.vulnerabilityDistribution.critical + 
                  report.vulnerabilityDistribution.high + 
                  report.vulnerabilityDistribution.medium + 
                  report.vulnerabilityDistribution.low)
  }, 0)
})

const totalCritical = computed(() => {
  return allTableData.value.reduce((sum, report) => sum + report.vulnerabilityDistribution.critical, 0)
})

const totalHigh = computed(() => {
  return allTableData.value.reduce((sum, report) => sum + report.vulnerabilityDistribution.high, 0)
})

const totalMedium = computed(() => {
  return allTableData.value.reduce((sum, report) => sum + report.vulnerabilityDistribution.medium, 0)
})

const totalLow = computed(() => {
  return allTableData.value.reduce((sum, report) => sum + report.vulnerabilityDistribution.low, 0)
})

// 初始化表格数据
const initTableData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  let filteredData = allTableData.value
  if (searchKeyword.value) {
    filteredData = allTableData.value.filter(item =>
      item.companyName.includes(searchKeyword.value) ||
      item.systemName.includes(searchKeyword.value)
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

const getLevelType = (level) => {
  const typeMap = {
    critical: 'danger',
    high: 'warning',
    medium: 'warning',
    low: 'info'
  }
  return typeMap[level] || 'info'
}

const getLevelLabel = (level) => {
  const labelMap = {
    critical: '严重',
    high: '高',
    medium: '中',
    low: '低'
  }
  return labelMap[level] || level
}

const viewReport = (row) => {
  selectedReport.value = row
  viewDialogVisible.value = true
}

const editReport = (row) => {
  ElMessage.info(`编辑报告 ${row.id}`)
  // 跳转到编辑页面逻辑
}

const downloadReport = (row) => {
  ElMessage.success(`正在下载报告 "${row.systemName}"`)
  // 下载PDF逻辑
}

const deleteReport = (row) => {
  ElMessageBox.confirm(`确定删除报告 "${row.systemName}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    allTableData.value = allTableData.value.filter(item => item.id !== row.id)
    initTableData()
    ElMessage.success('报告已删除')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const exportReports = () => {
  ElMessage.success('报告数据导出成功')
  // 导出逻辑
}

// 初始化
initTableData()
</script>

<style scoped>
.report-manage {
  padding: 20px;
}

.box-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.statistics-card {
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

.distribution-chart {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.report-detail {
  padding: 20px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: white;
}

.stat-card.critical {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
}

.stat-card.high {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
}

.stat-card.medium {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
}

.stat-card.low {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.stat-item {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e8eaef;
}

.stat-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.critical-text {
  color: #f56c6c;
}

.high-text {
  color: #e6a23c;
}

.medium-text {
  color: #e6a23c;
}

.low-text {
  color: #409eff;
}
</style>
