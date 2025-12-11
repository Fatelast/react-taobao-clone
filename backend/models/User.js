const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 解释：Schema像数据蓝图。required: true必填，unique: true唯一。
// pre('save')钩子：在保存前加密密码（bcrypt.hash生成哈希，10是盐轮次）。methods.comparePassword用于登录验证密码。
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// 加密密码
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 验证密码
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
