// backend/routes/orders.js
const Router = require('koa-router');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

const router = new Router();
router.use(authMiddleware);

// 创建订单（下单）
router.post('/checkout', async (ctx) => {
  const cart = await Cart.findOne({ user: ctx.state.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    ctx.throw(400, 'Cart is empty');
  }

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: ctx.state.user.id,
    items: orderItems,
    total,
  });
  await order.save();

  // 清空购物车
  await Cart.deleteOne({ user: ctx.state.user.id });

  ctx.body = await Order.findById(order._id).populate('items.product');
});

// 获取我的订单列表
router.get('/', async (ctx) => {
  const orders = await Order.find({ user: ctx.state.user.id })
    .populate('items.product')
    .sort({ createdAt: -1 });
  ctx.body = orders;
});

module.exports = router;