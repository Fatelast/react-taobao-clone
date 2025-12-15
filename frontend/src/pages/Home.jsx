import React, { useEffect, useState } from 'react';
import { Carousel, Row, Col, Typography, Space, Button, message } from 'antd';
import {  FireOutlined } from '@ant-design/icons';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// 轮播图假数据（实际项目可以放真实 banner 图）
const bannerList = [
  {
    title: '夏日大促 · 全场 5 折起',
    desc: '爆款直降 · 限时抢购',
    image: 'https://img.alicdn.com/imgextra/i4/O1CN01bW9z7M1uY7oZ7Z7Z7_!!6000000006045-0-cib.jpg',
    color: '#ff4d4f',
  },
  {
    title: '新品上市',
    desc: '潮流单品抢先看',
    image: 'https://img.alicdn.com/imgextra/i2/O1CN01aZ7Z7Z1uY7oZ7Z7Z7_!!6000000006045-2-cib.png',
    color: '#1890ff',
  },
  {
    title: '品牌闪购',
    desc: '国际大牌低至 3 折',
    image: 'https://img.alicdn.com/imgextra/i3/O1CN01cZ7Z7Z1uY7oZ7Z7Z7_!!6000000006045-3-cib.jpg',
    color: '#52c41a',
  },
];

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 加载热门商品（这里直接取前 8 条）
  useEffect(() => {
    const fetchHot = async () => {
      try {
        const res = await api.get('/products');
        setHotProducts(res.data.products?.slice(0, 8)); // 取前8个做热门展示
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHot();
  }, []);


  return (
    <div style={{ background: '#f5f5f5' }}>
      {/* 1. 超大轮播图 */}
      <Carousel autoplay effect="fade">
        {bannerList.map((item, idx) => (
          <div key={idx}>
            <div
              style={{
                height: '480px',
                background: `linear-gradient(120deg, ${item.color}88, #ffffff00), url(${item.image}) center/cover no-repeat`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center',
              }}
            >
              <div>
                <Title level={1} style={{ color: '#fff', margin: 0 }}>
                  {item.title}
                </Title>
                <Text style={{ fontSize: 24, color: '#fff' }}>{item.desc}</Text>
                <br />
                <Button type="primary" size="large" style={{ marginTop: 20 }}>
                  立即抢购
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* 2. 热门商品推荐 */}
      <div style={{ padding: '40px 20px', maxWidth: 1400, margin: '0 auto' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'center', marginBottom: 40 }}>
          <FireOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
          <Title level={2} style={{ margin: 0 }}>
            热门推荐
          </Title>
        </Space>

        <Row gutter={[20, 24]}>
          {hotProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product._id} style={{ display: 'flex', justifyContent: 'center' }}>
              {/* xl={6} 意味着一行 4 个 (24/6=4) */}
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* 加载状态或空状态 */}
        {loading && <div style={{ textAlign: 'center', padding: 50 }}>加载中...</div>}
        {!loading && hotProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <Text type="secondary">暂无商品，去添加一些吧！</Text>
          </div>
        )}

        {/* 查看更多按钮 */}
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <Button type="primary" size="large" onClick={() => navigate('/products')}>
            查看全部商品 →
          </Button>
        </div>
      </div>

      {/* 3. 底部简洁标语 */}
      <div style={{ background: '#141414', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#fff' }}>
          极简 · 极致 · 购物体验
        </Title>
        <Text style={{ fontSize: 18, color: '#aaa' }}>
          专注于你真正想要的商品
        </Text>
      </div>
    </div>
  );
};

export default Home;