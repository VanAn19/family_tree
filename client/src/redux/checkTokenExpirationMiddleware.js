import { logout } from './authSlice';

const checkTokenExpirationMiddleware = store => next => action => {
    const { auth } = store.getState();
    const { token } = auth;
  
    // Kiểm tra token có tồn tại và hợp lệ không
    if (token) {
      const tokenExp = localStorage.getItem('tokenExp'); // Lấy thời gian hết hạn token từ localStorage
  
      if (tokenExp) {
        const tokenExpTime = parseInt(tokenExp, 10);
        const currentTime = Date.now();
  
        // So sánh thời gian hiện tại với thời gian hết hạn token
        if (currentTime > tokenExpTime) {
          // Token đã hết hạn, đăng xuất người dùng
          store.dispatch(logout()); // Gọi hành động logout từ Redux slice
          localStorage.clear(); // Xóa token và các dữ liệu lưu trữ khác
        }
      }
    }
  
    return next(action);
  };
  
  export default checkTokenExpirationMiddleware;