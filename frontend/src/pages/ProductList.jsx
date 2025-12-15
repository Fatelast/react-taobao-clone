import { useEffect, useState } from 'react';
import { Row, Col, message, Typography, Spin, Empty, Pagination } from 'antd';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const { Title, Text } = Typography;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });

  const fetchProducts = async (page = 1, pageSize = 12) => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${page}&limit=${pageSize}`);
      setProducts(res.data.products);
      setPagination({
        current: res.data.page,
        pageSize: pageSize,
        total: res.data.total
      });
    } catch (err) {
      console.error(err);
      message.error('加载商品失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (page, pageSize) => {
    fetchProducts(page, pageSize);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 30, textAlign: 'center' }}>
        <Title level={2}>全部商品</Title>
        <Text type="secondary">精选好物，等你来挑</Text>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>
      ) : products.length === 0 ? (
        <Empty description="暂无商品" />
      ) : (
        <>
          <Row gutter={[20, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product._id} style={{ display: 'flex', justifyContent: 'center' }}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handleTableChange}
              showSizeChanger
              onShowSizeChange={handleTableChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;