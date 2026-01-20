import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  ExclamationCircleFilled, 
  InfoCircleFilled 
} from '@ant-design/icons';

const TYPE_CONFIG = {
  success: {
    icon: <CheckCircleFilled className="text-green-500" />,
    bg: 'bg-white/80',
    border: 'border-green-100/50',
    shadow: 'shadow-green-500/10'
  },
  error: {
    icon: <CloseCircleFilled className="text-red-500" />,
    bg: 'bg-white/80',
    border: 'border-red-100/50',
    shadow: 'shadow-red-500/10'
  },
  warning: {
    icon: <ExclamationCircleFilled className="text-orange-500" />,
    bg: 'bg-white/80',
    border: 'border-orange-100/50',
    shadow: 'shadow-orange-500/10'
  },
  info: {
    icon: <InfoCircleFilled className="text-blue-500" />,
    bg: 'bg-white/80',
    border: 'border-blue-100/50',
    shadow: 'shadow-blue-500/10'
  }
};

const PromaxToast = ({ message, type = 'success' }) => {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.success;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30,
        layout: { duration: 0.2 }
      }}
      className={`
        pointer-events-auto
        flex items-center gap-4 px-6 py-4 
        rounded-2xl border
        backdrop-blur-2xl shadow-2xl
        ${config.bg} ${config.border} ${config.shadow}
      `}
      style={{
        minWidth: '240px',
        maxWidth: '400px'
      }}
    >
      <div className="text-xl flex-shrink-0 flex items-center justify-center">
        {config.icon}
      </div>
      <div className="text-[15px] font-bold text-gray-800 leading-tight">
        {message}
      </div>
      
      {/* 底部进度条装饰 */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 3, ease: 'linear' }}
        style={{ color: 'inherit' }}
      />
    </motion.div>
  );
};

export default PromaxToast;
