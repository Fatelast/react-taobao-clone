const mongoose = require('mongoose');
const Area = require('./models/Area');
const connectDB = require('./config/db');

/**
 * 核心行政区划种子数据 (省份 + 主要城市)
 * 用于在网络受限情况下确保基本功能可用
 */
const coreAreas = [
    // 省份 (Level 1)
    { code: '110000', name: '北京市', level: 1, parentCode: null },
    { code: '120000', name: '天津市', level: 1, parentCode: null },
    { code: '130000', name: '河北省', level: 1, parentCode: null },
    { code: '140000', name: '山西省', level: 1, parentCode: null },
    { code: '150000', name: '内蒙古自治区', level: 1, parentCode: null },
    { code: '210000', name: '辽宁省', level: 1, parentCode: null },
    { code: '220000', name: '吉林省', level: 1, parentCode: null },
    { code: '230000', name: '黑龙江省', level: 1, parentCode: null },
    { code: '310000', name: '上海市', level: 1, parentCode: null },
    { code: '320000', name: '江苏省', level: 1, parentCode: null },
    { code: '330000', name: '浙江省', level: 1, parentCode: null },
    { code: '340000', name: '安徽省', level: 1, parentCode: null },
    { code: '350000', name: '福建省', level: 1, parentCode: null },
    { code: '360000', name: '江西省', level: 1, parentCode: null },
    { code: '370000', name: '山东省', level: 1, parentCode: null },
    { code: '410000', name: '河南省', level: 1, parentCode: null },
    { code: '420000', name: '湖北省', level: 1, parentCode: null },
    { code: '430000', name: '湖南省', level: 1, parentCode: null },
    { code: '440000', name: '广东省', level: 1, parentCode: null },
    { code: '450000', name: '广西壮族自治区', level: 1, parentCode: null },
    { code: '460000', name: '海南省', level: 1, parentCode: null },
    { code: '500000', name: '重庆市', level: 1, parentCode: null },
    { code: '510000', name: '四川省', level: 1, parentCode: null },
    { code: '520000', name: '贵州省', level: 1, parentCode: null },
    { code: '530000', name: '云南省', level: 1, parentCode: null },
    { code: '540000', name: '西藏自治区', level: 1, parentCode: null },
    { code: '610000', name: '陕西省', level: 1, parentCode: null },
    { code: '620000', name: '甘肃省', level: 1, parentCode: null },
    { code: '630000', name: '青海省', level: 1, parentCode: null },
    { code: '640000', name: '宁夏回族自治区', level: 1, parentCode: null },
    { code: '650000', name: '新疆维吾尔自治区', level: 1, parentCode: null },
    { code: '710000', name: '台湾省', level: 1, parentCode: null },
    { code: '810000', name: '香港特别行政区', level: 1, parentCode: null },
    { code: '820000', name: '澳门特别行政区', level: 1, parentCode: null },

    // 主要城市 (Level 2)
    { code: '110100', name: '北京市', level: 2, parentCode: '110000' },
    { code: '310100', name: '上海市', level: 2, parentCode: '310000' },
    { code: '440100', name: '广州市', level: 2, parentCode: '440000' },
    { code: '440300', name: '深圳市', level: 2, parentCode: '440000' },
    { code: '330100', name: '杭州市', level: 2, parentCode: '330000' },
    { code: '320100', name: '南京市', level: 2, parentCode: '320000' },
    { code: '510100', name: '成都市', level: 2, parentCode: '510000' },
    { code: '420100', name: '武汉市', level: 2, parentCode: '420000' },
    { code: '610100', name: '西安市', level: 2, parentCode: '610000' },
    
    // 区县 (Level 3 - 仅限核心城市示例)
    { code: '440305', name: '南山区', level: 3, parentCode: '440300' },
    { code: '440304', name: '福田区', level: 3, parentCode: '440300' },
    { code: '110101', name: '东城区', level: 3, parentCode: '110100' },
    { code: '110105', name: '朝阳区', level: 3, parentCode: '110100' },
];

async function seedCore() {
    try {
        await connectDB();
        await Area.deleteMany({});
        await Area.insertMany(coreAreas);
        console.log(`Successfully seeded ${coreAreas.length} core areas.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedCore();
