import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, info)
}

// 应用启动时检查登录状态
const initApp = async () => {
  const token = localStorage.getItem('token')
  const currentPath = window.location.pathname

  // 如果没有token且不在登录页面，跳转到登录页
  if (!token && currentPath !== '/login') {
    window.location.href = '/login'
    return
  }

  // 如果有token但在登录页面，跳转到首页
  if (token && currentPath === '/login') {
    window.location.href = '/'
    return
  }

  app.mount('#app')
}

initApp()