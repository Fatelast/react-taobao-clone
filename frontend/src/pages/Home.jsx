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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden bg-[#fcfcfc] relative">
      {/* 全局动感背景层 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[-5%] w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-[150px] animate-float-delayed" />
        <div className="absolute top-[50%] left-[20%] w-[300px] h-[300px] bg-blue-100/10 rounded-full blur-[100px] animate-float" />
      </div>

      {/* 1. Hero Section - 极简且高端 */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-gradient-main z-10 shadow-sm">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <Row align="middle" gutter={[40, 40]}>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ x: -60, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Tag color="orange" className="mb-6 px-4 py-1.5 rounded-full border-none font-bold uppercase tracking-[0.2em] text-[10px] bg-white/50 backdrop-blur-sm shadow-sm">
                  2026 Preview Collection
                </Tag>
                <Title className="!text-7xl !font-black !mb-8 leading-[1.1] drop-shadow-sm tracking-tight text-[#1a1a1a]">
                  未来 <span className="text-gradient">购物世界</span><br />
                  由此开启
                </Title>
                <Text className="text-xl text-gray-600 block mb-12 max-w-lg leading-relaxed font-medium">
                  探索前所未有的极致购物体验。集合全球顶尖潮流单品，为您量身定制的智能生活。
                </Text>
                <div className="flex gap-6">
                  <Button 
                    type="primary" 
                    size="large" 
                    className="h-16 px-12 rounded-[1.25rem] text-lg font-bold shadow-[0_20px_40px_rgba(255,106,0,0.3)] border-none bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 transition-transform shine-effect"
                    onClick={() => navigate('/products')}
                  >
                    立即探索
                  </Button>
                  <Button 
                    size="large" 
                    className="h-16 px-12 rounded-[1.25rem] text-lg font-bold glass-card border-none hover:bg-white/80 transition-all hover:shadow-lg"
                  >
                    了解更多
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col xs={0} lg={12} className="relative">
              <motion.div
                initial={{ scale: 0.85, opacity: 0, rotate: 8, y: 50 }}
                animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative perspective-1000"
              >
                 <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[150px] animate-pulse" />
                 <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                 >
                   <img 
                      src="https://img.alicdn.com/imgextra/i4/O1CN01bW9z7M1uY7oZ7Z7Z7_!!6000000006045-0-cib.jpg" 
                      alt="Shopping" 
                      className="w-full h-auto rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] ring-1 ring-white/20"
                   />
                 </motion.div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 2. Bento Grid Classification - 现代化的布局展示 */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-16"
        >
          <div>
            <Title level={4} className="!text-orange-500 font-bold uppercase tracking-[0.3em] !m-0 !mb-4 border-l-4 border-orange-500 pl-6 h-6 flex items-center">Categories</Title>
            <Title level={2} className="!m-0 !font-black !text-5xl tracking-tight">探索分类柜台</Title>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[700px]">
          {/* 大板块 */}
          <motion.div 
            whileHover={{ y: -12, scale: 1.01 }}
            className="md:col-span-2 md:row-span-2 glass-card rounded-[3.5rem] p-12 flex flex-col justify-between group cursor-pointer hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl border-white/50"
          >
            <div>
              <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform group-hover:rotate-6 duration-500">
                <ThunderboltOutlined className="text-4xl text-orange-500" />
              </div>
              <Title level={1} className="!font-black !mb-6 !text-4xl">潮流数码</Title>
              <Text className="text-xl text-gray-600 font-medium">最新一代智能硬件，让科技点亮生活中的每一个角落。</Text>
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-gray-100/50">
              <span className="font-bold text-lg text-orange-500 flex items-center gap-3">探索更多 <ArrowRightOutlined className="group-hover:translate-x-3 transition-transform" /></span>
              <div className="w-48 h-48 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl -mr-16 -mb-16 opacity-60 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </motion.div>

          {/* 小板块增强 */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="md:col-span-1 glass-card rounded-[3rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-white/90 transition-all shadow-lg hover:shadow-xl border-white/40"
          >
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
              <ShopOutlined className="text-3xl text-pink-500" />
            </div>
            <Title level={3} className="!font-black !m-0 !text-2xl">品质生活</Title>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center self-end group-hover:bg-pink-500 group-hover:text-white transition-colors">
              <ArrowRightOutlined className="text-lg group-hover:translate-x-0.5" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="md:col-span-1 glass-card rounded-[3rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-white/90 transition-all shadow-lg hover:shadow-xl border-white/40"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform">
              <RocketOutlined className="text-3xl text-blue-500" />
            </div>
            <Title level={3} className="!font-black !m-0 !text-2xl">运动健康</Title>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center self-end group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <ArrowRightOutlined className="text-lg" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="md:col-span-2 glass-card rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer hover:bg-white/90 transition-all overflow-hidden relative shadow-lg border-white/40"
          >
            <div className="relative z-10 w-2/3">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FireOutlined className="text-purple-500" />
                 </div>
                 <Title level={3} className="!font-black !m-0 !text-2xl">美妆个护</Title>
              </div>
              <Text className="text-gray-600 text-lg font-medium">精致妆容，从这里开始选购。</Text>
            </div>
            <div className="w-56 h-56 bg-purple-300/20 rounded-full blur-[80px] absolute -right-16 -bottom-16 group-hover:scale-125 transition-transform duration-700" />
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors relative z-10">
              <ArrowRightOutlined className="text-2xl group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Featured Products - 呼吸感更强的展示层 */}
      <section className="py-32 px-6 bg-white/40 backdrop-blur-md relative z-10 border-y border-white/50">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-24"
          >
            <div className="flex items-center gap-3 text-red-500 font-black mb-6 tracking-[0.2em] bg-red-50 px-6 py-2 rounded-full border border-red-100">
               <FireOutlined /> <span>HOT RECOMMENDATION</span>
            </div>
            <Title level={2} className="!font-black !text-6xl tracking-tight !mb-6">为您挑选的 <span className="text-gradient">热门单品</span></Title>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-4" />
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-40">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               >
                 <Spin size="large" />
               </motion.div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <Row gutter={[32, 48]}>
                {hotProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                    <motion.div variants={itemVariants} className="h-full">
                      <ProductCard product={product} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
              
              {hotProducts.length === 0 && !loading && (
                <div className="text-center py-40 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <div className="text-6xl mb-6 grayscale opacity-30">📦</div>
                  <Text type="secondary" className="text-2xl font-black block text-gray-400">商城正在上新中...</Text>
                  <Text type="secondary" className="text-sm mt-2 block">优质好物即将抵达，敬请期待</Text>
                </div>
              )}

              <motion.div 
                className="text-center mt-28"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={() => navigate('/products')}
                  className="h-20 px-16 rounded-[1.5rem] text-xl font-black border-none bg-orange-500 shadow-[0_25px_50px_rgba(255,106,0,0.3)] hover:shadow-orange-400 transition-all shine-effect"
                >
                  探索全部商品 <ArrowRightOutlined className="ml-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 4. Brand Slogan - 极具质感的底部 */}
       <section className="pt-32 pb-16 z-10 relative">
          <div className="max-w-[1400px] mx-auto px-6">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-gray-950 rounded-[4.5rem] p-32 text-center relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
            >
               {/* 深度特效：旋转星云感 */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #333, transparent 50%), radial-gradient(circle at 70% 70%, #444, transparent 50%)' }} 
               />
               <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[180px]" />
               <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px]" />
               
               <Title level={1} className="!text-white !font-black !mb-10 relative z-10 !text-7xl tracking-tighter">
                 科技与生活，<span className="text-orange-500">触手可及</span>
               </Title>
               <Text className="!text-white/70 text-2xl block mb-16 relative z-10 max-w-3xl mx-auto leading-relaxed font-medium">
                 加入 10,000+ 用户的智慧选择，开启你的高品质消费之旅。我们致力于将全球最先进的技术与最懂你的生活美学紧密结合。
               </Text>
               <Button 
                 shape="round" 
                 size="large" 
                 className="h-20 px-20 relative z-10 border-2 border-white/20 text-white bg-white/5 backdrop-blur-md hover:!bg-white hover:!text-black transition-all font-black text-xl tracking-widest shine-effect"
               >
                 立即加入 TAOBAO PREMIUM
               </Button>
            </motion.div>
          </div>
       </section>
     </div>
  );
};

export default Home;
