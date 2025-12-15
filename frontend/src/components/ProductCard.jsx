import { useState } from 'react';
import { Card, Button, Typography, message, Empty, Badge, Image } from 'antd'; // Import Image
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import imgError from '../assets/imgs/imgError.png';

const { Text } = Typography;

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  // Removed local imgError state as Antd Image handles fallback
  
  // Calculate quantity of this product in cart
  const cartItem = cartItems.find(item => item.product._id === product._id || item.product === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click
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
      className="w-full rounded-xl overflow-hidden"
      bodyStyle={{ padding: 12 }}
      cover={
        <div 
          className="relative w-full aspect-square overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => navigate(`/product/${product._id}`)}
        >
            <Image
              alt={product.name}
              src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
              fallback={imgError}
              preview={false}
              className="w-full h-full object-cover transition-transform duration-300 mix-blend-multiply group-hover:scale-105"
            />
        </div>
      }
    >
      <div onClick={() => navigate(`/product/${product._id}`)} className="cursor-pointer">
        <div className="h-11 overflow-hidden mb-2">
          <Text 
            strong 
            className="text-sm leading-[22px] line-clamp-2 block"
            title={product.name}
          >
            {product.name}
          </Text>
        </div>
      
        <div className="flex items-end justify-between">
          <div>
            <Text className="text-lg text-red-500 font-bold block">
              <span className="text-xs">¥</span>{product.price?.toFixed(2)}
            </Text>
            <Text delete type="secondary" className="text-xs">
              ¥{(product.price * 1.5).toFixed(2)}
            </Text>
          </div>
        </div>
      </div>
      
      <div className="absolute right-3 bottom-3">
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
