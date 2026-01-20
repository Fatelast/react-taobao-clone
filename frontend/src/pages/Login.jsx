import { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, ConfigProvider, theme } from 'antd';
import { UserOutlined, LockOutlined, TaobaoCircleOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('/login', values);
      login(res.data.token, res.data.user)
      toast.success('身份验证通过，欢迎回来');
      
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      console.error('Login Security Exception:', err);
      toast.error(err.extractedMsg || '凭证验证未通过，请核对信息');
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
             scale: [1, 1.2, 1],
             rotate: [0, 90, 0],
             x: [0, 100, 0]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-orange-600/20 rounded-full blur-[150px]"
        />
        <motion.div 
           animate={{ 
             scale: [1, 1.3, 1],
             rotate: [90, 0, 90],
             x: [0, -100, 0]
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-[20%] -right-[10%] w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[180px]"
        />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[500px] px-6"
      >
        <div className="glass-card rounded-[3.5rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-white/10 bg-white/5 backdrop-blur-3xl">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="inline-block p-4 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 mb-6 shadow-xl shadow-orange-500/20"
            >
              <TaobaoCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
            </motion.div>
            <Title className="!text-white !font-black !mb-2 !text-4xl tracking-tighter italic">欢迎回来</Title>
            <div className="flex justify-center gap-2 items-center mb-6">
               <div className="h-px bg-white/10 w-12" />
               <Text className="!text-white/40 uppercase font-black tracking-[0.3em] text-[10px]">安全入口</Text>
               <div className="h-px bg-white/10 w-12" />
            </div>
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20">
               <Text className="!text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">尊享会员接入</Text>
            </div>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
            className="premium-form"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: '请输入账户邮箱!' }, { type: 'email', message: '邮箱格式不规范' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-orange-500 mr-2" />} 
                placeholder="EMAIL ADDRESS" 
                className="h-16 rounded-2xl bg-black/40 border-white/10 !text-white hover:border-orange-500/50 focus:border-orange-500 transition-all font-bold placeholder:text-white/20 shadow-inner"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入访问密码!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-orange-500 mr-2" />} 
                placeholder="ACCESS PASSWORD" 
                className="h-16 rounded-2xl bg-black/40 border-white/10 !text-white hover:border-orange-500/50 focus:border-orange-500 transition-all font-bold placeholder:text-white/20 shadow-inner"
              />
            </Form.Item>

            <div className="flex justify-between items-center mb-10 px-2 mt-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="!text-white/40 font-bold text-xs uppercase tracking-widest">持续保持会话</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" size="small" className="text-xs uppercase font-black text-orange-500 hover:text-orange-400 tracking-widest">
                找回凭证 ?
              </Link>
            </div>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading} 
                className="h-18 rounded-[1.25rem] bg-orange-500 border-none font-black text-lg tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all shine-effect flex items-center justify-center gap-3"
              >
                授权登录 <ArrowRightOutlined />
              </Button>
            </Form.Item>
            
            <div className="text-center mt-10">
              <Text className="!text-white/30 text-xs font-bold uppercase tracking-widest">
                还没有账号? <Link to="/register" className="text-white hover:text-orange-500 transition-colors ml-2">创建身份</Link>
              </Text>
            </div>
          </Form>
        </div>
        
        {/* 底部保障 */}
        <div className="mt-12 flex justify-center gap-8 text-white/20 uppercase font-black text-[9px] tracking-[0.4em]">
           <div className="flex items-center gap-2"><SafetyCertificateOutlined /> SSL 安全加密</div>
           <div className="flex items-center gap-2"><SafetyCertificateOutlined /> 256位深度加密</div>
        </div>
      </motion.div>
    </div>
    </ConfigProvider>
  );
};

export default Login;
