// 详细解释：mongoose.connect连接数据库。process.env.MONGO_URI从.env读取。
// 如果连接失败，程序退出。async/await处理异步（数据库连接是异步的）。MongoDB会自动创建数据库和集合（表）。
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
