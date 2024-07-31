import type { FormProps } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Form,
    Input,
    Select,
    Card,
    DatePicker,
    DatePickerProps
} from "antd";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";

const VoucherAdd = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const onStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        // setStartDate(date);
        console.log(date,dateString);
        
    };

    const onEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        // setEndDate(date);
        console.log(date,dateString);
    };

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <div className="">
            <BreadcrumbsCustom nameHere={"Thêm mã giảm giá"} listLink={[]} />
            <Form
                name="basic"
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <div className="w-75 mx-auto">
                    <Card>
                        <Form.Item
                            label="Mã giảm giá"
                            name="name"
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
                            name=""
                            rules={[
                                { required: true, message: "Vui lòng chọn kiểu!" },
                            ]}
                        >
                            <Select
                                defaultValue=""
                                style={{ width: 850 }}
                                onChange={handleChange}
                                options={[
                                    { value: '%', label: '%' },
                                    { value: 'VNĐ', label: 'VNĐ' },
                                ]}
                            />
                        </Form.Item>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Giảm"
                            name=""
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
                                <DatePicker onChange={onStartDateChange} />
                            </Form.Item>

                            <Form.Item
                                label="Ngày kết thúc"
                                name="endDate"
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
                                <DatePicker  onChange={onEndDateChange} />
                            </Form.Item>
                        </div>
                    </Card>

                    <Card>
                        <Form.Item
                            label="Số lượng"
                            name=""
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
                            name=""
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
