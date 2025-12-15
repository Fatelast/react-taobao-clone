import React, { useState } from 'react';
import { Table, Button, InputNumber, Typography, Card, Space, message, Popconfirm, Empty, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await api.post('/orders');
      await clearCart(); 
      message.success('下单成功');
      navigate('/orders');
    } catch (err) {
      message.error(err.response?.data?.msg || '下单失败');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading && cartItems.length === 0) { // Only show spin if initial load and empty
    return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;
  }

  if (cartItems.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center' }}><Empty description="购物车空空如也" /></div>;
  }

  const columns = [
    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
      render: (product) => (
        <Space>
          <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
          <Text>{product.name}</Text>
        </Space>
      ),
    },
    {
      title: '单价',
      dataIndex: 'product',
      key: 'price',
      render: (product) => `¥${product.price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber 
          min={1} 
          max={99} 
          value={quantity} 
          onChange={(val) => updateQuantity(record.product._id, val)}
        />
      ),
    },
    {
      title: '小计',
      key: 'subtotal',
      render: (_, record) => `¥${(record.product.price * record.quantity).toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm title="确定删除吗?" onConfirm={() => removeFromCart(record.product._id)} cancelText="取消" okText="确定">
          <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>购物车</Title>
      <Card>
        <Table 
          dataSource={cartItems} 
          columns={columns} 
          rowKey={(item) => item.product._id} 
          pagination={false}
        />
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Space size="large">
            <Text style={{ fontSize: 18 }}>
              总计: <Text type="danger" strong style={{ fontSize: 24 }}>¥{totalPrice.toFixed(2)}</Text>
            </Text>
            <Button type="primary" size="large" onClick={handleCheckout} loading={checkoutLoading}>
              去结算
            </Button>
          </Space>
        </div>
      </Card>
      
      <div style={{ marginTop: 20, textAlign: 'right' }}>
         <Popconfirm title="确定清空购物车吗?" onConfirm={clearCart} cancelText="取消" okText="确定">
            <Button danger>清空购物车</Button>
         </Popconfirm>
      </div>
    </div>
  );
};

export default Cart;