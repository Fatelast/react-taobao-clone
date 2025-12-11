const jwt = require('jsonwebtoken');
//中间件检查请求头Authorization的Bearer token。验证token，解码用户ID，存到ctx.state.user。未通过抛401错误。
module.exports = async (ctx, next) => {
  const token = ctx.header.authorization?.split(' ')[1];
  if (!token) return ctx.throw(401, 'No token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.throw(401, 'Invalid token');
  }
};