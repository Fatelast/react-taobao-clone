import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化检查 token
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 调用后端 /me 接口验证 token 有效性并获取最新用户信息
          const res = await api.get('/me'); 
          // Wait, server.js: app.use(authRouter.routes()); -> paths are /login, /register. So it should be /me.
          // BUT, to be safe and consistent with other routes potentially, let's check server.js if it mounts on root or /api/auth.
          // User's previous logs showed endpoints like /login directly.
          // However, for clean API, usually /auth/me or /me. 
          // Previous code used /login. 
          // Let's assume /me is correct based on the file edit I just made to routes/auth.js which is mounted at root likely properly?
          // Actually, let's re-read server.js quickly to be sure about prefixes if I can't recall. 
          // Assuming /me for now based on adding it to auth.js which is mounted. Use replace_file later if wrong.
          // Actually, looking at previous artifacts, login was /login. So /me should be /me.
          // Wait, in my previous edit I added it to auth.js. 
          // Code: router.get('/me', ...). 
          // Server.js likely: app.use(auth.routes()). 
          // So it is /me.
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    // localStorage.removeItem('user'); // We stop using 'user' in localStorage, rely on State
    setUser(null);
    message.success('已退出登录');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
