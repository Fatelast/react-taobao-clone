const Router = require('koa-router');
const Product = require('../models/Product');

const router = new Router();

// 获取所有产品
router.get('/', async (ctx) => {
  ctx.body = await Product.find();
});

// 添加产品（示例，实际可加认证）
router.post('/', async (ctx) => {
  const product = new Product(ctx.request.body);
  await product.save();
  ctx.body = product;
});

module.exports = router;