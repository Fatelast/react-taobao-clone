const Router = require('koa-router');
const Product = require('../models/Product');

const router = new Router();

// 获取所有产品（支持分页和搜索）
router.get('/', async (ctx) => {
  const page = parseInt(ctx.query.page) || 1;
  const limit = parseInt(ctx.query.limit) || 12;
  const keyword = ctx.query.keyword || ''; // Get keyword from query
  const skip = (page - 1) * limit;

  // Build query object
  const query = {};
  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' }; // Case-insensitive regex search on name
  }

  const total = await Product.countDocuments(query);
  const products = await Product.find(query).skip(skip).limit(limit);

  ctx.body = {
    products,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
});

// 获取单个产品详情
router.get('/:id', async (ctx) => {
  try {
    const product = await Product.findById(ctx.params.id);
    if (!product) {
      ctx.throw(404, 'Product not found');
    }
    ctx.body = product;
  } catch (err) {
    if (err.kind === 'ObjectId') {
      ctx.throw(404, 'Product not found');
    }
    ctx.throw(500, err.message);
  }
});

// 添加产品（示例，实际可加认证）
router.post('/', async (ctx) => {
  const product = new Product(ctx.request.body);
  await product.save();
  ctx.body = product;
});

module.exports = router;