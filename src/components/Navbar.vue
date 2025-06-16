<template>
  <el-header>
    <div class="navbar-container">
      <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="home">首页</el-menu-item>
        <el-menu-item index="forum">论坛</el-menu-item>
        <el-menu-item index="learning">学习</el-menu-item>
        <el-menu-item index="mall">商城</el-menu-item>
        <el-menu-item index="profile">我的</el-menu-item>
      </el-menu>
      
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :src="userInfo.avatar" :size="30" />
            <span class="username">{{ userInfo.nickname }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { authApi } from '../mock/authData.js'

const router = useRouter()
const route = useRoute()
const activeMenu = ref('home')
const userInfo = ref({
  nickname: '',
  avatar: ''
})

// 初始化时根据当前路由设置活动菜单
onMounted(() => {
  activeMenu.value = route.name || 'home'
  loadUserInfo()
})

// 加载用户信息
const loadUserInfo = () => {
  const userData = localStorage.getItem('userInfo')
  if (userData) {
    userInfo.value = JSON.parse(userData)
  }
}

const handleSelect = (key) => {
  router.push({ name: key })
  activeMenu.value = key
}

const handleCommand = async (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      await authApi.logout()
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      ElMessage.success('退出登录成功')
      router.push('/login')
    } catch (error) {
      // 用户取消操作
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #ffffff;
  line-height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.el-menu-demo {
  flex: 1;
  border-bottom: none;
}

.user-info {
  margin-right: 20px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
}

.username {
  margin: 0 8px;
  font-size: 14px;
}
</style>