import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CustomCursor - 极致感官系统核心光标组件 (Ultrafast Mode)
 * 采用原生 DOM + GPU 加速，彻底消除跟手延迟
 */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInput, setIsInput] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let requestRef;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      // 使用 requestAnimationFrame 确保位移与屏幕刷新率完美同步
      cancelAnimationFrame(requestRef);
      requestRef = requestAnimationFrame(() => {
        if (cursor) {
          cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        }
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // 检查是否在输入框
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.closest('.ant-input-affix-wrapper');
      setIsInput(!!isInputField);

      // 磁吸感应白名单
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.ant-btn') || 
        target.closest('.ant-menu-item') ||
        target.closest('.ant-dropdown-trigger') ||
        target.closest('.hover-scale')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden">
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          willChange: 'transform',
          zIndex: 100000,
        }}
        className="flex items-center justify-center translate-x-[-50%] translate-y-[-50%]"
      >
        {/* 外环磁感应层 */}
        <motion.div
          animate={{
            scale: isInput ? 0.3 : (isHovering ? 2.8 : 1),
            rotate: isHovering ? 90 : 0,
            borderWidth: isInput ? '4px' : (isHovering ? '1px' : '2px'),
            borderColor: isInput ? '#ff6a00' : (isHovering ? '#ee0979' : '#ff6a00'),
            height: isInput ? 40 : 24,
            width: isInput ? 4 : 24,
            borderRadius: isInput ? '2px' : (isHovering ? '10%' : '35%')
          }}
          transition={{ type: "spring", damping: 20, stiffness: 400 }}
          className="absolute border-2 flex items-center justify-center"
          style={{ 
            boxShadow: isInput ? '0 0 15px rgba(255, 106, 0, 0.5)' : (isHovering ? '0 0 20px rgba(238, 9, 121, 0.4)' : 'none') 
          }}
        >
           {/* 内部准星粒子 */}
           <motion.div 
             animate={{ scale: (isHovering || isInput) ? 0 : 1, opacity: (isHovering || isInput) ? 0 : 1 }}
             className="w-1 h-1 bg-white rounded-full shadow-lg"
           />
        </motion.div>
        
        {/* 核心光点 */}
        <motion.div 
          animate={{ opacity: isInput ? 0 : 1, scale: isInput ? 0 : 1 }}
          className="w-2 h-2 bg-white rounded-full mix-blend-difference shadow-[0_0_15px_#fff]" 
        />
      </div>
    </div>
  );
};

export default CustomCursor;
