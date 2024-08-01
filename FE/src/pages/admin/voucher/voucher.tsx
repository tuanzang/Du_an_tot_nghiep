import {
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Radio, Row, Table, Switch } from "antd";
import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import axios from "axios";
import { Link } from "react-router-dom";
import { render } from "react-dom";
import dayjs from "dayjs";

const customTableHeaderCellStyle = {
    backgroundColor: "#c29957",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    height: "10px",
};

export default function Voucher() {
    const [value, setValue] = useState(1);
    const [vouchers, setVouchers] = useState([]);

    const onChangeRadio = (e: any) => {
        console.log("radio checked", e.target.value);
        setValue(e.target.value);
    };


    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

    const fetchVouchers = async () => {      
        try {
            const response = await axios.get('http://localhost:3001/api/discountCode/discountCodes');
            setVouchers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch vouchers:", error);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);


    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center",
            width: "5%",
            render: (text: any, record: any, index: number) => index + 1,
        },
        {
            title: "Mã giảm giá",
            dataIndex: "code",
            key: "code",
            align: "center",
            width: "15%",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            align: "center",
            width: "15%",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            width: "10%",
        },
        {
            title: "Giảm giá",
            dataIndex: "discountType",
            key: "discountType",
            align: "center",
            width: "10%",
            render: (text: string, record: any) => 
                record.discountType === 'percentage' ? `${record.discountPercentage}%` : `${record.discountAmount} VNĐ`
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            align: "center",
            width: "10%",
            render:(value:any) => {
                return dayjs(value).format('DD/MM/YYYY HH:mm:ss')
            }
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "expirationDate",
            key: "expirationDate",
            align: "center",
            width: "10%",
            render:(value:any) => {
                return dayjs(value).format('DD/MM/YYYY HH:mm:ss')
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: "10%",
            render: (status: string, record: any) => (
                <Switch 
                    defaultChecked={status === "active"}
                    onChange={(checked) => onChange(checked, record)}
                />
            ),
        },
        {
            title: "Action",
            dataIndex: "key",
            key: "key",
            align: "center",
            width: "5%",
            render: (value: any) => (
                <Button>Xóa</Button>
            ),
        },
    ];

    return (
        <div>
            <BreadcrumbsCustom nameHere={"Mã giảm giá"} listLink={[]} />
            {/* filter */}
            <Card bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Input
                            id="hd-input-search"
                            style={{ width: "100%", borderColor: "#c29957" }}
                            size="middle"
                            placeholder="Tìm kiếm"
                            prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                        />
                    </Col>
                    <Col span={12}>
                        <Button
                            type="link"
                            icon={<PlusSquareOutlined />}
                            style={{
                                float: "right",
                                borderColor: "#c29957",
                                color: "#c29957",
                            }}
                        >
                            <Link to="/admin/voucher/add">Tạo mã</Link>
                        </Button>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: "12px" }}>
                    <Col span={12}>
                        <span>Trạng thái: </span>
                        <Radio.Group onChange={onChangeRadio} value={value}>
                            <Radio value={1}>Tất cả</Radio>
                            <Radio value={2}>Hoạt động</Radio>
                            <Radio value={3}>Ngưng hoạt động</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
            </Card>
            <Card style={{ marginTop: "12px" }}>
                <Table
                    components={{
                        header: {
                            cell: (props: any) => (
                                <th {...props} style={customTableHeaderCellStyle} />
                            ),
                        },
                    }}
                    dataSource={vouchers}
                    columns={columns}
                />
            </Card>
        </div>
    );
}
