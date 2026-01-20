import { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, ConfigProvider, theme } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, TaobaoCircleOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 注册请求
      const res = await api.post('/register', values);
      
      const { token, user: userData } = res.data;
      login(token, userData);
      
      toast.success('身份生成成功！正在同步权限...');
      
      // 稍作延迟以获得更顺滑的视觉反馈
      setTimeout(() => {
        navigate('/');
      }, 800);
      
    } catch (err) {
      console.error('Registration Security Exception:', err);
      toast.error(err.extractedMsg || '安全协议建立失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff6a00',
          borderRadius: 16,
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      {/* 动态漫射背景层 */}
      <div className="absolute inset-0 z-0">
        <motion.div 
           animate={{ 
             scale: [1.2, 1, 1.2],
             rotate: [0, -90, 0],
             x: [0, -100, 0]
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-orange-600/15 rounded-full blur-[150px]"
        />
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [90, 0, 90],
             x: [0, 100, 0]
           }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-[20%] -left-[10%] w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[180px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[550px] px-6"
      >
        <div className="glass-card rounded-[3.5rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-white/10 bg-white/5 backdrop-blur-3xl">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, delay: 0.2 }}
              className="inline-block p-4 rounded-3xl bg-gradient-to-br from-orange-400 to-red-600 mb-6 shadow-xl"
            >
              <TaobaoCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
            </motion.div>
            <Title className="!text-white !font-black !mb-2 !text-4xl tracking-tighter italic">创建身份</Title>
            <div className="flex justify-center gap-2 items-center">
               <div className="h-px bg-white/10 w-12" />
               <Text className="!text-white/40 uppercase font-black tracking-[0.3em] text-[10px]">新成员门户</Text>
               <div className="h-px bg-white/10 w-12" />
            </div>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            scrollToFirstError
            className="premium-form"
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '如何称呼您?' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-orange-500 mr-2" />} 
                    placeholder="用户名 / USERNAME" 
                    className="h-16 rounded-2xl bg-black/40 border-white/10 !text-white hover:border-orange-500/50 focus:border-orange-500 transition-all font-bold placeholder:text-white/20 shadow-inner"
                  />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: '邮箱是身份的象征' }, { type: 'email', message: '格式不规范' }]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-orange-500 mr-2" />} 
                    placeholder="电子邮箱 / EMAIL" 
                    className="h-16 rounded-2xl bg-black/40 border-white/10 !text-white hover:border-orange-500/50 focus:border-orange-500 transition-all font-bold placeholder:text-white/20 shadow-inner"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '密匙不可空' }, { min: 6, message: '至少 6 位' }]}
                  hasFeedback
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-orange-500 mr-2" />} 
                    placeholder="密码 / KEY" 
                    className="h-16 rounded-2xl bg-black/40 border-white/10 !text-white hover:border-orange-500/50 focus:border-orange-500 transition-all font-bold placeholder:text-white/20 shadow-inner"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="confirm"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: '请重复密匙' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('密匙不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-orange-500 mr-2" />} 
                    placeholder="确认密码 / CONFIRM" 
                    className="h-16 rounded-2xl bg-black/40 border-white/10 !text-white hover:border-orange-500/50 focus:border-orange-500 transition-all font-bold placeholder:text-white/20 shadow-inner"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mt-8">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading} 
                className="h-18 rounded-[1.25rem] bg-orange-500 border-none font-black text-lg tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all shine-effect flex items-center justify-center gap-3"
              >
                生成账号 <ArrowRightOutlined />
              </Button>
            </Form.Item>
            
            <div className="text-center mt-10">
              <Text className="!text-white/30 text-xs font-bold uppercase tracking-widest">
                ALREADY HAVE IDENTITY? <Link to="/login" className="text-white hover:text-orange-500 transition-colors ml-2">AUTHORIZE ACCESS</Link>
              </Text>
            </div>
          </Form>
        </div>
        
        {/* 底部保障 */}
        <div className="mt-12 flex justify-center gap-8 text-white/20 uppercase font-black text-[9px] tracking-[0.4em]">
           <div className="flex items-center gap-2"><SafetyCertificateOutlined /> 全球加密保障</div>
           <div className="flex items-center gap-2"><SafetyCertificateOutlined /> 隐私受控</div>
        </div>
      </motion.div>
    </div>
    </ConfigProvider>
  );
};

export default Register;
