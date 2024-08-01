import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Select,
    Card,
    DatePicker,
    DatePickerProps,
} from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import dayjs from "dayjs";

const VoucherAdd = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [expirationDate, setExpirationDate] = useState(null);

    const onStartDateChange: DatePickerProps['onChange'] = (date) => {
        setStartDate(date);
        
    };

    const onEndDateChange: DatePickerProps['onChange'] = (date) => {
        setExpirationDate(date);
    };

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onFinish = async ({discountVal, ...values}: any) => {
        try {
            const body = {
                ...values,
                startDate: startDate,
                expirationDate: expirationDate
            }

            if (body.discountType === 'percentage') {
                body.discountPercentage = discountVal                
            } else {
                body.discountAmount = discountVal
            }
            
            const response = await axios.post('http://localhost:3001/api/discountCode/add', body);
            toast.success("Mã giảm giá đã được thêm thành công!");
            navigate('/admin/voucher');
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi khi thêm mã giảm giá!");
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        toast.error("Vui lòng điền đầy đủ thông tin!");
    };
    

    return (
        <div className="">
            <BreadcrumbsCustom nameHere={"Thêm mã giảm giá"} listLink={[]} />
            <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="w-75 mx-auto">
                    <Card>
                        <Form.Item
                            label="Mã giảm giá"
                            name="code"
                            rules={[
                                { required: true, message: "Vui lòng nhập mã giảm giá!" },
                            ]}
                        >
                            <Input placeholder="Mã giảm giá" />
                        </Form.Item>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[
                                { required: true, message: "Vui lòng nhập mô tả!" },
                            ]}
                        >
                            <Input placeholder="Mô tả ngắn" />
                        </Form.Item>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Kiểu"
                            name="discountType"
                            rules={[
                                { required: true, message: "Vui lòng chọn kiểu!" },
                            ]}
                        >
                            <Select
                                defaultValue=""
                                style={{ width: 850 }}
                                onChange={handleChange}
                                options={[
                                    { value: 'percentage', label: '%' },
                                    { value: 'amount', label: 'VNĐ' },
                                ]}
                            />
                        </Form.Item>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Giảm"
                            name="discountVal"
                            rules={[
                                { required: true, message: "Vui lòng nhập!" },
                            ]}
                        >
                            <Input placeholder="Giảm" type="number" />
                        </Form.Item>
                    </Card>

                    <Card>
                        <div className="d-flex justify-content-around">
                            <Form.Item
                                label="Ngày bắt đầu"
                                name="startDate"
                                rules={[
                                    { required: true, message: "Vui lòng nhập ngày bắt đầu!" },
                                ]}
                            >
                                <DatePicker onChange={onStartDateChange}  showTime />
                            </Form.Item>

                            <Form.Item
                                label="Ngày kết thúc"
                                name="expirationDate"
                                rules={[
                                    { required: true, message: "Vui lòng nhập ngày kết thúc!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('startDate') < value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker  onChange={onEndDateChange} showTime />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                { required: true, message: "Vui lòng nhập số lượng mã giảm giá!" },
                            ]}
                        >
                            <Input placeholder="Số lượng" type="number" />
                        </Form.Item>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Giá trị đơn hàng tối thiểu"
                            name="minPurchaseAmount"
                            rules={[
                                { required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu!" },
                            ]}
                        >
                            <Input placeholder="Giá trị đơn hàng tối thiểu" type="number" />
                        </Form.Item>
                    </Card>

                    <Form.Item
                        wrapperCol={{ offset: 8, span: 16 }}
                        style={{ float: "right", paddingRight: "25px", marginTop: '20px' }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default VoucherAdd;
