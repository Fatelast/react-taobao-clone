const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//router.post处理POST请求。ctx.request.body从bodyparser获取数据。
// 注册：检查用户是否存在，保存新用户，生成JWT token（签名用secret，过期1小时）。
// 登录：找用户，比较密码，生成token。错误用ctx.throw
const router = new Router();

// 注册
router.post('/register', async (ctx) => {
    const { username, email, password } = ctx.request.body;
    try {
        let user = await User.findOne({ email });
        if (user) return ctx.body = { msg: 'User exists' };

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        ctx.body = { token };
    } catch (err) {
        ctx.throw(500, err.message);
    }
});

// 登录
router.post('/login', async (ctx) => {
    const { email, password } = ctx.request.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return ctx.body = { msg: 'Invalid credentials' };

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return ctx.body = { msg: 'Invalid credentials' };

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        ctx.body = { token };
    } catch (err) {
        ctx.throw(500, err.message);
    }
});

module.exports = router;
