import { Layout, Menu, Button, Space, Typography, Dropdown, message } from 'antd';
import { ShoppingCartOutlined, UserOutlined, HomeOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // Use Context

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  return (
    <Header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div className="logo" style={{ marginRight: 20 }}>
        <Link to="/" style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
             TaoBao
        </Link>
      </div>

      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ flex: 1, borderBottom: 'none' }}
        items={[
          { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页</Link> },
          { key: '/products', icon: <AppstoreOutlined />, label: <Link to="/products">全部商品</Link> },
          { key: '/cart', icon: <ShoppingCartOutlined />, label: <Link to="/cart">购物车</Link> },
           { key: '/orders', icon: <div style={{ fontSize: 16 }}>📦</div>, label: <Link to="/orders">我的订单</Link> }
        ]}
      />

      <div style={{ marginLeft: 20 }}>
        {user ? (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
               <div style={{ width: 32, height: 32, backgroundColor: '#ff4d4f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                 <UserOutlined />
               </div>
              <Text strong>{user.username}</Text>
            </Space>
          </Dropdown>
        ) : (
          <Space>
             <Link to="/login">
               <Button type="text">登录</Button>
             </Link>
             <Link to="/register">
               <Button type="primary" style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>注册</Button>
             </Link>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
