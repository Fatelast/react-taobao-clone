import React, { useState, useEffect, useRef } from 'react';

/**
 * CustomCursor - 极致感官系统核心光标组件 (Native DOM Zero-Latency)
 * 采用纯原生 DOM 操作 + CSS Transition，彻底消除任何框架调度延迟
 */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInput, setIsInput] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 1. 核心：直接同步位置到 DOM，不使用任何异步调度
    const handleMouseMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('.ant-input-affix-wrapper');
      setIsInput(!!isInputField);

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.ant-btn') || 
        target.closest('.ant-menu-item') ||
        target.closest('.ant-dropdown-trigger') ||
        target.closest('.hover-scale');
      setIsHovering(!!isInteractive);
    };

    // 2. 使用 passive 监听器最大化性能
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // 3. 动态样式计算
  const getOuterRingStyle = () => {
    if (isInput) {
      return {
        width: 2,
        height: 20,
        borderRadius: 2,
        borderWidth: 2,
        borderColor: '#ff6a00',
        boxShadow: '0 0 10px rgba(255, 106, 0, 0.4)',
      };
    }
    if (isHovering) {
      return {
        width: 60,
        height: 60,
        borderRadius: '10%',
        borderWidth: 1,
        borderColor: '#ee0979',
        boxShadow: '0 0 20px rgba(238, 9, 121, 0.4)',
        transform: 'rotate(45deg)',
      };
    }
    return {
      width: 24,
      height: 24,
      borderRadius: '35%',
      borderWidth: 2,
      borderColor: '#ff6a00',
      boxShadow: 'none',
      transform: 'rotate(0deg)',
    };
  };

  const outerStyle = getOuterRingStyle();

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000] overflow-hidden">
      {/* 4. 主容器：使用 left/top 直接定位，translate 仅用于居中偏移 */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'left, top',
          zIndex: 100000,
          pointerEvents: 'none',
        }}
        className="flex items-center justify-center"
      >
        {/* 5. 外环：仅形态变化使用 CSS Transition */}
        <div
          style={{
            width: outerStyle.width,
            height: outerStyle.height,
            borderRadius: outerStyle.borderRadius,
            borderWidth: outerStyle.borderWidth,
            borderStyle: 'solid',
            borderColor: outerStyle.borderColor,
            boxShadow: outerStyle.boxShadow,
            transform: outerStyle.transform || 'none',
            transition: 'width 0.15s ease-out, height 0.15s ease-out, border-radius 0.15s ease-out, border-color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out',
          }}
          className="absolute flex items-center justify-center"
        >
          {/* 内部准星粒子 */}
          <div 
            style={{
              width: 4,
              height: 4,
              backgroundColor: '#fff',
              borderRadius: '50%',
              boxShadow: '0 0 8px #fff',
              opacity: (isHovering || isInput) ? 0 : 1,
              transform: (isHovering || isInput) ? 'scale(0)' : 'scale(1)',
              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            }}
          />
        </div>
        
        {/* 6. 核心光点 */}
        <div 
          style={{
            width: 8,
            height: 8,
            backgroundColor: '#fff',
            borderRadius: '50%',
            mixBlendMode: 'difference',
            boxShadow: '0 0 15px #fff',
            opacity: isInput ? 0 : 1,
            transform: isInput ? 'scale(0)' : 'scale(1)',
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
          }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
