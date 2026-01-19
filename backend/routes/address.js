const Router = require('koa-router');
const Address = require('../models/Address');
const authMiddleware = require('../middleware/auth');

const router = new Router();
router.use(authMiddleware);

// 获取当前用户的地址列表
router.get('/', async (ctx) => {
    try {
        const addresses = await Address.find({ userId: ctx.state.user.id }).sort({ isDefault: -1, createdAt: -1 });
        ctx.body = addresses;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { msg: 'Server Error' };
    }
});

// 新增地址
router.post('/', async (ctx) => {
    try {
        const { receiverName, phoneNumber, province, city, district, detailAddress, isDefault } = ctx.request.body;
        
        // 如果设置为默认地址，先将该用户其他地址设为非默认
        if (isDefault) {
            await Address.updateMany({ userId: ctx.state.user.id }, { isDefault: false });
        }

        const address = new Address({
            userId: ctx.state.user.id,
            receiverName,
            phoneNumber,
            province,
            city,
            district,
            detailAddress,
            isDefault: isDefault || false
        });

        await address.save();
        ctx.body = address;
    } catch (err) {
        ctx.status = 400;
        ctx.body = { msg: err.message };
    }
});

// 修改地址
router.put('/:id', async (ctx) => {
    try {
        const { id } = ctx.params;
        const { receiverName, phoneNumber, province, city, district, detailAddress, isDefault } = ctx.request.body;

        if (isDefault) {
            await Address.updateMany({ userId: ctx.state.user.id, _id: { $ne: id } }, { isDefault: false });
        }

        const address = await Address.findOneAndUpdate(
            { _id: id, userId: ctx.state.user.id },
            { receiverName, phoneNumber, province, city, district, detailAddress, isDefault },
            { new: true }
        );

        if (!address) {
            ctx.status = 404;
            ctx.body = { msg: 'Address not found' };
            return;
        }

        ctx.body = address;
    } catch (err) {
        ctx.status = 400;
        ctx.body = { msg: err.message };
    }
});

// 删除地址
router.delete('/:id', async (ctx) => {
    try {
        const { id } = ctx.params;
        const res = await Address.deleteOne({ _id: id, userId: ctx.state.user.id });
        if (res.deletedCount === 0) {
            ctx.status = 404;
            ctx.body = { msg: 'Address not found' };
            return;
        }
        ctx.body = { msg: 'Address deleted' };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { msg: 'Server Error' };
    }
});

// 设置默认地址
router.patch('/:id/default', async (ctx) => {
    try {
        const { id } = ctx.params;
        
        await Address.updateMany({ userId: ctx.state.user.id }, { isDefault: false });
        const address = await Address.findOneAndUpdate(
            { _id: id, userId: ctx.state.user.id },
            { isDefault: true },
            { new: true }
        );

        if (!address) {
            ctx.status = 404;
            ctx.body = { msg: 'Address not found' };
            return;
        }

        ctx.body = address;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { msg: 'Server Error' };
    }
});

module.exports = router;
