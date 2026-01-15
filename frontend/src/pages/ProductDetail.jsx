import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Space, Rate, Divider, Image, Spin, message, InputNumber, Tag, Empty } from 'antd';
import { ShoppingCartOutlined, SafetyCertificateOutlined, ArrowLeftOutlined, ThunderboltOutlined, HeartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import imgError from '../assets/imgs/imgError.png'

const { Title, Text } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        message.error('加载商品详情失败');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      message.info('请先登录');
      navigate('/login');
      return;
    }
    await addToCart(product._id, qty);
  };

  const handleBuyNow = async () => {
     if (!user) {
      message.info('请先登录');
      navigate('/login');
      return;
    }
    await addToCart(product._id, qty);
    navigate('/cart');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-vh-screen py-40">
       <Spin size="large" tip="正在唤醒商品数据..." />
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-40">
       <Empty description="未能找到该商品" />
       <Button onClick={() => navigate('/products')} className="mt-6">返回商城</Button>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-[#fcfcfc] relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[120px] -z-10 animate-float" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-100/10 rounded-full blur-[100px] -z-10 animate-float-delayed" />

      <div className="max-w-[1400px] mx-auto pt-24 px-6 relative z-10">
        {/* 返回按钮 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="group hover:text-orange-500 font-bold"
          >
            返回上一页
          </Button>
        </motion.div>

        <Row gutter={[60, 40]}>
          {/* 左侧：高端图片展示 */}
          <Col xs={24} lg={10}>
             <motion.div
               initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
               animate={{ opacity: 1, scale: 1, rotate: 0 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="relative"
             >
                <div className="glass-card rounded-[3rem] overflow-hidden p-4 shadow-2xl bg-white/40">
                  <Image
                    src={product.image || 'https://via.placeholder.com/800x800'}
                    fallback={imgError}
                    className="w-full h-auto rounded-[2.5rem] object-cover"
                    preview={{
                      mask: <div className="text-white font-bold tracking-widest bg-black/20 backdrop-blur-sm w-full h-full flex items-center justify-center">点击预览高清大图</div>
                    }}
                  />
                </div>
                {/* 悬浮角标 */}
                <div className="absolute top-8 right-8 flex flex-col gap-3">
                   <Tag color="volcano" className="!m-0 rounded-full border-none px-4 py-1 font-black uppercase text-[10px] tracking-widest shadow-lg">New Arrival</Tag>
                   <Button shape="circle" icon={<HeartOutlined />} className="shadow-lg border-none hover:scale-110" />
                </div>
             </motion.div>
          </Col>

          {/* 右侧：分层信息面板 */}
          <Col xs={24} lg={14}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Title className="!text-5xl !font-black !mb-4 tracking-tight">{product.name}</Title>
              
              <Space className="mb-8 flex-wrap">
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  <Rate disabled defaultValue={4.5} allowHalf style={{ fontSize: 12, color: '#f97316' }} />
                  <Text className="text-orange-600 font-bold text-xs">4.9/5</Text>
                </div>
                <Divider type="vertical" />
                <Text className="text-gray-400 font-medium tracking-wide text-xs uppercase">128 评价</Text>
                <Divider type="vertical" />
                <Text className="text-gray-400 font-medium tracking-wide text-xs uppercase">活跃销售中</Text>
              </Space>

              {/* 价格区域 - 玻璃拟态深度感 */}
              <div className="glass-card rounded-[2.5rem] p-8 mb-10 relative overflow-hidden group hover:shadow-orange-200/50 transition-all border-white/60">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-400/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <Text className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-black mb-2 block">Exclusive Price</Text>
                  <div className="flex items-baseline gap-4">
                    <span className="text-gradient !text-5xl font-black">
                      <span className="text-2xl mr-1">¥</span>{product.price.toFixed(2)}
                    </span>
                    <Text delete className="text-gray-300 text-xl italic">
                      ¥{(product.price * 1.5).toFixed(2)}
                    </Text>
                    <Tag color="red" className="!m-0 rounded-md border-none px-2 font-bold text-[10px] uppercase">Limited Offer</Tag>
                  </div>
                </div>
              </div>

              {/* 规格选择 */}
              <div className="mb-12">
                <Title level={5} className="!font-black !mb-6 uppercase tracking-widest text-gray-400 !text-xs">Select Quantity</Title>
                <div className="flex items-center gap-6 glass-card w-fit px-6 py-3 rounded-2xl border-white/40">
                   <InputNumber 
                    min={1} 
                    max={99} 
                    value={qty} 
                    onChange={setQty} 
                    className="!w-20 !border-none !bg-transparent font-black text-lg" 
                   />
                   <Divider type="vertical" className="h-8" />
                   <div className="flex flex-col">
                      <Text className="text-[10px] uppercase font-bold text-gray-400">Stock Status</Text>
                      <Text className="text-sm font-black text-green-500">{product.stock > 0 ? `有现货 (${product.stock})` : '补货中'}</Text>
                   </div>
                </div>
              </div>

              {/* 操作按钮 - 流光效果 */}
              <div className="flex gap-6 mb-12">
                <Button 
                  type="primary" 
                  size="large" 
                  className="h-18 px-14 rounded-[1.5rem] text-lg font-black bg-gray-950 border-none shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-105 transition-all shine-effect flex items-center gap-2"
                  onClick={handleBuyNow}
                >
                  <ThunderboltOutlined /> 立即下单
                </Button>
                <Button 
                  size="large" 
                  className="h-18 px-14 rounded-[1.5rem] text-lg font-black glass-card border-none hover:bg-white transition-all shadow-lg flex items-center gap-2 shine-effect text-[#1a1a1a]"
                  icon={<ShoppingCartOutlined className="text-orange-500" />}
                  onClick={handleAddToCart}
                >
                  加入购物车
                </Button>
              </div>
              
              {/* 服务保障 - 极简排版 */}
              <div className="grid grid-cols-3 gap-4">
                 {[
                   { icon: <SafetyCertificateOutlined />, label: "正品原装" },
                   { icon: <SafetyCertificateOutlined />, label: "7天无理由" },
                   { icon: <SafetyCertificateOutlined />, label: "极速顺丰" }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-2 p-4 glass-card rounded-3xl border-white/30 text-center hover:bg-white/60 transition-colors">
                      <div className="text-orange-500 text-xl">{item.icon}</div>
                      <Text className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</Text>
                   </div>
                 ))}
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* 详情描述区 */}
        <section className="mt-32">
           <motion.div
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
              <div className="flex items-center gap-4 mb-16">
                 <div className="h-px bg-gray-200 flex-1" />
                 <Title level={2} className="!m-0 !font-black !text-4xl px-8 uppercase tracking-tighter italic">Product Story</Title>
                 <div className="h-px bg-gray-200 flex-1" />
              </div>
              
              <div className="glass-card rounded-[4rem] p-16 shadow-xl border-white/50 bg-white/30 backdrop-blur-3xl overflow-hidden">
                <div 
                   className="prose prose-orange max-w-none text-xl leading-relaxed text-gray-600 font-medium"
                   dangerouslySetInnerHTML={{ __html: product.description || '<p>暂无详细描述</p>' }} 
                />
                
                {/* 模拟丰富细节展示 */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <motion.div whileHover={{ scale: 1.02 }} className="rounded-[3rem] overflow-hidden shadow-2xl">
                      <Image src="https://via.placeholder.com/800x600?text=Premium+Design" className="w-full" />
                   </motion.div>
                   <div className="flex flex-col justify-center p-8">
                      <Title level={3} className="!font-black !mb-6 text-gradient">极致设计美学</Title>
                      <Text className="text-lg text-gray-500 leading-loose">
                        我们坚信，每一件商品都应该是艺术与功能的完美结合。不仅是工具，更是对生活品质的一份承诺。每一个细节都经过匠心锤炼，只为带给您前所未有的极致体验。
                      </Text>
                   </div>
                </div>
              </div>
           </motion.div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
