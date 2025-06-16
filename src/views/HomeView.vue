<template>
  <div class="home-container">
    <Navbar />
    
    <el-carousel height="400px">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <img :src="item.imageUrl" alt="轮播图" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    
    <el-row class="intro-section" :gutter="20">
      <el-col :span="8" v-for="(card, index) in introCards" :key="index">
        <el-card :body-style="{ padding: '0px' }" class="clickable-card" @click="handleCardClick(card.route)">
          <img :src="card.imageUrl" alt="介绍图片" class="card-image" />
          <div style="padding: 14px;">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
            <div class="card-action">
              <el-button type="primary" size="small">立即体验 →</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const carouselItems = ref([
  { imageUrl: 'https://picsum.photos/1200/400?random=1' },
  { imageUrl: 'https://picsum.photos/1200/400?random=2' },
  { imageUrl: 'https://picsum.photos/1200/400?random=3' }
]);

const introCards = ref([
  { 
    title: '论坛交流', 
    description: '与志同道合的朋友一起交流分享',
    imageUrl: 'https://picsum.photos/400/200?random=10',
    route: '/forum'
  },
  { 
    title: '学习摄影', 
    description: '浏览各类精美摄影图片',
    imageUrl: 'https://picsum.photos/400/200?random=11',
    route: '/learning'
  },
  { 
    title: '精选商城', 
    description: '各种优质商品等你来选',
    imageUrl: 'https://picsum.photos/400/200?random=12',
    route: '/mall'
  }
]);

const handleCardClick = (route) => {
  router.push(route);
};
</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-section {
  margin-top: 20px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.clickable-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.clickable-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-action {
  margin-top: 10px;
  text-align: center;
}

.card-action .el-button {
  width: 100%;
}
</style>