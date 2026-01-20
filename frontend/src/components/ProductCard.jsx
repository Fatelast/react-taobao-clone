import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, Typography, message, Badge, Image } from 'antd';
import { ShoppingCartOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { Text } = Typography;

// 极致轻量化占位图 (PRO MAX)
const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f9fafb'/%3E%3Ctext y='50%25' x='50%25' font-size='20' text-anchor='middle' dominant-baseline='central' fill='%239ca3af' font-family='sans-serif'%3E暂无图片%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  // Calculate quantity
  const cartItem = Array.isArray(cartItems) ? cartItems.find(item => {
    if (!item || !item.product) return false;
    const prodId = typeof item.product === 'object' ? item.product._id : item.product;
    return prodId === product._id;
  }) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      message.info('请先登录');
      navigate('/login');
      return;
    }

    // 飞入动效逻辑 (PRO MAX + Portal Integration)
    const btnRect = e.currentTarget.getBoundingClientRect();
    const target = document.getElementById('cart-icon-target');
    const targetRect = target?.getBoundingClientRect();

    if (targetRect) {
      const particleId = Date.now();
      const newParticle = {
        id: particleId,
        x: btnRect.left + btnRect.width / 2,
        y: btnRect.top + btnRect.height / 2,
        targetX: targetRect.left + targetRect.width / 2,
        targetY: targetRect.top + targetRect.height / 2,
      };
      setParticles(prev => [...prev, newParticle]);
      
      // 动效结束后清理
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== particleId));
      }, 1000);
    }

    await addToCart(product._id);
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] } }}
      className="h-full relative"
    >
      <Card
        hoverable={false}
        className="w-full rounded-[2rem] overflow-hidden h-full border-none shadow-sm hover:shadow-2xl transition-shadow duration-500 bg-white"
        bodyStyle={{ padding: '16px 20px 24px' }}
        cover={
          <div 
            className="relative w-full aspect-[4/5] overflow-hidden bg-[#fbfbfb] cursor-pointer group flex items-center justify-center p-6"
            onClick={() => navigate(`/product/${product._id}`)}
          >
              <Image
                alt={product.name}
                src={product.image || PLACEHOLDER_SVG}
                fallback={PLACEHOLDER_SVG}
                preview={false}
                placeholder={
                   <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                   </div>
                }
                className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-500" />
          </div>
        }
      >
        <div onClick={() => navigate(`/product/${product._id}`)} className="cursor-pointer">
          <div className="mb-3">
            <Text 
              className="text-base font-bold leading-snug line-clamp-2 block text-gray-800 hover:text-orange-500 transition-colors"
              title={product.name}
            >
              {product.name}
            </Text>
          </div>
        
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Price</span>
              <Text className="text-2xl text-gray-900 font-black flex items-start gap-0.5 leading-none">
                <span className="text-sm font-bold mt-1">¥</span>
                {(product.price || 0).toLocaleString()}
              </Text>
            </div>

            <div className="relative">
                <Badge count={quantity} offset={[-2, 2]} className="promax-badge" scale={0.8}>
                    <motion.button
                      whileHover={{ scale: 1.1, filter: "brightness(1.1)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleAddToCart}
                      className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(255,80,0,0.3)] hover-scale group/btn transition-all border-none cursor-pointer"
                    >
                      <PlusOutlined className="text-xl font-bold transition-transform group-hover/btn:rotate-90" />
                    </motion.button>
                </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* 飞入动效 V3 优化版 (轨迹可视化) */}
      {createPortal(
        <AnimatePresence mode="popLayout">
          {particles.map(p => {
            const deltaX = p.targetX - p.x;
            const deltaY = p.targetY - p.y;
            
            // 计算抛物线控制点
            const controlX1 = deltaX * 0.3;
            const controlY1 = deltaY - 300;
            const controlX2 = deltaX * 0.7;
            const controlY2 = deltaY - 100;
            
            return (
              <React.Fragment key={p.id}>
                {/* SVG 轨迹路径 */}
                <motion.svg
                  style={{
                    position: 'fixed',
                    left: p.x,
                    top: p.y,
                    width: Math.abs(deltaX) + 200,
                    height: Math.abs(deltaY) + 400,
                    zIndex: 99999,
                    pointerEvents: 'none',
                    overflow: 'visible',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.4, 0.3, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                >
                  <motion.path
                    d={`M 0 0 Q ${controlX1} ${controlY1}, ${controlX2} ${controlY2} T ${deltaX} ${deltaY}`}
                    stroke="rgba(255,140,0,0.5)"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </motion.svg>

                {/* 飞行粒子 */}
                <motion.div
                  style={{
                    position: 'fixed',
                    left: p.x,
                    top: p.y,
                    zIndex: 100000,
                    pointerEvents: 'none',
                  }}
                  initial={{ 
                    opacity: 0,
                    scale: 0.3,
                  }}
                  animate={{ 
                    opacity: [0, 1, 1, 1, 0.8, 0],
                    scale: [0.3, 1.2, 1, 1, 0.8, 0.3],
                    x: [0, controlX1, controlX2, deltaX],
                    y: [0, controlY1, controlY2, deltaY],
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ 
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* 能量球核心 */}
                  <div 
                    className="relative"
                    style={{
                      width: 48,
                      height: 48,
                    }}
                  >
                    {/* 外层脉冲光晕 */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,140,0,0.6), transparent 70%)',
                        filter: 'blur(12px)',
                      }}
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.8, 0.4, 0.8],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                      }}
                    />
                    
                    {/* 主体能量球 */}
                    <div
                      className="absolute inset-0 rounded-full flex items-center justify-center"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, #FFD700, #FF8C00)',
                        boxShadow: '0 0 25px rgba(255,140,0,0.8), inset 0 0 15px rgba(255,255,255,0.4)',
                        border: '2px solid rgba(255,255,255,0.5)',
                      }}
                    >
                      <ShoppingCartOutlined 
                        className="text-white text-[20px]"
                        style={{ 
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' 
                        }}
                      />
                    </div>
                    
                    {/* 运动拖尾 */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(to right, rgba(255,140,0,0.4), transparent)',
                        transform: 'scaleX(3) translateX(-66%)',
                        filter: 'blur(6px)',
                      }}
                      animate={{
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 0.4,
                        repeat: Infinity,
                      }}
                    />
                    
                    {/* 火花粒子 */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-orange-300"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        animate={{
                          x: [0, (i - 1) * 15],
                          y: [0, Math.random() * 20 - 10],
                          opacity: [0.8, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default ProductCard;
