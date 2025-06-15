<template>
  <div class="forum-container">
    <Navbar />
    
    <el-row class="forum-header">
      <el-col :span="24">
        <el-input 
          v-model="searchText" 
          placeholder="搜索帖子" 
          prefix-icon="el-icon-search"
          @keyup.enter="searchPost">
          <template #append>
            <el-button @click="searchPost">搜索</el-button>
          </template>
        </el-input>
        
        <el-button type="primary" @click="showCreateDialog = true" style="margin-top: 10px;">
          发布新帖
        </el-button>
      </el-col>
    </el-row>
    
    <el-row class="forum-content">
      <el-col :span="24">
        <el-table :data="posts" stripe style="width: 100%">
          <el-table-column prop="title" label="帖子标题" min-width="300">
            <template #default="scope">
              <span @click="viewPost(scope.row)">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" width="120"></el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="160"></el-table-column>
          <el-table-column prop="views" label="浏览量" width="80"></el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button 
                size="mini" 
                @click="editPost(scope.row)"
                v-if="scope.row.author === currentUser">
                编辑
              </el-button>
              <el-button 
                size="mini" 
                type="danger" 
                @click="deletePost(scope.row)"
                v-if="scope.row.author === currentUser">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPosts">
        </el-pagination>
      </el-col>
    </el-row>
    
    <!-- 创建帖子对话框 -->
    <el-dialog :visible.sync="showCreateDialog" title="发布新帖">
      <template #content>
        <el-form :model="newPost" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="newPost.title" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="newPost.content" rows="4" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button type="primary" @click="createPost">发布</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 编辑帖子对话框 -->
    <el-dialog :visible.sync="showEditDialog" title="编辑帖子">
      <template #content>
        <el-form :model="editingPost" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="editingPost.title" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="editingPost.content" rows="4" />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="updatePost">保存</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 查看帖子对话框 -->
    <el-dialog :visible.sync="showViewDialog" title="帖子详情">
      <template #content>
        <div class="post-detail">
          <h3>{{ viewingPost.title }}</h3>
          <div class="post-meta">
            <span>作者: {{ viewingPost.author }}</span>
            <span>发布时间: {{ viewingPost.createTime }}</span>
            <span>浏览量: {{ viewingPost.views }}</span>
          </div>
          <div class="post-content" v-html="viewingPost.content"></div>
        </div>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showViewDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Navbar from '../components/Navbar.vue'

const searchText = ref('')
const currentUser = 'test_user'
const originalPosts = ref([
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
])
const posts = ref([...originalPosts.value])

const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(posts.value.length)

// 对话框状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)

// 表单数据
const newPost = reactive({
  title: '',
  content: ''
})

const editingPost = reactive({
  id: 0,
  title: '',
  content: '',
  author: '',
  createTime: '',
  views: 0
})

const viewingPost = reactive({
  id: 0,
  title: '',
  content: '',
  author: '',
  createTime: '',
  views: 0
})

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 帖子操作
const createPost = () => {
  if (!newPost.title || !newPost.content) {
    alert('请填写标题和内容')
    return
  }
  
  const newId = Math.max(...posts.value.map(post => post.id)) + 1
  const now = new Date()
  const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ')
  
  const newPostObj = {
    id: newId,
    title: newPost.title,
    content: newPost.content,
    author: currentUser,
    createTime: formattedTime,
    views: 0
  }
  
  posts.value.unshift(newPostObj)
  originalPosts.value.unshift(newPostObj)
  
  totalPosts.value = posts.value.length
  newPost.title = ''
  newPost.content = ''
  showCreateDialog.value = false
}

const editPost = (post) => {
  editingPost.id = post.id
  editingPost.title = post.title
  editingPost.content = post.content
  editingPost.author = post.author
  editingPost.createTime = post.createTime
  editingPost.views = post.views
  showEditDialog.value = true
}

const updatePost = () => {
  const index = posts.value.findIndex(post => post.id === editingPost.id)
  if (index !== -1) {
    posts.value[index] = { ...editingPost }
  }
  const originalIndex = originalPosts.value.findIndex(post => post.id === editingPost.id)
  if (originalIndex !== -1) {
    originalPosts.value[originalIndex] = { ...editingPost }
  }
  showEditDialog.value = false
}

const deletePost = (post) => {
  if (confirm('确定要删除这个帖子吗？')) {
    posts.value = posts.value.filter(p => p.id !== post.id)
    originalPosts.value = originalPosts.value.filter(p => p.id !== post.id)
    totalPosts.value = posts.value.length
  }
}

const viewPost = (post) => {
  viewingPost.id = post.id
  viewingPost.title = post.title
  viewingPost.content = post.content
  viewingPost.author = post.author
  viewingPost.createTime = post.createTime
  viewingPost.views = post.views + 1
  
  // 更新原帖子的浏览量
  const index = posts.value.findIndex(p => p.id === post.id)
  if (index !== -1) {
    posts.value[index].views = viewingPost.views
  }
  const originalIndex = originalPosts.value.findIndex(p => p.id === post.id)
  if (originalIndex !== -1) {
    originalPosts.value[originalIndex].views = viewingPost.views
  }
  
  showViewDialog.value = true
}

const searchPost = () => {
  if (!searchText.value) {
    // 如果搜索框为空，恢复显示所有帖子
    posts.value = [...originalPosts.value]
  } else {
    const filteredPosts = originalPosts.value.filter(post => 
      post.title.includes(searchText.value) || 
      post.content.includes(searchText.value) || 
      post.author.includes(searchText.value)
    )
    posts.value = filteredPosts
  }
  totalPosts.value = posts.value.length
  currentPage.value = 1
}
</script>

<style scoped>
.forum-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.forum-header {
  margin-bottom: 20px;
}

.forum-content {
  min-height: 500px;
}

.post-detail {
  text-align: left;
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