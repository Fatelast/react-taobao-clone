import { Card, Button, Typography, message, Badge, Image } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
const { Text } = Typography;

// 极致轻量化占位图 (PRO MAX)
const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f9fafb'/%3E%3Ctext y='50%25' x='50%25' font-size='20' text-anchor='middle' dominant-baseline='central' fill='%239ca3af' font-family='sans-serif'%3E暂无图片%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  // Removed local imgError state as Antd Image handles fallback
  
  // Calculate quantity of this product in cart - 增加安全检查 (PRO MAX)
  const cartItem = Array.isArray(cartItems) ? cartItems.find(item => {
    if (!item || !item.product) return false;
    const prodId = typeof item.product === 'object' ? item.product._id : item.product;
    return prodId === product._id;
  }) : null;
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
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        hoverable={false} // Disable Antd hover (using motion instead)
        className="w-full rounded-xl overflow-hidden h-full border-gray-100"
        bodyStyle={{ padding: 12 }}
        cover={
          <div 
            className="relative w-full aspect-square overflow-hidden bg-gray-50 cursor-pointer group flex items-center justify-center p-2"
            onClick={() => navigate(`/product/${product._id}`)}
          >
              <Image
                alt={product.name}
                src={product.image || PLACEHOLDER_SVG}
                fallback={PLACEHOLDER_SVG}
                preview={false}
                placeholder={
                   <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                   </div>
                }
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
          </div>
        }
      >
        <div onClick={() => navigate(`/product/${product._id}`)} className="cursor-pointer">
          <div className="h-11 overflow-hidden mb-2">
            <Text 
              strong 
              className="text-sm leading-[22px] line-clamp-2 block text-gray-700"
              title={product.name}
            >
              {product.name}
            </Text>
          </div>
        
          <div className="flex items-end justify-between">
            <div>
              <Text className="text-xl text-orange-600 font-bold block">
                <span className="text-sm mr-0.5">¥</span>{(product.price || 0).toFixed(2)}
              </Text>
              <Text delete type="secondary" className="text-[10px] text-gray-400">
                ¥{((product.price || 0) * 1.5).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>
        
        <div className="absolute right-3 bottom-3 z-10">
            <Badge count={quantity} offset={[-5, 5]} showZero={false}>
              <motion.div whileTap={{ scale: 0.8 }}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                  size="middle"
                  className="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 shadow-md"
                  onClick={handleAddToCart}
                />
              </motion.div>
            </Badge>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
