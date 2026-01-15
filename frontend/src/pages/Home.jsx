import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Button, Spin, Tag } from 'antd';
import { FireOutlined, ThunderboltOutlined, RocketOutlined, ShopOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHot = async () => {
      try {
        const res = await api.get('/products');
        setHotProducts(res.data.products?.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHot();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* 1. Hero Section - 极简且高端 */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-main">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <Row align="middle" gutter={[40, 40]}>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Tag color="orange" className="mb-4 px-3 py-1 rounded-full border-none font-bold uppercase tracking-wider">
                  2026 Preview Collection
                </Tag>
                <Title className="!text-6xl !font-black !mb-6 leading-tight">
                  未来 <span className="text-gradient">购物世界</span><br />
                  由此开启
                </Title>
                <Text className="text-xl text-gray-600 block mb-10 max-w-lg leading-relaxed">
                  探索前所未有的极致购物体验。集合全球顶尖潮流单品，为您量身定制的智能生活。
                </Text>
                <div className="flex gap-4">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl border-none bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 transition-transform"
                    onClick={() => navigate('/products')}
                  >
                    立即探索
                  </Button>
                  <Button 
                    size="large" 
                    className="h-14 px-10 rounded-2xl text-lg font-bold glass-card border-none hover:bg-white/50 transition-colors"
                  >
                    了解更多
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col xs={0} lg={12} className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
              >
                 <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200/50 rounded-full blur-[100px]" />
                 <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-200/50 rounded-full blur-[100px]" />
                 <img 
                    src="https://img.alicdn.com/imgextra/i4/O1CN01bW9z7M1uY7oZ7Z7Z7_!!6000000006045-0-cib.jpg" 
                    alt="Shopping" 
                    className="w-full h-auto rounded-[3rem] shadow-2xl relative z-10"
                 />
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 2. Bento Grid Classification - 现代化的布局展示 */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <Title level={4} className="!text-orange-500 uppercase tracking-widest !m-0 !mb-2">Categories</Title>
            <Title level={2} className="!m-0 !font-bold">探索分类柜台</Title>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
          {/* 大板块 */}
          <div className="md:col-span-2 md:row-span-2 glass-card rounded-[2.5rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-white/80 transition-all">
            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ThunderboltOutlined className="text-3xl text-orange-500" />
              </div>
              <Title level={2} className="!font-bold !mb-4">潮流数码</Title>
              <Text className="text-lg text-gray-500">最新一代智能硬件，让科技点亮生活中的每一个角落。</Text>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-orange-500">探索更多 <ArrowRightOutlined /></span>
              <div className="w-40 h-40 bg-gradient-to-br from-orange-200 to-transparent rounded-full blur-2xl -mr-10 -mb-10 opacity-50" />
            </div>
          </div>

          <div className="md:col-span-1 glass-card rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/80 transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <ShopOutlined className="text-2xl text-pink-500" />
            </div>
            <Title level={3} className="!font-bold !m-0">品质生活</Title>
            <ArrowRightOutlined className="text-xl self-end group-hover:translate-x-2 transition-transform" />
          </div>

          <div className="md:col-span-1 glass-card rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-white/80 transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <RocketOutlined className="text-2xl text-blue-500" />
            </div>
            <Title level={3} className="!font-bold !m-0">运动健康</Title>
            <ArrowRightOutlined className="text-xl self-end group-hover:translate-x-2 transition-transform" />
          </div>

          <div className="md:col-span-2 glass-card rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-white/80 transition-all overflow-hidden relative">
            <div className="relative z-10">
              <Title level={3} className="!font-bold !mb-2">美妆个护</Title>
              <Text className="text-gray-500">精致妆容，从这里开始选购。</Text>
            </div>
            <div className="w-32 h-32 bg-pink-200/30 rounded-full blur-3xl absolute -right-10 -bottom-10" />
            <ArrowRightOutlined className="text-xl group-hover:translate-x-2 transition-transform relative z-10" />
          </div>
        </div>
      </section>

      {/* 3. Featured Products - 呼吸感更强的展示层 */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center gap-2 text-red-500 font-bold mb-4">
               <FireOutlined /> <span>HOT RECOMMENDATION</span>
            </div>
            <Title level={2} className="!font-black !text-4xl">为您挑选的 <span className="text-gradient">热门单品</span></Title>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <Row gutter={[24, 40]}>
                {hotProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                    <motion.div variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
              
              {hotProducts.length === 0 && (
                <div className="text-center py-20">
                  <Text type="secondary" className="text-lg">暂无商品，正在为您筹备新货...</Text>
                </div>
              )}

              <motion.div 
                className="text-center mt-20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={() => navigate('/products')}
                  className="h-16 px-12 rounded-2xl text-lg font-bold border-none bg-orange-500 shadow-xl shadow-orange-200"
                >
                  探索全部商品 <ArrowRightOutlined className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. Brand Slogan - 极具质感的底部 */}
       <section className="pt-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="bg-gray-950 rounded-[3rem] p-24 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #444, transparent)' }} />
               <Title level={1} className="!text-white !font-bold !mb-8 relative z-10">
                 科技与生活，<span className="text-orange-500">触手可及</span>
               </Title>
               <Text className="text-gray-400 text-xl block mb-12 relative z-10">
                 加入 10,000+ 用户的智慧选择，开启你的高品质消费之旅。
               </Text>
               <Button shape="round" size="large" className="h-14 px-10 relative z-10 border-white text-white bg-transparent hover:!bg-white hover:!text-black transition-all">
                 立即加入 TAOBAO PREMIUM
               </Button>
            </div>
          </div>
       </section>
    </div>
  );
};

export default Home;
