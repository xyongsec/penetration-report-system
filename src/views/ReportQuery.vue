<template>
  <div class="report-query">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">🔍 报告查询</span>
          <div class="search-box">
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

      <!-- 查询表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; margin-bottom: 20px"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="companyName" label="单位名称" width="150" />
        <el-table-column prop="systemName" label="系统名称" width="150" />
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="vulnerabilityCount" label="漏洞分布" width="150">
          <template #default="{ row }">
            <div class="vulnerability-distribution">
              <el-tag type="danger" v-if="row.vulnerabilityCount.critical > 0">
                严重: {{ row.vulnerabilityCount.critical }}
              </el-tag>
              <el-tag type="warning" v-if="row.vulnerabilityCount.high > 0">
                高: {{ row.vulnerabilityCount.high }}
              </el-tag>
              <el-tag type="warning" v-if="row.vulnerabilityCount.medium > 0">
                中: {{ row.vulnerabilityCount.medium }}
              </el-tag>
              <el-tag type="info" v-if="row.vulnerabilityCount.low > 0">
                低: {{ row.vulnerabilityCount.low }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="编写日期" width="180" sortable />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewReport(row)">
              查看
            </el-button>
            <el-button type="info" size="small" @click="editReport(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteReport(row)">
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

    <!-- 查看报告对话框 -->
    <el-dialog v-model="viewDialogVisible" title="查看报告详情" width="80%">
      <div v-if="selectedReport" class="report-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="单位名称">
            {{ selectedReport.companyName }}
          </el-descriptions-item>
          <el-descriptions-item label="系统名称">
            {{ selectedReport.systemName }}
          </el-descriptions-item>
          <el-descriptions-item label="作者">
            {{ selectedReport.author }}
          </el-descriptions-item>
          <el-descriptions-item label="编写日期">
            {{ selectedReport.date }}
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
          <el-descriptions-item label="目标地址">
            {{ selectedReport.targetAddress }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h4>漏洞统计</h4>
        <div class="statistics">
          <el-statistic title="严重" :value="selectedReport.vulnerabilityCount.critical" />
          <el-statistic title="高" :value="selectedReport.vulnerabilityCount.high" />
          <el-statistic title="中" :value="selectedReport.vulnerabilityCount.medium" />
          <el-statistic title="低" :value="selectedReport.vulnerabilityCount.low" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
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
    author: 'Admin',
    vulnerabilityCount: { critical: 2, high: 3, medium: 5, low: 8 },
    targetType: 'Web网站',
    networkType: '互联网测试',
    testAddress: '192.168.1.100',
    targetAddress: 'http://example.com',
    date: '2026-05-28 14:30:00'
  },
  {
    id: 2,
    companyName: '某某医院',
    systemName: '挂号系统',
    author: 'User1',
    vulnerabilityCount: { critical: 1, high: 2, medium: 3, low: 5 },
    targetType: '微信小程序',
    networkType: '互联网测试',
    testAddress: '192.168.1.101',
    targetAddress: 'https://example.com',
    date: '2026-05-27 10:15:00'
  },
  {
    id: 3,
    companyName: '某某电商',
    systemName: '购物平台',
    author: 'User2',
    vulnerabilityCount: { critical: 3, high: 5, medium: 7, low: 12 },
    targetType: 'Web网站',
    networkType: '互联网测试',
    testAddress: '192.168.1.102',
    targetAddress: 'https://shop.example.com',
    date: '2026-05-26 09:00:00'
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

const viewReport = (row) => {
  selectedReport.value = row
  viewDialogVisible.value = true
}

const editReport = (row) => {
  ElMessage.info(`编辑报告 ${row.id}`)
  // 跳转到编辑页面
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

// 初始化
initTableData()
</script>

<style scoped>
.report-query {
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

.search-box {
  display: flex;
  gap: 10px;
}

.vulnerability-distribution {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.report-details {
  padding: 20px;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}
</style>
