import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Typography, Spin, Divider } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined, CarOutlined, WalletOutlined, InboxOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const { Title, Text } = Typography;

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Fetch orders failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    const configs = {
      'pending': { color: 'gold', icon: <ClockCircleOutlined />, text: '待支付', bg: 'bg-gold-500/10' },
      'paid': { color: 'cyan', icon: <WalletOutlined />, text: '已支付', bg: 'bg-cyan-500/10' },
      'shipped': { color: 'blue', icon: <CarOutlined />, text: '待收货', bg: 'bg-blue-500/10' },
      'completed': { color: 'green', icon: <CheckCircleOutlined />, text: '已完成', bg: 'bg-green-500/10' },
      'cancelled': { color: 'default', icon: <InboxOutlined />, text: '已取消', bg: 'bg-gray-500/10' },
    };
    return configs[status.toLowerCase()] || { color: 'orange', icon: <ShoppingOutlined />, text: status, bg: 'bg-orange-500/10' };
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin size="large" tip="正在同步您的订单蓝图..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest mb-4"
          >
            购买记录
          </motion.div>
          <Title className="!text-5xl !font-black !mb-2 tracking-tighter italic">我的订单</Title>
          <Text className="text-gray-400 font-medium italic">记录您的每一次心动挑选</Text>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[3rem] p-20 text-center border-none shadow-2xl bg-white/40"
          >
             <InboxOutlined className="text-8xl text-gray-200 mb-6" />
             <Title level={3} className="!text-gray-300 !font-black uppercase tracking-widest">空空如也</Title>
             <Text className="text-gray-400">目前还没有订单记录，去发现些好物吧？</Text>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card rounded-[2.5rem] overflow-hidden border-white/60 bg-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all group"
                >
                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Text className="text-[10px] font-black uppercase tracking-widest text-gray-300">订单编号</Text>
                          <Tag className="rounded-full border-none bg-gray-100 text-gray-500 font-mono font-bold px-3">
                            #{order._id.slice(-8).toUpperCase()}
                          </Tag>
                        </div>
                        <Text type="secondary" className="text-xs font-medium italic">
                          {new Date(order.createdAt).toLocaleString('zh-CN', { dateStyle: 'full', timeStyle: 'short' })}
                        </Text>
                      </div>
                      <div className="text-right">
                        <div className={`px-6 py-2 rounded-2xl ${getStatusConfig(order.status).bg} flex items-center gap-2 mb-2`}>
                          <span className={`text-${getStatusConfig(order.status).color}-600`}>
                            {getStatusConfig(order.status).icon}
                          </span>
                          <span className={`font-black uppercase tracking-widest text-xs text-${getStatusConfig(order.status).color}-600`}>
                            {getStatusConfig(order.status).text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 group/item">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border border-white relative">
                            <img 
                              src={item.product?.image || 'https://via.placeholder.com/100'} 
                              alt={item.product?.name}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Title level={5} className="!mb-1 truncate group-hover/item:text-orange-500 transition-colors uppercase tracking-tight !font-bold">
                              {item.product?.name}
                            </Title>
                            <div className="flex items-center gap-4">
                              <Text className="text-sm font-black text-gray-400 tracking-wider">
                                ¥{item.price.toFixed(2)} <span className="mx-1 text-[10px]">×</span> {item.quantity}
                              </Text>
                              <div className="h-4 w-px bg-gray-100" />
                              <Tag className="m-0 rounded-lg border-none bg-orange-50 text-orange-500 font-black text-[10px] py-0 px-2 uppercase tracking-widest">
                                官方认证
                              </Tag>
                            </div>
                          </div>
                          <div className="hidden md:block text-right">
                            <Text className="text-lg font-black tracking-tighter italic">¥{(item.price * item.quantity).toFixed(2)}</Text>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Divider className="my-10 border-gray-100" />

                    <div className="flex flex-wrap justify-between items-center gap-6">
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 text-xl border border-white shadow-inner">
                             <ClockCircleOutlined />
                          </div>
                          <div>
                             <Text className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">预计送达</Text>
                             <Text className="font-bold text-gray-400 italic">常规物流派送中</Text>
                          </div>
                       </div>
                       
                       <div className="text-right">
                          <Text className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-1">实付款 (含运费)</Text>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-black text-orange-500 italic">CNY</span>
                            <span className="text-4xl font-black tracking-tighter italic bg-gradient-to-br from-orange-500 to-red-600 bg-clip-text text-transparent">
                               ¥{order.total.toFixed(2)}
                            </span>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  {/* 底部的流光条装饰 */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-500/20 via-red-600/40 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        
        <div className="mt-20 text-center pb-20">
           <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/60 border border-white/60 shadow-xl group cursor-pointer hover:bg-white transition-all" onClick={() => navigate('/')}>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-orange-500 transition-colors">返回商城首页</span>
              <ShoppingOutlined className="text-gray-300 group-hover:text-orange-500 transition-colors" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
