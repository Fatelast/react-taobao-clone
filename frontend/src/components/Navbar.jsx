import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Badge, Dropdown, Space, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, HomeOutlined, AppstoreOutlined, RocketOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../scss/navbar.scss';

const { Header } = Layout;

// 移除旧的 MembershipBadge 组件

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
      key: 'address',
      label: <Link to="/address">地址管理</Link>,
    },
    ...(user && user.membershipTier !== 'ultra' ? [{
      key: 'upgrade',
      icon: <RocketOutlined />,
      label: (
        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-black">
          升级会员
        </span>
      ),
    }] : []),
    {
      key: '2',
      label: <span onClick={handleLogout}>退出登录</span>,
    },
  ];

  return (
    <Header 
      className={`navbar-promax-fixed ${isScrolled ? 'is-scrolled' : ''}`}
    >
      {/* Logo */}
      <div className="text-2xl font-bold mr-5 shrink-0 flex items-center">
        <Link to="/" className="text-red-500 hover:text-red-600 flex items-center h-full">Taobao Clone</Link>
      </div>

      {/* Search Bar - Absolute Center */}
      {location.pathname !== '/products' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] z-50">
          <div className="search-promax-container group">
            <SearchOutlined className="search-icon-left" />
            <input 
              type="text" 
              placeholder="搜索发现全球好物..." 
              className="search-promax-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch(e.target.value);
                }
              }}
            />
            <div className="search-btn-right" onClick={(e) => {
                const input = e.currentTarget.previousSibling;
                onSearch(input.value);
            }}>
              <SearchOutlined />
            </div>
          </div>
        </div>
      )}

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
             id="cart-icon-target"
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
            <div className={`membership-avatar-wrapper tier-${user.membershipTier || 'basic'} cursor-pointer`}>
               {/* 左侧文字识别区 */}
               <span className={`tier-text ${user.membershipTier || 'basic'}-text`}>
                 {user.membershipTier === 'ultra' ? 'ULTRA' : 
                  user.membershipTier === 'pro' ? 'PRO' : 'BASIC'}
               </span>

               {/* 几何校准的核心：独立的光环锚点容器 */}
               <div className="avatar-aura-anchor">
                  <div className="halo-ring"></div>
                  <div className="avatar-inner">
                     <Avatar 
                       className={user.membershipTier === 'ultra' ? 'bg-gray-900 border border-yellow-500/20' : 'bg-red-500'} 
                       icon={<UserOutlined />} 
                     />
                  </div>
               </div>
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
