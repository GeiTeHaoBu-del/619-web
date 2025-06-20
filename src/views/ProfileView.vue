<template>
  <div class="profile-container">
    <Navbar />
    
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="个人信息" name="info">
        <el-form :model="userInfo" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" disabled />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="userInfo.nickname" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userInfo.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
              <el-radio label="other">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="购物车" name="cart">
        <el-table :data="cartItems" stripe style="width: 100%">
          <el-table-column label="" width="80">
            <template #default="scope">
              <img :src="scope.row.imageUrl" alt="商品图片" class="cart-product-image">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" min-width="200">
            <template #default="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="150">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.quantity"
                :min="1"
                @change="handleQuantityChange(scope.row)"
                size="small">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="小计" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button
                size="mini"
                type="danger"
                @click="removeFromCart(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="cart-summary">
          <span>总计: ¥{{ totalPrice }}</span>
          <el-button type="primary" @click="checkout">结算</el-button>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="订单管理" name="orders">
        <el-table :data="orders" stripe style="width: 100%">
          <el-table-column prop="orderId" label="订单编号" width="180"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" width="160"></el-table-column>
          <el-table-column label="商品信息" min-width="300">
            <template #default="scope">
              <div v-for="item in scope.row.items" :key="item.productId" class="order-item">
                <img :src="item.imageUrl" alt="商品图片" class="order-product-image">
                <span>{{ item.name }} × {{ item.quantity }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="订单金额" width="100"></el-table-column>
          <el-table-column prop="status" label="订单状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button
                size="mini"
                v-if="scope.row.status === 'pending'"
                @click="cancelOrder(scope.row)">
                取消订单
              </el-button>
              <el-button
                size="mini"
                v-if="scope.row.status === 'shipped'"
                @click="confirmReceipt(scope.row)">
                确认收货
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="退出登录" name="logout">
        <div class="logout-container">
          <p>确定要退出当前账号吗？</p>
          <el-button type="primary" @click="logout">确认退出</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { authApi } from '../mock/authData.js';
import Navbar from '../components/Navbar.vue';

const router = useRouter();

const activeTab = ref('info');

// 用户信息
const userInfo = ref({
  username: 'test_user',
  nickname: '测试用户',
  email: 'test@example.com',
  phone: '13800138000',
  gender: 'other'
});

const imageUrl = ref('https://picsum.photos/100/100?random=31');

// 新增：声明 cart 和 products
const cart = ref([
  // 购物车初始数据（示例）
  { productId: 1, quantity: 1 }
]);

const products = ref([
  // 商品数据（需与商城模块一致，示例）
  {
    id: 1,
    name: '高级智能手表',
    price: 1299,
    imageUrl: 'https://picsum.photos/100/100?random=21'
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    price: 799,
    imageUrl: 'https://picsum.photos/100/100?random=22'
  }
]);

// 购物车计算属性（修复后）
const cartItems = computed(() => {
  return cart.value.map(item => {
    const product = products.value.find(p => p.id === item.productId);
    return {
      ...product,
      quantity: item.quantity,
      totalPrice: product ? product.price * item.quantity : 0
    };
  });
});

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.totalPrice || 0), 0);
});


// 订单数据
const orders = ref([
  {
    orderId: '20250601001',
    createTime: '2025-06-01 10:30',
    items: [
      {
        productId: 1,
        name: '高级智能手表',
        imageUrl: 'https://picsum.photos/100/100?random=21',
        quantity: 1
      }
    ],
    totalAmount: 1299,
    status: 'completed'
  },
  {
    orderId: '20250605002',
    createTime: '2025-06-05 15:45',
    items: [
      {
        productId: 2,
        name: '无线蓝牙耳机',
        imageUrl: 'https://picsum.photos/100/100?random=22',
        quantity: 1
      },
      {
        productId: 5,
        name: '机械键盘',
        imageUrl: 'https://picsum.photos/100/100?random=25',
        quantity: 1
      }
    ],
    totalAmount: 1198,
    status: 'shipped'
  },
  {
    orderId: '20250608003',
    createTime: '2025-06-08 09:20',
    items: [
      {
        productId: 3,
        name: '超薄笔记本电脑',
        imageUrl: 'https://picsum.photos/100/100?random=23',
        quantity: 1
      }
    ],
    totalAmount: 5699,
    status: 'pending'
  }
])

// 头像上传处理
const handleAvatarSuccess = (res, file) => {
  imageUrl.value = URL.createObjectURL(file.raw)
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJPG) {
    alert('上传头像图片只能是 JPG/PNG 格式!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    alert('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 保存用户信息
const saveUserInfo = () => {
  // 这里应该调用后端API保存用户信息
  alert('个人信息已保存！')
}

// 购物车操作
const handleQuantityChange = (item) => {
  // 更新购物车中的商品数量
  const cartItem = cart.value.find(i => i.productId === item.id)
  if (cartItem) {
    cartItem.quantity = item.quantity
  }
}

const removeFromCart = (item) => {
  if (confirm('确定要从购物车中移除该商品吗？')) {
    cart.value = cart.value.filter(i => i.productId !== item.id)
  }
}

const checkout = () => {
  if (cartItems.value.length === 0) {
    alert('购物车为空！')
    return
  }
  
  // 创建新订单
  const now = new Date()
  const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ')
  const orderId = 'ORD' + now.getTime().toString().slice(-10)
  
  const newOrder = {
    orderId,
    createTime: formattedTime,
    items: cartItems.value.map(item => ({
      productId: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      quantity: item.quantity
    })),
    totalAmount: totalPrice.value,
    status: 'pending'
  }
  
  orders.value.unshift(newOrder)
  
  // 清空购物车
  cart.value = []
  
  alert('订单创建成功！')
  activeTab.value = 'orders'
}

// 订单状态相关
const getStatusText = (status) => {
  const statusMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'info',
    paid: 'primary',
    shipped: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

const cancelOrder = (order) => {
  if (confirm('确定要取消该订单吗？')) {
    order.status = 'cancelled'
    alert('订单已取消！')
  }
}

const confirmReceipt = (order) => {
  if (confirm('确认收到商品了吗？')) {
    order.status = 'completed'
    alert('订单已完成！')
  }
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出当前账号吗？', '退出登录', {
      confirmButtonText: '确定退出',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 调用退出登录API
    await authApi.logout()
    
    // 清除本地存储的用户信息和token
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    
    ElMessage.success('退出登录成功')
    
    // 跳转到登录页面
    router.push('/login')
  } catch (error) {
    // 用户取消操作或其他错误
    if (error !== 'cancel') {
      ElMessage.error('退出登录失败')
    }
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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

.cart-product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.cart-summary {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
}

.cart-summary span {
  margin-right: 20px;
  font-weight: 600;
}

.order-product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.logout-container {
  padding: 50px;
  text-align: center;
}

.logout-container p {
  margin-bottom: 20px;
  font-size: 18px;
}
</style>