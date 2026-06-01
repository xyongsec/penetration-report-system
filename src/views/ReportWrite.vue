<template>
  <div class="report-write">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="title">📝 渗透测试报告编写</span>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" class="report-form">
        <!-- 第一步：基础信息 -->
        <el-divider>基础信息</el-divider>
        
        <el-form-item label="单位名称">
          <el-input v-model="formData.companyName" placeholder="请输入单位名称" />
        </el-form-item>

        <el-form-item label="系统名称">
          <el-input v-model="formData.systemName" placeholder="请输入系统名称" />
        </el-form-item>

        <el-form-item label="目标类型">
          <el-select v-model="formData.targetType" placeholder="请选择目标类型">
            <el-option label="Web网站" value="web" />
            <el-option label="C/S客户端" value="cs" />
            <el-option label="手机APP" value="mobile" />
            <el-option label="微信小程序" value="wechat" />
          </el-select>
        </el-form-item>

        <el-form-item label="网络类型">
          <el-select v-model="formData.networkType" placeholder="请选择网络类型">
            <el-option label="内网测试" value="intranet" />
            <el-option label="互联网测试" value="internet" />
          </el-select>
        </el-form-item>

        <el-form-item label="测试地址">
          <el-input v-model="formData.testAddress" placeholder="请输入测试地址" />
        </el-form-item>

        <el-form-item label="目标地址">
          <el-input v-model="formData.targetAddress" placeholder="请输入目标地址" type="textarea" rows="3" />
        </el-form-item>

        <el-form-item label="测试时间">
          <el-date-picker
            v-model="formData.testTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <!-- 第二步：漏洞信息 -->
        <el-divider>漏洞信息</el-divider>

        <div class="vulnerabilities-section">
          <el-button type="primary" @click="addVulnerability" style="margin-bottom: 20px">
            + 添加漏洞
          </el-button>

          <el-collapse v-if="formData.vulnerabilities.length > 0">
            <el-collapse-item
              v-for="(vuln, index) in formData.vulnerabilities"
              :key="index"
              :title="`漏洞 ${index + 1}: ${vuln.name || '未命名'}`"
              :name="index"
            >
              <div class="vulnerability-form">
                <el-form-item label="漏洞名称">
                  <el-input v-model="vuln.name" placeholder="请输入漏洞名称" />
                </el-form-item>

                <el-form-item label="漏洞地址">
                  <el-input v-model="vuln.url" placeholder="请输入漏洞地址" />
                </el-form-item>

                <el-form-item label="危险程度">
                  <el-select v-model="vuln.severity" placeholder="请选择危险程度">
                    <el-option label="严重" value="critical" />
                    <el-option label="高" value="high" />
                    <el-option label="中" value="medium" />
                    <el-option label="低" value="low" />
                  </el-select>
                </el-form-item>

                <el-form-item label="漏洞简介">
                  <el-input v-model="vuln.introduction" placeholder="简要描述漏洞" type="textarea" rows="2" />
                </el-form-item>

                <el-form-item label="漏洞正文">
                  <el-input v-model="vuln.content" placeholder="详细描述漏洞" type="textarea" rows="4" />
                </el-form-item>

                <el-form-item label="漏洞图片">
                  <el-upload
                    v-model:file-list="vuln.images"
                    action="/api/upload"
                    multiple
                    list-type="picture-card"
                    auto-upload
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                </el-form-item>

                <el-form-item label="漏洞危害">
                  <el-input v-model="vuln.impact" placeholder="描述漏洞可能造成的危害" type="textarea" rows="3" />
                </el-form-item>

                <el-form-item label="修复建议">
                  <el-input v-model="vuln.recommendation" placeholder="提供修复建议" type="textarea" rows="3" />
                </el-form-item>

                <el-button type="danger" @click="removeVulnerability(index)">
                  删除漏洞
                </el-button>
              </div>
            </el-collapse-item>
          </el-collapse>

          <div v-else class="empty-state">
            <p>暂无漏洞信息，点击上方按钮添加</p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <el-divider />
        <div class="action-buttons">
          <el-button type="primary" @click="submitReport">保存报告</el-button>
          <el-button @click="previewReport">预览</el-button>
          <el-button type="danger" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const formData = ref({
  companyName: '',
  systemName: '',
  targetType: '',
  networkType: '',
  testAddress: '',
  targetAddress: '',
  testTime: [],
  vulnerabilities: []
})

const addVulnerability = () => {
  formData.value.vulnerabilities.push({
    name: '',
    url: '',
    severity: '',
    introduction: '',
    content: '',
    images: [],
    impact: '',
    recommendation: ''
  })
}

const removeVulnerability = (index) => {
  formData.value.vulnerabilities.splice(index, 1)
  ElMessage.success('漏洞已删除')
}

const submitReport = () => {
  if (!formData.value.companyName) {
    ElMessage.error('请输入单位名称')
    return
  }
  if (!formData.value.systemName) {
    ElMessage.error('请输入系统名称')
    return
  }
  // 提交报告逻辑
  ElMessage.success('报告保存成功')
  console.log('提交的数据：', formData.value)
}

const previewReport = () => {
  ElMessage.info('预览功能开发中...')
}

const resetForm = () => {
  formData.value = {
    companyName: '',
    systemName: '',
    targetType: '',
    networkType: '',
    testAddress: '',
    targetAddress: '',
    testTime: [],
    vulnerabilities: []
  }
  ElMessage.success('表单已重置')
}
</script>

<style scoped>
.report-write {
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

.report-form {
  max-width: 800px;
}

.vulnerability-form {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
}

.vulnerabilities-section {
  margin: 20px 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
</style>
