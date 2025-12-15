const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = new Router();

// 验证 Token 并返回当前用户信息
router.get('/me', auth, async (ctx) => {
    try {
        const user = await User.findById(ctx.state.user.id).select('-password');
        if (!user) return ctx.throw(404, 'User not found');
        ctx.body = user;
    } catch (err) {
        ctx.throw(500, err.message);
    }
});

// 注册
router.post('/register', async (ctx) => {
    const { username, email, password } = ctx.request.body;
    try {
        let user = await User.findOne({ email });
        if (user) return ctx.body = { msg: 'User exists' };

        user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        ctx.body = { 
            token, 
            user: { id: user._id, username: user.username, email: user.email } 
        };
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
        ctx.body = { 
            token, 
            user: { id: user._id, username: user.username, email: user.email } 
        };
    } catch (err) {
        ctx.throw(500, err.message);
    }
});

module.exports = router;
