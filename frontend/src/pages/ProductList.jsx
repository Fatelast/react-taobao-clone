import { useEffect, useState, useRef, useCallback } from 'react';
import { Row, Col, Typography, Spin, Empty, Tag } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const { Title, Text } = Typography;

const ProductList = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword') || '';
  
  // Tag 筛选状态
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  
  // 本地搜索状态
  const [localKeyword, setLocalKeyword] = useState(keyword);
  
  const observer = useRef();
  
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const isFetchingRef = useRef(false);

  // 统一加载逻辑，避免竞态与重复清理
  const fetchProducts = useCallback(async (isNewSearch = false) => {
    if (isFetchingRef.current && !isNewSearch) return;
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      const tagParam = selectedTag ? `&tag=${encodeURIComponent(selectedTag)}` : '';
      const res = await api.get(`/products?page=${currentPage}&limit=12&keyword=${encodeURIComponent(keyword)}${tagParam}`);
      const newProducts = res.data.products || [];
      
      setProducts(prev => {
        if (isNewSearch) return newProducts;
        const existingIds = new Set(prev.map(p => p._id));
        const uniqueNew = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...uniqueNew];
      });

      setHasMore(!(res.data.page >= res.data.pages || newProducts.length < 12));
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('加载商品失败');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, keyword, selectedTag]); // 彻底移除 loading 依赖，防止死锁循环

  // 获取所有可用 Tag
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/products/tags');
        setAvailableTags(res.data || []);
      } catch (err) {
        console.error('Fetch Tags Error:', err);
      }
    };
    fetchTags();
  }, []);

  // 同步 URL keyword 到 localKeyword
  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  // 处理搜索关键字变化：立即重置
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [keyword, selectedTag]); // 增加 selectedTag 依赖

  // 处理分页加载
  useEffect(() => {
    fetchProducts(page === 1);
  }, [page, keyword, selectedTag, fetchProducts]); // 增加 selectedTag 依赖

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fcfcfc] relative overflow-hidden">
      {/* 装饰性背景 */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-main opacity-40 -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-orange-200/20 rounded-full blur-[100px] animate-float" />

      {/* 1. Header Area */}
      <div className="pt-24 pb-16 px-6 relative z-10">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4 text-orange-500 font-bold">
               <ShoppingOutlined className="text-2xl" />
               <span className="tracking-[0.3em] uppercase text-xs">甄选系列</span>
            </div>
            <Title className="!text-5xl !font-black !mb-6 tracking-tight">
              {keyword ? (
                <>搜索结果: <span className="text-gradient italic">"{keyword}"</span></>
              ) : (
                <>探索 <span className="text-gradient">全球好物</span></>
              )}
            </Title>
            <div className="max-w-2xl mx-auto glass-card py-4 px-8 rounded-full flex items-center justify-between shadow-lg relative group transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-xl focus-within:shadow-[0_0_0_3px_rgba(255,106,0,0.15),0_10px_40px_rgba(255,106,0,0.2)] focus-within:scale-[1.02]">
               {/* 搜索图标 - 单个，左侧固定 */}
               <SearchOutlined className="text-gray-400 text-lg mr-3 transition-colors duration-300 group-focus-within:text-orange-500" />
               
               {/* 搜索输入框 */}
               <input
                 type="text"
                 placeholder={keyword ? `为您找到 ${products.length} 件相关单品` : '发现您的下一个心动单品'}
                 value={localKeyword}
                 onChange={(e) => setLocalKeyword(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     const trimmedValue = localKeyword.trim();
                     if (trimmedValue) {
                       navigate(`/products?keyword=${encodeURIComponent(trimmedValue)}`);
                     } else {
                       navigate('/products'); // 清空搜索
                     }
                   }
                 }}
                 className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm font-medium"
                 style={{ WebkitAppearance: 'none' }}
               />
               
               {/* 标签 */}
               <Tag color="orange" className="!m-0 rounded-full px-4 py-0.5 border-none font-bold ml-3">精品名录</Tag>
            </div>
          </motion.div>

          {/* Tag 筛选器 */}
          {availableTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex justify-center"
            >
              <div className="glass-card px-8 py-5 rounded-[2rem] shadow-lg flex flex-wrap gap-3 items-center max-w-4xl">
                <Text className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mr-3">筛选:</Text>
                <Tag
                  className="!m-0 rounded-full px-5 py-1.5 cursor-pointer transition-all hover:scale-105 font-bold uppercase text-xs tracking-wider"
                  color={!selectedTag ? "orange" : "default"}
                  style={{
                    borderWidth: !selectedTag ? 2 : 1,
                    boxShadow: !selectedTag ? '0 4px 15px rgba(255, 106, 0, 0.3)' : 'none'
                  }}
                  onClick={() => setSelectedTag(null)}
                >
                  全部
                </Tag>
                {availableTags.map(tag => (
                  <Tag
                    key={tag}
                    className="!m-0 rounded-full px-5 py-1.5 cursor-pointer transition-all hover:scale-105 font-bold uppercase text-xs tracking-wider"
                    color={selectedTag === tag ? "orange" : "default"}
                    style={{
                      borderWidth: selectedTag === tag ? 2 : 1,
                      boxShadow: selectedTag === tag ? '0 4px 15px rgba(255, 106, 0, 0.3)' : 'none'
                    }}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. Product Grid */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 min-h-[400px]">
        <div className="min-h-[600px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {(loading && products.length === 0) ? (
              <motion.div 
                key="initial-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-60 flex flex-col items-center gap-6"
              >
                 <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                 <Text type="secondary" className="font-bold text-orange-500 animate-pulse uppercase tracking-[0.2em] text-xs">正在捕捉全球珍宝...</Text>
              </motion.div>
            ) : (!loading && products.length === 0) ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-40 w-full"
              >
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center">
                      <Text className="text-xl text-gray-400 block mb-4">没有捕捉到相关商品...</Text>
                      <Text type="secondary">换个关键词试试，或者浏览我们的推荐集合</Text>
                    </div>
                  } 
                />
              </motion.div>
            ) : products.length > 0 ? (
              <motion.div
                key={`product-grid-${selectedTag || 'all'}-${keyword || 'none'}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Row gutter={[24, 40]}>
                  {products.map((product, index) => (
                    <Col 
                      key={product._id}
                      ref={products.length === index + 1 ? lastElementRef : null}
                      xs={24} sm={12} md={8} lg={6} xl={6}
                      className="flex justify-center"
                    >
                      <motion.div 
                        variants={itemVariants}
                        layout
                        className="w-full"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        
        {/* Loading / End Indicators */}
        <div className="text-center mt-20 h-20">
          {loading && (
             <div className="flex flex-col items-center gap-4">
                <Spin indicator={<div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />} />
                <Text type="secondary" className="font-medium animate-pulse">正在搜寻更多珍宝...</Text>
             </div>
          )}
          {!hasMore && products.length > 0 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex items-center justify-center gap-4 opacity-50"
             >
               <div className="h-px bg-gray-300 w-12" />
                <Text className="text-xs uppercase tracking-widest font-black">到底啦，这就是全部珍宝了</Text>
               <div className="h-px bg-gray-300 w-12" />
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
