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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView,
      meta: { requiresAuth: true }
    },
    {
      path: '/forum/detail/:id',
      name: 'ForumDetail',
      component: ForumDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/mall',
      name: 'mall',
      component: MallView,
      meta: { requiresAuth: true }
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView,
      meta: { requiresAuth: true }
    },
    {
      path: '/learning/detail/:id',
      name: 'LearningDetail',
      component: LearningDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    }
  ]
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  // 如果访问登录页面
  if (to.name === 'login') {
    // 如果已经登录，跳转到首页
    if (token) {
      try {
        await authApi.verifyToken(token);
        next('/');
        return;
      } catch (error) {
        // token无效，清除本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      }
    }
    next();
    return;
  }

  // 如果访问需要认证的页面
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login');
      return;
    }

    try {
      await authApi.verifyToken(token);
      next();
    } catch (error) {
      // token无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      next('/login');
    }
  } else {
    next();
  }
});

export default router;