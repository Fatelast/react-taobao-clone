const Router = require('koa-router');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = new Router();

// 获取商品的所有评价
router.get('/product/:productId', async (ctx) => {
  try {
    const { productId } = ctx.params;
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId });

    // 计算平均评分
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          ratingCounts: {
            $push: '$rating'
          }
        }
      }
    ]);

    // 统计各星级数量 (支持半星归类至整数桶)
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length > 0) {
      stats[0].ratingCounts.forEach(rating => {
        const floorRating = Math.floor(rating);
        // 确保 5.0 还是归到 5，0.5 归到 1 (最小值1)
        const bucket = floorRating === 0 ? 1 : floorRating;
        if (ratingDistribution[bucket] !== undefined) {
          ratingDistribution[bucket]++;
        }
      });
    }

    ctx.body = {
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
      avgRating: stats.length > 0 ? stats[0].avgRating : 0,
      ratingDistribution,
    };
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

// 检查用户是否已评价该商品
router.get('/check/:productId', auth, async (ctx) => {
  try {
    const { productId } = ctx.params;
    const review = await Review.findOne({
      user: ctx.state.user.id,
      product: productId,
    });
    ctx.body = { hasReviewed: !!review, review };
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

// 创建评价
router.post('/', auth, async (ctx) => {
  try {
    const { productId, rating, comment } = ctx.request.body;

    // 检查是否已评价
    const existing = await Review.findOne({
      user: ctx.state.user.id,
      product: productId,
    });

    if (existing) {
      ctx.throw(400, '您已经评价过该商品');
    }

    // TODO: 验证用户是否购买过该商品（需要订单系统）
    // 暂时允许所有登录用户评价

    const review = await Review.create({
      user: ctx.state.user.id,
      product: productId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'username');
    ctx.body = populatedReview;
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

// 更新评价
router.put('/:id', auth, async (ctx) => {
  try {
    const { id } = ctx.params;
    const { rating, comment } = ctx.request.body;

    const review = await Review.findById(id);
    if (!review) {
      ctx.throw(404, '评价不存在');
    }

    if (review.user.toString() !== ctx.state.user.id) {
      ctx.throw(403, '无权修改他人评价');
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'username');
    ctx.body = populatedReview;
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

// 删除评价
router.delete('/:id', auth, async (ctx) => {
  try {
    const { id } = ctx.params;
    const review = await Review.findById(id);

    if (!review) {
      ctx.throw(404, '评价不存在');
    }

    if (review.user.toString() !== ctx.state.user.id) {
      ctx.throw(403, '无权删除他人评价');
    }

    await review.remove();
    ctx.body = { message: '评价已删除' };
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

module.exports = router;
