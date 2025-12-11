
const Router = require('koa-router');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

const router = new Router();
router.use(authMiddleware);   // 所有购物车接口都需要登录

// 获取购物车
router.get('/', async (ctx) => {
  let cart = await Cart.findOne({ user: ctx.state.user.id }).populate('items.product');
  if (!cart) cart = { items: [], updatedAt: new Date() };
  ctx.body = cart;
});

// 添加到购物车（已有）
router.post('/add', async (ctx) => { /* 你之前写的代码 */ });

// 修改数量
router.put('/update', async (ctx) => {
  const { productId, quantity } = ctx.request.body;
  const cart = await Cart.findOne({ user: ctx.state.user.id });
  const item = cart.items.find(i => i.product.toString() === productId);
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
  }
  ctx.body = await Cart.findOne({ user: ctx.state.user.id }).populate('items.product');
});

// 删除商品
router.delete('/remove/:productId', async (ctx) => {
  const { productId } = ctx.params;
  const cart = await Cart.findOne({ user: ctx.state.user.id });
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  ctx.body = await Cart.findOne({ user: ctx.state.user.id }).populate('items.product');
});

// 清空购物车（下单成功后调用）
router.delete('/clear', async (ctx) => {
  await Cart.deleteOne({ user: ctx.state.user.id });
  ctx.body = { msg: 'Cart cleared' };
});

module.exports = router;