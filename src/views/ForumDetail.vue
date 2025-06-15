<template>
  <div class="forum-detail">
    <el-page-header @back="goBack" content="帖子详情"></el-page-header>
    <el-card class="detail-card">
      <template #header>
        <div class="flex justify-between items-center">
          <h3>{{ post.title }}</h3>
        </div>
      </template>
      <div class="detail-content">
        <div class="post-meta">
          <span>作者: {{ post.author }}</span>
          <span>发布时间: {{ post.createTime }}</span>
          <span>浏览量: {{ post.views }}</span>
        </div>
        <div class="post-content" v-html="post.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const post = ref({
  id: 0,
  title: '',
  content: '',
  author: '',
  createTime: '',
  views: 0
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 页面加载时根据路由参数获取帖子详情
onMounted(() => {
  const postId = parseInt(route.params.id);
  // 这里可以根据ID从API或本地数据中获取对应帖子详情
  // 为了演示，我们从ForumView的模拟数据中查找
  const posts = [
    {
      id: 1,
      title: '这是第一个测试帖子',
      content: '这是测试帖子的内容，欢迎大家参与讨论。',
      author: 'test_user',
      createTime: '2025-06-01 10:00',
      views: 120
    },
    {
      id: 2,
      title: '商城有什么好东西推荐？',
      content: '大家在商城都买过什么好东西？可以分享一下吗？',
      author: 'user2',
      createTime: '2025-06-02 14:30',
      views: 89
    },
    {
      id: 3,
      title: '下一次活动什么时候举办？',
      content: '请问管理员，下一次线下活动什么时候举办？在哪个城市？',
      author: 'user3',
      createTime: '2025-06-05 09:15',
      views: 156
    }
  ];
  const foundPost = posts.find(p => p.id === postId);
  if (foundPost) {
    post.value = { ...foundPost };
    // 更新浏览量
    post.value.views++;
    // 更新原帖子的浏览量
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].views = post.value.views;
    }
  }
});
</script>

<style scoped>
.forum-detail {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.detail-card {
  margin-bottom: 20px;
}

.post-meta {
  margin: 10px 0;
  color: #606266;
  font-size: 14px;
}

.post-content {
  margin-top: 20px;
  line-height: 1.6;
}
</style>