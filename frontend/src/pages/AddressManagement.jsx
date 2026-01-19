import React, { useState, useEffect } from 'react';
import { 
    Card, Button, Form, Input, Modal, message, Cascader, 
    Space, Empty, Popconfirm, Typography, Divider, Checkbox
} from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, 
    EnvironmentOutlined, MobileOutlined, UserOutlined,
    BulbOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const AddressManagement = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [form] = Form.useForm();
    const [areaOptions, setAreaOptions] = useState([]);
    const [smartInput, setSmartInput] = useState('');

    useEffect(() => {
        fetchAddresses();
        fetchAreaOptions();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/address');
            setAddresses(res.data);
        } catch (error) {
            message.error('加载地址失败');
        } finally {
            setLoading(false);
        }
    };

    const fetchAreaOptions = async () => {
        try {
            // 先加载省份
            const res = await api.get('/areas/provinces');
            const options = res.data.map(p => ({
                value: p.name,
                label: p.name,
                code: p.code,
                isLeaf: false
            }));
            setAreaOptions(options);
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    };

    const loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        try {
            const res = await api.get(`/areas/children/${targetOption.code}`);
            targetOption.loading = false;
            targetOption.children = res.data.map(c => ({
                value: c.name,
                label: c.name,
                code: c.code,
                isLeaf: c.level === 3
            }));
            setAreaOptions([...areaOptions]);
        } catch (error) {
            targetOption.loading = false;
        }
    };

    const handleAddOrEdit = async (values) => {
        try {
            const payload = {
                ...values,
                province: values.area[0],
                city: values.area[1],
                district: values.area[2],
            };

            if (editingAddress) {
                await api.put(`/address/${editingAddress._id}`, payload);
                message.success('地址修改成功');
            } else {
                await api.post('/address', payload);
                message.success('地址添加成功');
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchAddresses();
        } catch (error) {
            message.error(error.response?.data?.msg || '操作失败');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/address/${id}`);
            message.success('地址已删除');
            fetchAddresses();
        } catch (error) {
            message.error('删除失败');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.patch(`/address/${id}/default`, {});
            message.success('已设为默认地址');
            fetchAddresses();
        } catch (error) {
            message.error('操作失败');
        }
    };

    // 智能解析逻辑
    const handleSmartParse = () => {
        if (!smartInput.trim()) return;

        // 简易解析正则
        const phoneRegex = /(1\d{10})/;
        const nameRegex = /^[\u4e00-\u9fa5]{2,4}/; // 假设开头是姓名
        
        let receiverName = '';
        let phoneNumber = '';
        let detailAddress = smartInput;

        const phoneMatch = smartInput.match(phoneRegex);
        if (phoneMatch) {
            phoneNumber = phoneMatch[1];
            detailAddress = detailAddress.replace(phoneNumber, '').trim();
        }

        const nameMatch = detailAddress.match(nameRegex);
        if (nameMatch) {
            receiverName = nameMatch[0];
            detailAddress = detailAddress.replace(receiverName, '').trim();
        }

        // 去除多余符号
        detailAddress = detailAddress.replace(/[，,。.\n]/g, ' ').trim();

        form.setFieldsValue({
            receiverName,
            phoneNumber,
            detailAddress
        });
        message.info('智能识别完成，请选择省市区并完善信息');
    };

    const openModal = (address = null) => {
        setEditingAddress(address);
        if (address) {
            form.setFieldsValue({
                ...address,
                area: [address.province, address.city, address.district]
            });
        } else {
            form.resetFields();
            setSmartInput('');
        }
        setIsModalVisible(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-50/50">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-200">
                        <EnvironmentOutlined className="text-2xl text-white" />
                    </div>
                    <div>
                        <Typography.Title level={2} className="!mb-0 !font-black">地址管理</Typography.Title>
                        <Typography.Text type="secondary" className="text-xs uppercase tracking-[0.2em]">Manage your shipping locations</Typography.Text>
                    </div>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    size="large"
                    onClick={() => openModal()}
                    className="bg-red-500 border-none shadow-xl shadow-red-100 hover:scale-105 transition-transform h-12 px-8 rounded-xl font-bold"
                >
                    新增地址
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {addresses.length > 0 ? (
                        addresses.map((addr, index) => (
                            <motion.div
                                key={addr._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card 
                                    className={`relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl ${addr.isDefault ? 'bg-white ring-2 ring-red-500/20' : 'bg-white'}`}
                                >
                                    {addr.isDefault && (
                                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider z-10">
                                            Default
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4 p-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <UserOutlined />
                                            </div>
                                             <div>
                                                <Typography.Text className="font-bold text-lg block">{addr.receiverName}</Typography.Text>
                                                <Typography.Text type="secondary" className="text-sm font-medium">{addr.phoneNumber}</Typography.Text>
                                            </div>
                                        </div>

                                        <Divider className="my-0 opacity-50" />

                                        <div className="flex gap-3">
                                            <EnvironmentOutlined className="text-red-400 mt-1 shrink-0" />
                                             <div>
                                                <Typography.Text className="text-gray-400 text-xs block font-bold mb-1 uppercase tracking-tighter">
                                                    {addr.province} / {addr.city} / {addr.district}
                                                </Typography.Text>
                                                <Typography.Paragraph className="text-gray-700 font-medium mb-0 line-clamp-2">
                                                    {addr.detailAddress}
                                                </Typography.Paragraph>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <Space split={<Divider type="vertical" className="mx-1" />}>
                                                <Button 
                                                    type="text" 
                                                    icon={<EditOutlined />} 
                                                    className="text-gray-400 hover:text-blue-500 px-1"
                                                    onClick={() => openModal(addr)}
                                                >
                                                    编辑
                                                </Button>
                                                <Popconfirm
                                                    title="确定删除此地址吗？"
                                                    onConfirm={() => handleDelete(addr._id)}
                                                    okText="确定"
                                                    cancelText="取消"
                                                >
                                                    <Button type="text" icon={<DeleteOutlined />} className="text-gray-400 hover:text-red-500 px-1">
                                                        删除
                                                    </Button>
                                                </Popconfirm>
                                            </Space>
                                            
                                            {!addr.isDefault && (
                                                <Button 
                                                    size="small" 
                                                    className="rounded-full text-[10px] font-bold border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500"
                                                    onClick={() => handleSetDefault(addr._id)}
                                                >
                                                    设为默认
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : !loading && (
                        <div className="col-span-full py-20 flex flex-col items-center">
                            <Empty description={<span className="text-gray-300 font-bold uppercase tracking-widest text-xs">No saved addresses yet</span>} />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <Modal
                title={
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">
                            <PlusOutlined />
                        </div>
                        <span className="font-black uppercase tracking-widest">{editingAddress ? '编辑收货地址' : '新增收货地址'}</span>
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                className="address-modal"
                centered
            >
                {/* 智能粘贴区 - UIUXPROMAX 重塑 */}
                {!editingAddress && (
                    <div className="bg-white/40 backdrop-blur-md p-5 rounded-[24px] mb-8 border border-white/60 shadow-inner group transition-all duration-500 hover:bg-white/60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                <BulbOutlined className="text-sm animate-pulse" /> 智能识别引擎 V1.0
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold">SMART PARSE ENGINE</span>
                        </div>
                        <Input.TextArea 
                            placeholder="粘贴：姓名，手机号，详细地址（如：张三，13800138000，XX省XX市...）"
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            value={smartInput}
                            onChange={(e) => setSmartInput(e.target.value)}
                            className="rounded-2xl border-none bg-white/30 backdrop-blur-sm focus:bg-white/80 transition-all duration-300 placeholder:text-gray-400 p-4 text-sm font-medium"
                        />
                        <div className="mt-4 flex justify-end">
                            <Button 
                                type="primary" 
                                size="small" 
                                onClick={handleSmartParse}
                                className="bg-gradient-to-r from-orange-400 to-orange-600 border-none rounded-xl text-[10px] h-8 px-5 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-200"
                                disabled={!smartInput}
                            >
                                立即智能解析
                            </Button>
                        </div>
                    </div>
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrEdit}
                    requiredMark={false}
                    className="address-form"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="receiverName"
                            label={<span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">收件人姓名</span>}
                            rules={[{ required: true, message: '请输入姓名' }]}
                        >
                            <Input prefix={<UserOutlined className="text-gray-300" />} className="h-11 rounded-xl bg-gray-50 border-none" placeholder="收件人姓名" />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            label={<span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">联系电话</span>}
                            rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '格式不正确' }]}
                        >
                            <Input prefix={<MobileOutlined className="text-gray-300" />} className="h-11 rounded-xl bg-gray-50 border-none" placeholder="11位手机号" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="area"
                        label={<span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">所在地区</span>}
                        rules={[{ required: true, message: '请选择地区' }]}
                    >
                        <Cascader 
                            options={areaOptions} 
                            loadData={loadData} 
                            placeholder="点击选择省/市/区" 
                            className="w-full h-11 promax-cascader"
                            expandTrigger="hover"
                        />
                    </Form.Item>

                    <Form.Item
                        name="detailAddress"
                        label={<span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">详细地址</span>}
                        rules={[{ required: true, message: '请输入详细地址' }]}
                    >
                        <Input.TextArea rows={3} className="rounded-xl bg-gray-50 border-none p-3" placeholder="街道、楼牌号等" />
                    </Form.Item>

                    <div className="bg-white/40 backdrop-blur-sm p-5 rounded-[24px] mb-8 border border-white/60 transition-all hover:bg-white/70 overflow-hidden">
                        <Form.Item name="isDefault" valuePropName="checked" noStyle>
                            <Checkbox className="promax-checkbox">
                                <div className="ml-3 flex flex-col justify-center">
                                    <span className="block font-black text-sm text-gray-800 leading-tight">设为默认收货地址</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Primary Shipping destination</span>
                                </div>
                            </Checkbox>
                        </Form.Item>
                    </div>

                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="w-full h-12 bg-red-500 border-none rounded-xl font-black uppercase tracking-[0.2em] shadow-lg shadow-red-100 mt-2 hover:scale-[1.02] transition-transform"
                    >
                        {editingAddress ? '保存修改' : '立即添加'}
                    </Button>
                </Form>
            </Modal>

            <style>{`
                .address-modal .ant-modal-content {
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(30px) saturate(190%) !important;
                    -webkit-backdrop-filter: blur(30px) saturate(190%) !important;
                    border: 1px solid rgba(255, 255, 255, 0.7) !important;
                    border-radius: 36px !important;
                    box-shadow: 0 50px 100px -30px rgba(0, 0, 0, 0.15) !important;
                    padding: 32px !important;
                    overflow: hidden;
                }
                .address-modal .ant-modal-header {
                    background: transparent !important;
                    border-bottom: none !important;
                    margin-bottom: 20px !important;
                }
                .address-modal .ant-modal-title {
                    background: transparent !important;
                }
                
                /* 统一输入框材质与聚焦逻辑 */
                .address-form .ant-input, 
                .address-form .ant-input-affix-wrapper,
                .address-form .ant-select-selector,
                .address-form .ant-input-textarea-show-count > .ant-input,
                .address-form textarea.ant-input {
                    background: rgba(255, 255, 255, 0.6) !important;
                    border: 1.5px solid rgba(0, 0, 0, 0.12) !important;
                    border-radius: 16px !important;
                    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1) !important;
                    box-shadow: none !important;
                }

                .address-form .ant-input-affix-wrapper {
                    padding: 0 16px !important;
                    height: 52px !important;
                }
                .address-form .ant-input-affix-wrapper .ant-input {
                    background: transparent !important;
                    border: none !important;
                    height: 100% !important;
                }

                .address-form .ant-select-selector {
                    height: 52px !important;
                    padding: 0 16px !important;
                }

                /* 聚焦状态的极智动效 */
                .address-form .ant-input-affix-wrapper-focused,
                .address-form .ant-input:focus,
                .address-form .ant-select-focused .ant-select-selector {
                    background: #fff !important;
                    border-color: #ff4d4f !important;
                    box-shadow: 0 0 0 4px rgba(255, 77, 79, 0.1) !important;
                    transform: scale(1.005);
                }

                .address-form .ant-form-item-label label {
                    font-size: 10px !important;
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.15em !important;
                    color: #aaa !important;
                    margin-bottom: 6px !important;
                }

                /* Checkbox 艺术重塑 */
                .promax-checkbox {
                    display: flex !important;
                    align-items: center !important;
                    width: 100% !important;
                }
                .promax-checkbox .ant-checkbox {
                    top: 0 !important;
                }
                .promax-checkbox .ant-checkbox-inner {
                    width: 24px !important;
                    height: 24px !important;
                    border-radius: 8px !important;
                    border: 2px solid rgba(0, 0, 0, 0.1) !important;
                    background: white !important;
                }
                .promax-checkbox .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: #ff4d4f !important;
                    border-color: #ff4d4f !important;
                }
                .promax-checkbox .ant-checkbox-checked::after {
                    border: none !important;
                }
                .promax-checkbox span:last-child {
                    flex: 1;
                    padding-inline-start: 0 !important;
                }

                /* 滚动条美化 */
                .address-form textarea.ant-input {
                    padding: 14px 16px !important;
                    min-height: 100px !important;
                }
            `}</style>
        </div>
    );
};

export default AddressManagement;
