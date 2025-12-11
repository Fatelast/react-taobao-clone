import React, { useEffect, useState } from 'react';
import { Card, Table, Button, InputNumber, Popconfirm, message, Empty, Typography, Space, Statistic } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      // message.error('Failed to load cart'); // Interceptor or global handler might be better, or silence
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      await api.put('/cart/update', { productId, quantity });
      fetchCart();
    } catch (err) {
      message.error('Failed to update');
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      message.success('Item removed');
      fetchCart();
    } catch (err) {
      message.error('Failed to remove');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCartItems([]);
      message.success('Cart cleared');
    } catch (err) {
      message.error('Failed to clear');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setCheckoutLoading(true);
    try {
      await api.post('/orders/checkout'); // Assume backend handles items from cart DB
      message.success('下单成功！');
      fetchCart();
      navigate('/orders');
    } catch (err) {
      message.error(err.response?.data?.msg || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'product',
      key: 'product',
      render: (product) => (
        <Space>
           <img 
             src={product?.image || 'https://via.placeholder.com/60'} 
             alt={product?.name} 
             style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} 
           />
           <div style={{ maxWidth: 200 }}>
             <Text strong>{product?.name}</Text>
           </div>
        </Space>
      ),
    },
    {
      title: '单价',
      dataIndex: 'product',
      key: 'price',
      render: (product) => <Text>¥{product?.price?.toFixed(2)}</Text>,
    },
    {
      title: '数量',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber 
          min={1} 
          max={record.product?.stock} // Limit by stock
          value={record.quantity} 
          onChange={(val) => updateQuantity(record.product._id, val)} 
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_, record) => <Text strong style={{ color: '#ff4d4f' }}>¥{(record.product?.price * record.quantity).toFixed(2)}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="确定删除吗?" onConfirm={() => removeItem(record.product._id)}>
          <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      ),
    },
  ];

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 30 }}><ShoppingOutlined /> 购物车</Title>
      
      <Table 
        loading={loading}
        dataSource={cartItems} 
        columns={columns} 
        rowKey={(record) => record.product?._id || Math.random()} 
        pagination={false}
        locale={{ emptyText: <Empty description="购物车空空如也，快去选购吧" /> }}
      />
      
      {cartItems.length > 0 && (
        <Card style={{ marginTop: 24, textAlign: 'right' }}>
           <Space size="large" align="center">
             <Button onClick={clearCart}>清空购物车</Button>
             <Statistic title="总计" value={totalPrice} precision={2} prefix="¥" valueStyle={{ color: '#ff4d4f' }} />
             <Button type="primary" size="large" onClick={handleCheckout} loading={checkoutLoading} style={{ background: '#ff4d4f', borderColor: '#ff4d4f', minWidth: 120 }}>
               立即结算
             </Button>
           </Space>
        </Card>
      )}
    </div>
  );
};

export default Cart;