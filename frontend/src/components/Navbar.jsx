import { Layout, Menu, Button, Badge, Dropdown, Space, Avatar, Input } from 'antd'; // Added Input, Badge, Avatar, removed Typography, message
import { ShoppingCartOutlined, UserOutlined, HomeOutlined, AppstoreOutlined, SearchOutlined } from '@ant-design/icons'; // Added SearchOutlined, removed LogoutOutlined
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Added useCart
import '../scss/navbar.scss'

const { Header } = Layout;
const { Search } = Input; // Destructure Search

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart(); // Use Cart Context

  // Basic total quantity calc (can be improved to use context value if context provides it)
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
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px #f0f1f2', position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Logo */}
      <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '20px' }}>
        <Link to="/" style={{ color: '#ff4d4f' }}>Taobao Clone</Link>
      </div>

      {/* Search Bar - Center */}
      <div style={{ flex: 1, maxWidth: 600, margin: '0 20px' }}>
         <Search 
            placeholder="搜索商品..." 
            onSearch={onSearch} 
            className='seach-input'
            enterButton 
            size="large" 
         />
      </div>

      {/* Right Menu */}
      <Space size="middle" style={{ marginLeft: '20px' }}>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ borderBottom: 'none', flex: 'none', width: 'auto', background: 'transparent' }}
          items={[
            { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
            { key: '/products', icon: <AppstoreOutlined />, label: <Link to="/products">全部商品</Link> },
          ]}
        />

        <Link to="/cart">
          <Button type="text" icon={
            <Badge count={cartCount} size="small" offset={[2, 0]}>
              <ShoppingCartOutlined style={{ fontSize: '20px', color: '#333' }} />
            </Badge>
          } style={{ padding: '0 8px' }} />
        </Link>
        
        {user ? (
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', marginLeft: 10 }}>
               <Avatar style={{ backgroundColor: '#ff4d4f' }} icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        ) : (
          <Space style={{ marginLeft: 10 }}>
             <Link to="/login">
               <Button type="text">登录</Button>
             </Link>
             <Link to="/register">
               <Button type="primary" style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>注册</Button>
             </Link>
          </Space>
        )}
      </Space>
    </Header>
  );
};

export default Navbar;
