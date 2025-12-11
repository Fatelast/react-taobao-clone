import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Typography, Empty, Divider } from 'antd';
import api from '../utils/api';
// import { useNavigate } from 'react-router-dom'; // Removed as per instruction

const { Title, Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate(); // Removed as per instruction
  // const token = localStorage.getItem('token'); // Removed as per instruction

  useEffect(() => {
    // if (!token) return navigate('/login'); // Removed as per instruction

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders'); // Changed from axios to api
        setOrders(res.data);
      } catch (err) {
        console.error(err); // Added console.error as per instruction
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // Dependency array changed from [token, navigate] to []

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <Title level={2}>我的订单</Title>

      {orders.length === 0 ? (
        <Empty description="暂无订单" />
      ) : (
        <List
          loading={loading}
          dataSource={orders}
          renderItem={(order) => (
            <List.Item>
              <Card style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text strong>订单号：{order._id}</Text>
                  <div>
                    <Tag color="orange">{order.status}</Tag>
                    <Text type="secondary">
                      {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </div>
                </div>

                <List
                  size="small"
                  dataSource={order.items}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<img src={item.product.image || 'https://via.placeholder.com/60'} width={60} height={60} style={{ objectFit: 'cover' }} />}
                        title={item.product.name}
                        description={`¥${item.price.toFixed(2)} × ${item.quantity}`}
                      />
                      <div>小计 ¥{(item.price * item.quantity).toFixed(2)}</div>
                    </List.Item>
                  )}
                />

                <Divider />
                <div style={{ textAlign: 'right' }}>
                  <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                    实付款：¥{order.total.toFixed(2)}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Orders;