import { Layout, Menu, Button, Badge, Dropdown, Space, Avatar, Input } from 'antd';
import { ShoppingCartOutlined, UserOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../scss/navbar.scss';

const { Header } = Layout;
const { Search } = Input;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(value.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const userMenu = [
    {
      key: '1',
      label: <Link to="/orders">我的订单</Link>,
    },
    {
      key: '2',
      label: <span onClick={handleLogout}>退出登录</span>,
    },
  ];

  return (
    <Header 
      style={{ background: '#fff', padding: '0 20px', height: 64, lineHeight: '64px' }} 
      className="flex items-center justify-between shadow-sm sticky top-0 z-[1000]"
    >
      {/* Logo */}
      <div className="text-2xl font-bold mr-5 shrink-0 flex items-center">
        <Link to="/" className="text-red-500 hover:text-red-600 flex items-center h-full">Taobao Clone</Link>
      </div>

      {/* Search Bar - Center */}
      <div className="flex-1 max-w-[600px] mx-5 flex items-center">
         <Search 
            placeholder="搜索商品..." 
            onSearch={onSearch} 
            className='search-input'
            enterButton 
            size="large" 
            style={{ borderRadius: '20px' }}
         />
      </div>

      {/* Right Menu */}
      <div className="flex items-center gap-4">
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="border-b-0 min-w-[200px]"
          style={{ background: 'transparent', lineHeight: '62px' }}
          items={[
            { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
            { key: '/products', icon: <AppstoreOutlined />, label: <Link to="/products">全部商品</Link> },
          ]}
        />

        <Link to="/cart" className="flex items-center">
          <motion.div
             key={cartCount}
             initial={{ scale: 1 }}
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 0.3 }}
          >
            <Button type="text" icon={
                <Badge count={cartCount} size="small" offset={[2, 0]}>
                <ShoppingCartOutlined className="text-xl text-gray-800" />
                </Badge>
            } className="px-2 flex items-center justify-center" />
          </motion.div>
        </Link>
        
        {user ? (
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div className="cursor-pointer ml-2 flex items-center">
               <Avatar className="bg-red-500" icon={<UserOutlined />} />
            </div>
          </Dropdown>
        ) : (
          <Space className="ml-2">
             <Link to="/login">
               <Button type="text">登录</Button>
             </Link>
             <Link to="/register">
               <Button type="primary" className="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600">注册</Button>
             </Link>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
