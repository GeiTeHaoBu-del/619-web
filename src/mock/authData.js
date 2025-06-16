// src/mock/authData.js
export const users = [
  {
    id: 1,
    username: 'user1',
    password: '123456',
    nickname: '用户一',
    avatar: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 2,
    username: 'user2',
    password: '123456',
    nickname: '用户二',
    avatar: 'https://picsum.photos/100/100?random=2'
  },
  {
    id: 3,
    username: 'test',
    password: '123456',
    nickname: '测试用户',
    avatar: 'https://picsum.photos/100/100?random=3'
  }
];

// 模拟登录API
export const authApi = {
  // 登录验证
  login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          const token = 'mock_token_' + user.id + '_' + Date.now();
          const userInfo = {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            avatar: user.avatar,
            token
          };
          resolve(userInfo);
        } else {
          reject(new Error('用户名或密码错误'));
        }
      }, 500);
    });
  },

  // 验证token
  verifyToken(token) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token && token.startsWith('mock_token_')) {
          const userId = parseInt(token.split('_')[2]);
          const user = users.find(u => u.id === userId);
          if (user) {
            resolve({
              id: user.id,
              username: user.username,
              nickname: user.nickname,
              avatar: user.avatar,
              token
            });
          } else {
            reject(new Error('无效的token'));
          }
        } else {
          reject(new Error('无效的token'));
        }
      }, 200);
    });
  },

  // 退出登录
  logout() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  }
};