import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ForumView from '../views/ForumView.vue';
import MallView from '../views/MallView.vue';
import LearningView from '../views/LearningView.vue';
import ProfileView from '../views/ProfileView.vue';
import ForumDetail from '../views/ForumDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/forum',
      name: 'forum',
      component: ForumView
    },
    {
      path: '/forum/detail/:id',
      name: 'ForumDetail',
      component: ForumDetail
    },
    {
      path: '/mall',
      name: 'mall',
      component: MallView
    },
        {
      path: '/learning',
      name: 'learning',
      component: LearningView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
});

export default router;