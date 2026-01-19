const mongoose = require('mongoose');

/**
 * Area Model
 * 存储中国行政区划数据 (省、市、区)
 */
const areaSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: { type: Number, required: true }, // 1: 省, 2: 市, 3: 区
    parentCode: { type: String, default: null }, // 父级编码
});

// 索引优化查询
areaSchema.index({ parentCode: 1 });
areaSchema.index({ level: 1 });

module.exports = mongoose.model('Area', areaSchema);
