const Router = require('koa-router');
const Area = require('../models/Area');

const router = new Router();

// 获取所有省份 (Level 1)
router.get('/provinces', async (ctx) => {
    try {
        const provinces = await Area.find({ level: 1 }).sort({ code: 1 });
        ctx.body = provinces;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { msg: 'Server Error' };
    }
});

// 获取下级区域 (根据 parentCode)
router.get('/children/:parentCode', async (ctx) => {
    try {
        const children = await Area.find({ parentCode: ctx.params.parentCode }).sort({ code: 1 });
        ctx.body = children;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { msg: 'Server Error' };
    }
});

// 递归获取树形结构 (由于数据量可能较大，这里只对前两级进行处理，或支持全量)
router.get('/tree', async (ctx) => {
    try {
        // 为了前端级联选择器方便，可以一次性返回，或分步加载。
        // 这里尝试一次性返回省和市，区由前端按需点击后再加载
        const areas = await Area.find({ level: { $lte: 2 } }).sort({ code: 1 });
        ctx.body = areas;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { msg: 'Server Error' };
    }
});

module.exports = router;
