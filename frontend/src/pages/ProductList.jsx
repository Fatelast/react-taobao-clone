import { useEffect, useState } from 'react';
import { Card, Row, Col, Button, message, Typography, Spin, Empty } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Remove token requirement for viewing products if public, but keep it if auth required by backend
        // Backend products.js: router.get('/', ...) is public? 
        // Let's check products.js again. Lines 7: router.get('/', ...) - it is public!
        // But previously it had header with token? "headers: { Authorization..."
        // If it's public, token is optional. Better to send if available?
        // Let's send it if available, else don't.
        
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.info('请先登录');
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart/add', { productId: id, quantity: 1 });
      message.success('已加入购物车');
    } catch (err) {
      message.error(err.response?.data?.msg || '加入失败');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <Title level={2}>全部商品</Title>
        <Text type="secondary">精选好物，等你来挑</Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>
      ) : products.length === 0 ? (
        <Empty description="暂无商品" />
      ) : (
        <Row gutter={[20, 24]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product._id} style={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
                bodyStyle={{ padding: 12 }}
                cover={
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5' }}>
                     {/* Product List image height slightly larger than Home */}
                    <img
                      alt={product.name}
                      src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300?text=Error'; }}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                        mixBlendMode: 'multiply'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                }
              >
                <div style={{ height: 44, overflow: 'hidden', marginBottom: 8 }}>
                  <Text 
                    strong 
                    style={{ 
                      fontSize: 15, 
                      lineHeight: '22px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Text>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <Text type="danger" strong style={{ fontSize: 20 }}>
                      <span style={{ fontSize: 14 }}>¥</span>{product.price?.toFixed(2)}
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    onClick={() => addToCart(product._id)}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;