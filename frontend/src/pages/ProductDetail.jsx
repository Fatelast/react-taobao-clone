import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, Card, Rate, Divider, Image, Spin, message, InputNumber, Badge } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import imgError from '../assets/imgs/imgError.png'

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth(); // Need to check login for Buy Now or just Add to Cart check

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        message.error('加载商品详情失败');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      message.info('请先登录');
      navigate('/login');
      return;
    }
    const success = await addToCart(product._id, qty);
    // success message handled in context
  };

  const handleBuyNow = () => {
     if (!user) {
      message.info('请先登录');
      navigate('/login');
      return;
    }
    // Logic for buy now: add to cart (or not) and go to checkout. 
    // Simplified: Add to cart and go to cart.
    addToCart(product._id, qty);
    navigate('/cart');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: 100 }}>商品不存在</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Row gutter={[40, 40]}>
          {/* 左侧图片 */}
          <Col xs={24} md={10}>
             <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                <Image
                  src={product.image || 'https://via.placeholder.com/500x500'}
                  fallback={imgError}
                  style={{ width: '100%', display: 'block' }}
                />
             </div>
          </Col>

          {/* 右侧信息 */}
          <Col xs={24} md={14}>
            <Title level={2}>{product.name}</Title>
            <Space split={<Divider type="vertical" />}>
               <Rate disabled defaultValue={4.5} allowHalf style={{ fontSize: 14 }} />
               <Text type="secondary">100+ 评价</Text>
               <Text type="secondary">200+ 销量</Text>
            </Space>
            
            <div style={{ background: '#fafafa', padding: '20px', marginTop: 24, borderRadius: 8 }}>
               <Text type="secondary">价格</Text>
               <div style={{ marginTop: 4 }}>
                  <Text type="danger" style={{ fontSize: 32, fontWeight: 'bold' }}>
                    <span style={{ fontSize: 18 }}>¥</span>{product.price.toFixed(2)}
                  </Text>
                  <Text delete type="secondary" style={{ marginLeft: 12 }}>
                    ¥{(product.price * 1.5).toFixed(2)}
                  </Text>
               </div>
            </div>

            <Divider />

            {/* 规格/数量选择 */}
            <div style={{ marginBottom: 24 }}>
               <Space direction="vertical" size="large">
                 <Space>
                   <Text type="secondary" style={{ width: 60 }}>数量</Text>
                   <InputNumber min={1} max={99} value={qty} onChange={setQty} />
                   <Text type="secondary">库存 {product.stock} 件</Text>
                 </Space>
               </Space>
            </div>

            {/* 操作按钮 */}
            <Space size="middle" style={{ marginTop: 12 }}>
              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  background: '#ffeded', 
                  borderColor: '#ffeded', 
                  color: '#ff4d4f', 
                  minWidth: 140,
                  height: 50
                }}
                onClick={handleBuyNow}
              >
                立即购买
              </Button>
              <Button 
                 type="primary" 
                 size="large" 
                 icon={<ShoppingCartOutlined />}
                 style={{ 
                   background: '#ff4d4f', 
                   borderColor: '#ff4d4f', 
                   minWidth: 140,
                   height: 50
                 }}
                 onClick={handleAddToCart}
              >
                加入购物车
              </Button>
            </Space>
            
            {/* 服务保障 */}
             <div style={{ marginTop: 40 }}>
               <Space size="large" style={{ color: '#888' }}>
                 <Space><SafetyCertificateOutlined /> 正品保障</Space>
                 <Space><SafetyCertificateOutlined /> 七天无理由退换</Space>
                 <Space><SafetyCertificateOutlined /> 极速发货</Space>
               </Space>
             </div>
          </Col>
        </Row>
      </Card>

      {/* 详细描述 */}
      <Card style={{ marginTop: 40 }} title="商品详情">
         <div dangerouslySetInnerHTML={{ __html: product.description || '<p>暂无详细描述</p>' }} />
         {/* Simulate rich text content */}
         <div style={{ marginTop: 20, color: '#666', lineHeight: 1.8 }}>
            <p>这里是示例商品的详细介绍。通常包含更多图片、参数表、使用说明等。</p>
            <Image src="https://via.placeholder.com/800x400?text=Detail+Banner" style={{ maxWidth: '100%' }} />
         </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
