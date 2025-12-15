import { useState } from 'react';
import { Card, Button, Typography, message, Empty, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { Text } = Typography;

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  
  // Calculate quantity of this product in cart
  const cartItem = cartItems.find(item => item.product._id === product._id || item.product === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      message.info('请先登录');
      navigate('/login');
      return;
    }
    await addToCart(product._id);
  };

  return (
    <Card
      hoverable
      style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
      bodyStyle={{ padding: 12 }}
      cover={
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5' }}>
          <Link to="/products">
            {imgError ? (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图片" />
              </div>
            ) : (
              <img
                alt={product.name}
                src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                onError={() => setImgError(true)}
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
            )}
          </Link>
        </div>
      }
    >
      <Link to="/products" style={{ color: 'inherit' }}>
        <div style={{ height: 44, overflow: 'hidden', marginBottom: 8 }}>
          <Text 
            strong 
            style={{ 
              fontSize: 14, 
              lineHeight: '22px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Text>
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <Text type="danger" strong style={{ fontSize: 18 }}>
            <span style={{ fontSize: 12 }}>¥</span>{product.price?.toFixed(2)}
          </Text>
          <br />
          <Text delete type="secondary" style={{ fontSize: 12 }}>
            ¥{(product.price * 1.5).toFixed(2)}
          </Text>
        </div>
        <Badge count={quantity} offset={[-5, 5]} showZero={false}>
          <Button
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined />}
            size="middle"
            onClick={handleAddToCart}
          />
        </Badge>
      </div>
    </Card>
  );
};

export default ProductCard;
