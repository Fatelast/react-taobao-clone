import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { message } from 'antd';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 当用户变化时获取购物车
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      // message.error('获取购物车失败'); // 可选：静默失败或提示
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      message.info('请先登录');
      return false; // Indicate failure/need login
    }
    try {
      await api.post('/cart/add', { productId, quantity });
      message.success('已加入购物车');
      await fetchCart(); // Refresh cart to get updated quantities
      return true;
    } catch (err) {
      message.error(err.response?.data?.msg || '加入失败');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put('/cart/update', { productId, quantity });
      await fetchCart();
    } catch (err) {
      message.error('更新失败');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      message.success('商品已删除');
      await fetchCart();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      message.success('购物车已清空');
      setCartItems([]);
    } catch (err) {
      message.error('清空失败');
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      fetchCart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
