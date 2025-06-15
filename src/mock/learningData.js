// src/mock/learningData.js
export const learningPosts = [
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
];

// 模拟后端API接口
export const learningApi = {
  // 获取帖子列表
  getPosts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...learningPosts]);
      }, 300);
    });
  },
  
  // 获取单个帖子详情
  getPostById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const post = learningPosts.find(p => p.id === id);
        resolve(post || null);
      }, 300);
    });
  },
  
  // 创建新帖子
  createPost(postData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newId = Math.max(...learningPosts.map(p => p.id)) + 1;
        const now = new Date();
        const formattedTime = now.toISOString().slice(0, 19).replace('T', ' ');
        
        const newPost = {
          id: newId,
          title: postData.title,
          content: postData.content,
          author: postData.author,
          createTime: formattedTime,
          views: 0,
          imageUrl: postData.imageUrl
        };
        
        learningPosts.unshift(newPost);
        resolve(newPost);
      }, 300);
    });
  },

  // 更新浏览量
  updateViews(id, views) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = learningPosts.findIndex(p => p.id === id);
        if (index !== -1) {
          learningPosts[index].views = views;
        }
        resolve(true);
      }, 300);
    });
  }
};