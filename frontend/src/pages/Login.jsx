import { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, TaobaoCircleOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
// ... (rest of the file until the anchor tag)
// I will just replace the import and the anchor tag in one go or separate if needed. 
// Let's use multi_replace for precision or just replace the chunks.
// Actually, I can just replace the top import and the specific line for anchor.
// But replace_file_content is single block.
// I will use multi_replace_file_content.

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/login', values);
      // 如果后端路由是 /login，请改回。根据之前 server.js 分析，auth 路由挂载在 /，但 auth.js 里是 /login。
      // Wait, server.js says: app.use(authRouter.routes());
      // auth.js says: router.post('/login', ...)
      // So the path is /login. 
      // BUT strict analysis: server.js: app.use(authRouter.routes()) with NO prefix for authRouter?
      // server.js content:
      // const authRouter = require('./routes/auth');
      // app.use(authRouter.routes()).use(authRouter.allowedMethods());
      // auth.js content: router.post('/login', ...)
      // So URL is http://localhost:5000/login. 
      
      login(res.data.token,res.data.user)
      message.success('登录成功');
      navigate('/');
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.msg || '登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ff9c6e 0%, #ff4d4f 100%)', // 淘宝橙红渐变
      padding: 20
    }}>
      <Card 
        style={{ width: 400, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <TaobaoCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
          <Title level={2} style={{ marginTop: 10, marginBottom: 0 }}>欢迎登录</Title>
          <Text type="secondary">虽然是克隆版，但体验依然极致</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '邮箱格式不正确' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: '#ff4d4f' }}>忘记密码？</Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>
              立即登录
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Text>还没有账号？ <Link to="/register" style={{ color: '#ff4d4f' }}>立即注册</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;