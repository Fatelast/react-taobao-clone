import React, { useState, useEffect, useCallback } from 'react';
import { Rate, Avatar, Input, Button, Pagination, Progress } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

const { TextArea } = Input;

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avgRating: 0, ratingDistribution: {}, total: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 评价表单状态
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // 加载评价列表
  const loadReviews = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/reviews/product/${productId}?page=${pageNum}&limit=10`);
      setReviews(res.data.reviews);
      setStats({
        avgRating: res.data.avgRating,
        ratingDistribution: res.data.ratingDistribution,
        total: res.data.total,
      });
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error('加载评价失败:', error);
    }
    setLoading(false);
  }, [productId]);

  // 检查是否已评价
  const checkReviewed = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get(`/reviews/check/${productId}`);
      setHasReviewed(res.data.hasReviewed);
    } catch (error) {
      console.error('检查评价状态失败:', error);
    }
  }, [productId, user]);

  useEffect(() => {
    loadReviews();
    checkReviewed();
  }, [loadReviews, checkReviewed]);

  // 提交评价
  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.warning('请输入评价内容');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        productId,
        rating,
        comment,
      });
      toast.success('评价提交成功！');
      setComment('');
      setRating(5);
      setHasReviewed(true);
      loadReviews(1);
    } catch (error) {
      toast.error(error.response?.data?.message || '评价失败');
    }
    setSubmitting(false);
  };

  // 计算星级百分比
  const getRatingPercentage = (star) => {
    if (stats.total === 0) return 0;
    return ((stats.ratingDistribution[star] || 0) / stats.total) * 100;
  };

  return (
    <div className="mt-16">
      {/* 评价概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl mb-8"
      >
        <h2 className="text-2xl font-black text-gray-900 mb-6">用户评价</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* 平均分 */}
          <div className="text-center">
            <div className="text-5xl font-black text-orange-500 mb-2">
              {stats.avgRating ? stats.avgRating.toFixed(1) : '暂无'}
            </div>
            <Rate disabled value={stats.avgRating} allowHalf className="text-2xl" />
            <div className="text-sm text-gray-500 mt-2">{stats.total} 条评价</div>
          </div>

          {/* 星级分布 */}
          <div className="md:col-span-2">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-3 mb-2">
                <div className="text-sm font-bold text-gray-700 w-12">{star} 星</div>
                <Progress
                  percent={getRatingPercentage(star)}
                  strokeColor="#FF8C00"
                  trailColor="#f5f5f5"
                  showInfo={false}
                  className="flex-1"
                />
                <div className="text-xs text-gray-500 w-12 text-right">
                  {stats.ratingDistribution[star] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 评价提交表单 */}
      {user && !hasReviewed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-50/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-orange-200/40 shadow-xl mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <StarFilled className="text-orange-500" />
            发表评价
          </h3>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">您的评分：</div>
            <Rate
              value={rating}
              onChange={setRating}
              allowHalf
              className="text-3xl"
              style={{ color: '#FF8C00' }}
            />
          </div>

          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="分享您的购物体验..."
            rows={4}
            maxLength={1000}
            showCount
            className="mb-4 rounded-xl border-orange-200 focus:border-orange-400"
          />

          <Button
            type="primary"
            loading={submitting}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-orange-500 to-red-500 border-none h-12 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            size="large"
          >
            提交评价
          </Button>
        </motion.div>
      )}

      {hasReviewed && user && (
        <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-600 text-sm">
          您已评价过此商品
        </div>
      )}

      {/* 评价列表 */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-6">全部评价 ({stats.total})</h3>
        
        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">暂无评价，快来第一个评价吧！</div>
        ) : (
          <div>
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-6 pb-6 border-b border-gray-100 last:border-0"
                >
                  <div className="flex gap-4">
                    <Avatar
                      size={48}
                      icon={<UserOutlined />}
                      className="bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">
                          {review.user?.username || '匿名用户'}
                        </span>
                        <Rate disabled value={review.rating} allowHalf className="text-sm" />
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <div className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={page}
                  total={stats.total}
                  pageSize={10}
                  onChange={(p) => {
                    setPage(p);
                    loadReviews(p);
                  }}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
