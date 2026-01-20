// 解释：app.use(bodyParser())解析body。连接DB。加载路由，prefix设置URL前缀（如/products）。监听端口。
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const connectDB = require('./config/db');
const cors = require('@koa/cors');

const app = new Koa();
app.use(bodyParser());
app.use(cors({
  origin: 'http://localhost:3000',   // 允许 3000 端口访问
  credentials: true                  // 如果以后要带 cookie 可以开
}));
connectDB();

// 加载路由
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const addressRouter = require('./routes/address');
const areaRouter = require('./routes/area');
const reviewRouter = require('./routes/review');

app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(productsRouter.prefix('/products').routes()).use(productsRouter.allowedMethods());
app.use(cartRouter.prefix('/cart').routes()).use(cartRouter.allowedMethods());
app.use(ordersRouter.prefix('/orders').routes()).use(ordersRouter.allowedMethods());
app.use(addressRouter.prefix('/address').routes()).use(addressRouter.allowedMethods());
app.use(areaRouter.prefix('/areas').routes()).use(areaRouter.allowedMethods());
app.use(reviewRouter.prefix('/reviews').routes()).use(reviewRouter.allowedMethods());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));