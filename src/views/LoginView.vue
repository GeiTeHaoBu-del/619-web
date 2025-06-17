<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            :disabled="loading" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码" 
            :disabled="loading"
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading" 
            class="login-btn">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '../mock/authData.js'

const router = useRouter()
const route = useRoute()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 检查是否有重定向参数
onMounted(() => {
  if (route.query.redirect) {
    ElMessage.info('请先登录后再访问该页面')
  }
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const userInfo = await authApi.login(loginForm.username, loginForm.password)

        // 保存用户信息到localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('token', userInfo.token)
        
        // 设置token过期时间（24小时）
        const expireTime = Date.now() + 24 * 60 * 60 * 1000
        localStorage.setItem('tokenExpire', expireTime.toString())

        ElMessage.success('登录成功！')

        // 获取重定向路径，如果没有则跳转到首页
        const redirectPath = route.query.redirect || '/'
        router.push(redirectPath)
      } catch (error) {
        ElMessage.error(error.message || '登录失败，请检查用户名和密码')
        // 清空密码字段
        loginForm.password = ''
      } finally {
        loading.value = false
      }
    } else {
      ElMessage.warning('请检查输入信息')
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 400px;
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-btn {
  width: 100%;
}

.demo-accounts {
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 5px;
  font-size: 14px;
}

.demo-accounts h4 {
  margin: 0 0 10px 0;
  color: #666;
}

.demo-accounts p {
  margin: 5px 0;
  color: #888;
}
</style>