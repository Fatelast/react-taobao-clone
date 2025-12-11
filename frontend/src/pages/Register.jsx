import { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TaobaoCircleOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/register', values);
      localStorage.setItem('token', res.data.token); // 存token
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('注册成功');
      navigate('/products');
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.msg || '注册失败');
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
      background: 'linear-gradient(135deg, #ff9c6e 0%, #ff4d4f 100%)',
      padding: 20
    }}>
      <Card 
        style={{ width: 400, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <TaobaoCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
          <Title level={2} style={{ marginTop: 10, marginBottom: 0 }}>创建账号</Title>
          <Text type="secondary">加入我们，开启购物之旅</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少 6 位' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>
              立即注册
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Text>已有账号？ <Link to="/login" style={{ color: '#ff4d4f' }}>直接登录</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;