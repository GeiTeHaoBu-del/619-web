import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ForumView from '../views/ForumView.vue';
import MallView from '../views/MallView.vue';
import LearningView from '../views/LearningView.vue';
import ProfileView from '../views/ProfileView.vue';
import ForumDetail from '../views/ForumDetail.vue';
import LearningDetail from '../views/LearningDetail.vue';
import LoginView from '../views/LoginView.vue';
import { authApi } from '../mock/authData.js';
import { ElMessage } from 'element-plus';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false, title: '用户登录' }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true, title: '首页' }
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView,
      meta: { requiresAuth: true, title: '论坛' }
    },
    {
      path: '/forum/detail/:id',
      name: 'ForumDetail',
      component: ForumDetail,
      meta: { requiresAuth: true, title: '帖子详情' }
    },
    {
      path: '/mall',
      name: 'mall',
      component: MallView,
      meta: { requiresAuth: true, title: '商城' }
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView,
      meta: { requiresAuth: true, title: '学习' }
    },
    {
      path: '/learning/detail/:id',
      name: 'LearningDetail',
      component: LearningDetail,
      meta: { requiresAuth: true, title: '学习详情' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, title: '个人中心' }
    },
    // 添加404页面重定向
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

// 检查登录状态的辅助函数
const checkAuthStatus = async () => {
  const token = localStorage.getItem('token');
  const userInfo = localStorage.getItem('userInfo');

  if (!token || !userInfo) {
    return false;
  }

  try {
    await authApi.verifyToken(token);
    return true;
  } catch (error) {
    // token验证失败，清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    return false;
  }
};

// 清除登录状态
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
};

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 619系统`;
  }

  // 如果访问登录页面
  if (to.name === 'login') {
    // 如果已经登录，跳转到首页
    const isAuthenticated = await checkAuthStatus();
    if (isAuthenticated) {
      ElMessage.info('您已登录，正在跳转到首页');
      next('/');
      return;
    }
    next();
    return;
  }

  // 如果访问需要认证的页面
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuthStatus();

    if (!isAuthenticated) {
      ElMessage.warning('请先登录后再访问');
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存用户想要访问的页面
      });
      return;
    }

    next();
  } else {
    next();
  }
});

// 导出清除认证数据的函数，供其他组件使用
export { clearAuthData };
export default router;