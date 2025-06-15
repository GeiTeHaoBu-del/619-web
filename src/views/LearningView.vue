<template>
  <div class="learning-container">
    <Navbar />
    <el-row class="learning-header">
      <el-col :span="24">
        <el-input 
          v-model="searchText" 
          placeholder="搜索学习帖子" 
          prefix-icon="el-icon-search"
          @keyup.enter="searchPost">
          <template #append>
            <el-button @click="searchPost">搜索</el-button>
          </template>
        </el-input>

      </el-col>
    </el-row>
    <el-row class="learning-content" :gutter="20">
      <el-col :span="8" v-for="post in filteredPosts" :key="post.id">
        <el-card 
          class="learning-card" 
          :body-style="{ padding: '0px' }">
          <div class="learning-image-container">
            <img :src="post.imageUrl" alt="帖子图片" class="learning-image">
          </div>
          <div class="learning-info" style="padding: 14px;">
            <h3 class="learning-title">{{ post.title }}</h3>
            <div class="learning-author">作者: {{ post.author }}</div>
            <div class="learning-views">浏览量: {{ post.views }}</div>
            <el-button 
              type="primary" 
              size="small" 
              @click="viewPost(post)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 24]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="posts.length">
    </el-pagination>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'

const searchText = ref('')
const currentUser = 'test_user'
const posts = ref([
  {
    id: 1,
    title: '摄影构图技巧分享',
    content: '摄影构图是摄影中非常重要的一环，今天给大家分享一些构图技巧...',
    author: 'test_user',
    createTime: '2025-06-01 10:00',
    views: 120,
    imageUrl: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: 2,
    title: '如何选择合适的相机镜头',
    content: '相机镜头的选择对于摄影效果有着很大的影响，下面为大家介绍如何选择合适的镜头...',
    author: 'user2',
    createTime: '2025-06-02 14:30',
    views: 89,
    imageUrl: 'https://picsum.photos/400/400?random=2'
  }
])

const currentPage = ref(1)
const pageSize = ref(8)
const totalPosts = ref(posts.value.length)

// 对话框状态
const showCreateDialog = ref(false)
const showViewDialog = ref(false)

// 表单数据
const newPost = ref({
  title: '',
  content: '',
  imageUrl: ''
})

const viewingPost = ref({
  id: 0,
  title: '',
  content: '',
  author: '',
  createTime: '',
  views: 0,
  imageUrl: ''
})

// 计算属性：过滤和排序后的商品
const filteredPosts = computed(() => {
  let result = [...posts.value]
  
  // 搜索过滤
  if (searchText.value) {
    result = result.filter(post => 
      post.title.toLowerCase().includes(searchText.value.toLowerCase()) || 
      post.content.toLowerCase().includes(searchText.value.toLowerCase()) || 
      post.author.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 搜索商品
const searchPost = () => {
  currentPage.value = 1
}

// 查看帖子
const viewPost = (post) => {
  viewingPost.value = { ...post }
  viewingPost.value.views += 1
  
  // 更新原帖子的浏览量
  const index = posts.value.findIndex(p => p.id === post.id)
  if (index !== -1) {
    posts.value[index].views = viewingPost.value.views
  }
  
  showViewDialog.value = true
}
</script>

<style scoped>
.learning-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.learning-header {
  margin-bottom: 20px;
}

.learning-content {
  min-height: 500px;
}

.learning-card {
  width: 100%;
  max-width: 285px;
  margin-bottom: 20px;
}

.learning-image-container {
  height: 200px;
  overflow: hidden;
}

.learning-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.learning-card:hover .learning-image {
  transform: scale(1.05);
}

.learning-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.learning-author {
  color: #909399;
  font-size: 14px;
  text-align: left;
  margin-bottom: 5px;
}

.learning-views {
  color: #909399;
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
}
</style>