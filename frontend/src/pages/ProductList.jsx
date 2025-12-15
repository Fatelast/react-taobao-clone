import { useEffect, useState, useRef, useCallback } from 'react';
import { Row, Col, message, Typography, Spin, Empty } from 'antd';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const observer = useRef();
  
  // Last element ref for infinite scroll
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

  // Reset list when keyword changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [keyword]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?page=${page}&limit=12&keyword=${encodeURIComponent(keyword)}`);
        
        setProducts(prev => {
          // If page 1, replace. If > 1, append. 
          // Note: StrictMode double invoke might cause issues, simplified here.
          // Correct logic: if page 1, return new data. Else append unique.
          
          const newProducts = res.data.products;
          if (page === 1) return newProducts;
          
          // Filter duplicates just in case
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNew = newProducts.filter(p => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });

        if (res.data.products.length === 0 || products.length + res.data.products.length >= res.data.total) {
             // Precise termination might be tricky with async state updates, 
             // but checking returned length < limit is easiest heuristic
             if (res.data.products.length < 12) setHasMore(false);
        }
        
        // Also strictly check total if available, but 'products' above is prev state...
        // Let's rely on returned count. 
        if (res.data.page >= res.data.pages) {
            setHasMore(false);
        }

      } catch (err) {
        console.error(err);
        message.error('加载商品失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, keyword]); // Re-run when page or keyword changes


  return (
    <div style={{ padding: '40px 20px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <Title level={2}>{keyword ? `"${keyword}" 的搜索结果` : '全部商品'}</Title>
        <Text type="secondary">{keyword ? '找到心仪好物了吗？' : '精选好物，等你来挑'}</Text>
      </div>

      {products.length === 0 && !loading ? (
        <Empty description="暂无相关商品" />
      ) : (
        <Row gutter={[20, 24]}>
          {products.map((product, index) => {
            if (products.length === index + 1) {
              return (
                <Col ref={lastElementRef} xs={24} sm={12} md={8} lg={6} xl={6} key={product._id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <ProductCard product={product} />
                </Col>
              );
            } else {
              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product._id} style={{ display: 'flex', justifyContent: 'center' }}>
                   <ProductCard product={product} />
                </Col>
              );
            }
          })}
        </Row>
      )}
      
      {loading && (
        <div style={{ textAlign: 'center', padding: 40 }}>
           <Spin size="large" tip="加载更多..." />
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
         <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
           -- 已经到底啦 --
         </div>
      )}
    </div>
  );
};

export default ProductList;