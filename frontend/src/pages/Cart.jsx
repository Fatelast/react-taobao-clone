import React, { useState } from 'react';
import { Table, Button, InputNumber, Typography, Popconfirm, Spin, Tag, Divider, Row, Col, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, CreditCardOutlined, SafetyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await api.post('/orders');
      await clearCart(); 
      message.success('支付成功，正在为您准备商品');
      navigate('/orders');
    } catch (err) {
      message.error(err.response?.data?.msg || '下单失败');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center py-40 min-h-screen">
        <Spin size="large" tip="正在为您同步购物车..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-6 bg-[#fcfcfc]">
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-[1400px] mx-auto glass-card rounded-[3rem] p-24 text-center"
        >
          <div className="text-8xl mb-12 opacity-20">🛒</div>
          <Title level={2} className="!font-black !mb-6 !text-gray-950">您的购物车空空如也</Title>
          <Text className="text-xl text-gray-500 block mb-12 font-medium">还没有心仪的商品吗？快去商城发现属于你的宝藏吧。</Text>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/products')}
            className="h-16 px-16 rounded-2xl text-lg font-black bg-orange-500 border-none shadow-xl hover:scale-105 transition-transform"
          >
            马上去逛逛
          </Button>
        </motion.div>
      </div>
    );
  }

  const columns = [
    {
      title: '商品详情',
      dataIndex: 'product',
      key: 'product',
      width: '45%',
      render: (product) => (
        <div className="flex items-center gap-6 group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500">
            <img 
              src={product.image || 'https://via.placeholder.com/150'} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <Text className="text-lg font-black text-[#1a1a1a] block group-hover:text-orange-500 transition-colors uppercase tracking-tight">{product.name}</Text>
            <div className="flex items-center gap-2">
               <Tag className="!m-0 rounded-md border-none px-2 font-bold text-[10px] bg-orange-500 text-white">PREMIUM</Tag>
               <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {product._id.slice(-6)}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '单价',
      dataIndex: 'product',
      key: 'price',
      render: (product) => (
        <Text className="text-lg font-bold text-gray-600 font-mono italic">¥{product.price.toFixed(2)}</Text>
      ),
    },
    {
      title: '数量选择',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <div className="glass-card w-fit px-4 py-2 rounded-xl border-white/40">
           <InputNumber 
            min={1} 
            max={99} 
            value={quantity} 
            onChange={(val) => updateQuantity(record.product._id, val)}
            className="!border-none !bg-transparent font-black"
          />
        </div>
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_, record) => (
        <Text className="text-xl font-black text-orange-500 font-mono tracking-tighter">¥{(record.product.price * record.quantity).toFixed(2)}</Text>
      ),
    },
    {
      title: '移除',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Popconfirm title="确定将其从购物车移除吗?" onConfirm={() => removeFromCart(record.product._id)} cancelText="取消" okText="移除">
          <Button type="text" className="w-12 h-12 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
             <DeleteOutlined className="text-xl" />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="min-h-screen pb-32 bg-[#fcfcfc] relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-main opacity-30 -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[120px] -z-10 animate-float" />

      <div className="max-w-[1400px] mx-auto pt-24 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-end gap-6 mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
             <ShoppingCartOutlined className="text-3xl text-white relative z-10" />
          </div>
          <div>
            <Title className="!text-5xl !font-black !mb-2 tracking-tighter uppercase italic !text-gray-900">Shopping Cart</Title>
            <Text className="text-gray-500 font-bold tracking-widest uppercase text-[10px] border-l-2 border-orange-500 pl-4">您的私人珍宝库 ({cartItems.length} 件商品)</Text>
          </div>
        </motion.div>

        <Row gutter={[40, 40]}>
          <Col xs={24} xl={17}>
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="glass-card rounded-[3rem] p-8 shadow-2xl border-white/60 bg-white/40"
            >
              <Table 
                dataSource={cartItems} 
                columns={columns} 
                rowKey={(item) => item.product._id} 
                pagination={false}
                className="premium-table"
              />
              
              <div className="mt-12 flex justify-between items-center">
                 <Button 
                   type="text" 
                   onClick={() => navigate('/products')}
                   className="text-gray-500 hover:text-orange-500 font-black tracking-widest uppercase text-[10px] flex items-center gap-2"
                 >
                    ← 继续购物
                 </Button>
                 <Popconfirm title="此操作将永久清空购物车，确定吗?" onConfirm={clearCart} cancelText="取消" okText="清空">
                    <Button danger type="text" className="font-bold tracking-widest uppercase text-xs hover:underline decoration-2">清空全部商品</Button>
                 </Popconfirm>
              </div>
            </motion.div>
          </Col>

          {/* 结算 Bento 板块 */}
          <Col xs={24} xl={7}>
             <motion.div 
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="flex flex-col gap-6 sticky top-24"
             >
                <div className="glass-card rounded-[3rem] p-10 bg-[#080808] text-white shadow-2xl overflow-hidden relative border border-white/10">
                   {/* 背景氛围加固 */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/15 rounded-full blur-[100px]" />
                   <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />
                   
                   <Title level={4} className="!text-white/90 !font-black !mb-10 uppercase tracking-[0.3em] !text-[11px] opacity-100 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                     Financial Summary
                   </Title>
                   
                   <div className="flex flex-col gap-6 mb-12 relative z-10">
                      <div className="flex justify-between items-center">
                         <Text className="!text-white/70 font-bold text-sm uppercase tracking-wider">Subtotal Items</Text>
                         <Text className="!text-white text-lg font-mono font-black">¥{totalPrice.toFixed(2)}</Text>
                      </div>
                      <div className="flex justify-between items-center">
                         <Text className="!text-white/70 font-bold text-sm uppercase tracking-wider">Express Delivery</Text>
                         <Text className="text-sm uppercase !text-white font-mono font-black tracking-tighter">Free of Charge</Text>
                      </div>
                      <Divider className="border-white/10 !m-0" />
                      <div className="flex flex-col gap-3 mt-2">
                         <Text className="!text-white/60 uppercase font-black tracking-[0.2em] text-[10px]">Total Payable Amount</Text>
                         <div className="flex items-center gap-1 overflow-hidden">
                            <Text className="text-gradient !text-4xl font-black whitespace-nowrap leading-none transition-all tracking-tighter drop-shadow-2xl">
                              ¥{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                         </div>
                      </div>
                   </div>

                   <Button 
                     type="primary" 
                     size="large" 
                     onClick={handleCheckout} 
                     loading={checkoutLoading}
                     className="h-20 w-full rounded-[1.5rem] bg-orange-500 border-none font-black text-xl tracking-widest shadow-xl hover:scale-105 transition-all shine-effect flex items-center justify-center gap-3"
                   >
                     <CreditCardOutlined /> SECURE CHECKOUT
                   </Button>
                </div>

                <div className="glass-card rounded-[2.5rem] p-8 flex items-center justify-between border-white/50 bg-white/60">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <SafetyOutlined className="text-xl" />
                       </div>
                       <div>
                          <Text className="font-black text-sm block">100% 安全支付保障</Text>
                          <Text className="text-gray-400 text-xs uppercase tracking-widest">SSL Encrypted Transaction</Text>
                       </div>
                    </div>
                </div>
             </motion.div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;
