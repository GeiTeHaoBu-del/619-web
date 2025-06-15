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
        <el-button type="primary" @click="openCreatePostDialog">发布新帖</el-button>
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
              @click="goToPostDetail(post)">
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

    <!-- 发布帖子对话框 -->
    <el-dialog 
      v-model="showCreateDialog" 
      title="发布新帖"
      :before-close="handleClose">
      <el-form :model="newPost" :rules="postRules" ref="postFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="newPost.title" placeholder="请输入帖子标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input 
            type="textarea" 
            v-model="newPost.content" 
            rows="8" 
            placeholder="请输入帖子内容"
            maxlength="5000" 
            show-word-limit />
        </el-form-item>
        <el-form-item label="封面图片" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleImageUploadSuccess"
            :before-upload="beforeImageUpload">
            <img v-if="newPost.imageUrl" :src="newPost.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitPost">发布</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import { learningApi } from '../mock/learningData.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchText = ref('')
const currentUser = 'test_user'
const originalPosts = ref([])
const posts = ref([])
const currentPage = ref(1)
const pageSize = ref(8)
const totalPosts = ref(0)

// 对话框状态
const showCreateDialog = ref(false)
const showViewDialog = ref(false)

// 表单数据
const newPost = reactive({
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

const postFormRef = ref(null)
const isSubmitting = ref(false)

// 表单验证规则
const postRules = reactive({
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 3, max: 100, message: '标题长度在3 - 100个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ],
  imageUrl: [
    { required: true, message: '请上传封面图片', trigger: 'change' }
  ]
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
const goToPostDetail = async (post) => {
  try {
    await learningApi.updateViews(post.id, post.views + 1)
    router.push(`/learning/detail/${post.id}`)
  } catch (error) {
    console.error('更新浏览量失败', error)
    router.push(`/learning/detail/${post.id}`)
  }
}

// 打开创建帖子对话框
const openCreatePostDialog = () => {
  showCreateDialog.value = true
}

// 提交表单
const submitPost = async () => {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    // 验证表单
    await new Promise((resolve, reject) => {
      postFormRef.value.validate((valid) => {
        if (valid) {
          resolve()
        } else {
          const firstError = document.querySelector('.el-form-item__error')
          firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          reject(new Error('表单验证失败'))
        }
      })
    })
    
    // 准备提交数据
    const postData = {
      title: newPost.title,
      content: newPost.content,
      author: currentUser,
      imageUrl: newPost.imageUrl
    }
    
    // 提交到API
    const createdPost = await learningApi.createPost(postData)
    
    // 更新本地数据
    posts.value.unshift(createdPost)
    originalPosts.value.unshift(createdPost)
    totalPosts.value = posts.value.length
    
    // 关闭对话框
    showCreateDialog.value = false
    
    // 显示成功提示
    ElMessage({
      message: '帖子发布成功！',
      type: 'success',
      duration: 2000
    })
    
    // 跳转到新帖子
    router.push(`/learning/detail/${createdPost.id}`)
    
    // 重置表单
    resetForm()
    
  } catch (error) {
    console.error('发布帖子出错:', error)
    ElMessage({
      message: error.message === '表单验证失败' ? '请检查表单输入' : '发布失败，请重试',
      type: 'error',
      duration: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  newPost.title = ''
  newPost.content = ''
  newPost.imageUrl = ''
  postFormRef.value?.resetFields()
}

// 关闭对话框
const handleClose = (done) => {
  handleCloseDialog()
  done()
}

const handleCloseDialog = () => {
  showCreateDialog.value = false
  resetForm()
}

// 图片上传处理
const handleImageUploadSuccess = (res, file) => {
  newPost.imageUrl = URL.createObjectURL(file.raw)
}

const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJPG) {
    ElMessage({
      message: '上传封面图片只能是 JPG/PNG 格式!',
      type: 'error',
      duration: 3000
    })
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage({
      message: '上传封面图片大小不能超过 2MB!',
      type: 'error',
      duration: 3000
    })
  }
  return isJPG && isLt2M
}

// 初始化加载帖子数据
const fetchPosts = async () => {
  try {
    const data = await learningApi.getPosts()
    originalPosts.value = data
    posts.value = data
    totalPosts.value = data.length
  } catch (error) {
    console.error('获取帖子列表失败', error)
    ElMessage({
      message: '加载帖子列表失败，请重试',
      type: 'error',
      duration: 3000
    })
  }
}

onMounted(() => {
  fetchPosts()
})
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>