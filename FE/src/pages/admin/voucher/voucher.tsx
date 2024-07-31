import {
    PlusSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Radio, Row, Table, Switch } from "antd";
import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import axios from "axios";
import { Link } from "react-router-dom";

const customTableHeaderCellStyle = {
    backgroundColor: "#c29957",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    height: "10px",
};

export default function Voucher() {
    const [value, setValue] = useState(1);

    // useEffect(() => {
    //   const fetchCate = async () => {
    //     try {
    //       const  response  = await axios.get("http://localhost:3001/api/sizes");
    //       setSize(response.data?.data);
    //       console.log(response.data?.data);

    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   };

    //   fetchCate();
    // }, []);


    // const deleteCategory = async (id: number) => {
    //   try {
    //     //dùng confirm để xóa
    //      const confirm = window.confirm("Bạn muốn xóa size này ?");
    //      if (confirm) {
    //       const response = await axios.delete(`http://localhost:3001/api/sizes/${id}`);
    //       if (response.status === 200) {
    //       const newArr = size.filter((item) => item["_id"] !== id);
    //       setSize(newArr);
    //     }
    //      }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    const onChangeRadio = (e: any) => {
        console.log("radio checked", e.target.value);
        setValue(e.target.value);
    };


    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
      };


    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center",
            width: "5%",
        },
        {
            title: "Mã giảm giá",
            dataIndex: "",
            key: "",
            align: "center",
            width: "15%",
        },
        {
            title: "Mô tả",
            dataIndex: "",
            key: "",
            align: "center",
            width: "15%",
        },
        {
            title: "Số lượng",
            dataIndex: "",
            key: "",
            align: "center",
            width: "10%",
        },
        {
            title: "Giảm giá",
            dataIndex: "",
            key: "",
            align: "center",
            width: "10%",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "",
            key: "",
            align: "center",
            width: "10%",
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "",
            key: "",
            align: "center",
            width: "10%",
        },
        ,
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: "10",
            render: (status: any, record: any) => (
                <Switch defaultChecked onChange={onChange} />
            ),
        },
        {
            title: "Action",
            dataIndex: "key",
            key: "key",
            align: "center",
            width: "5%",
            render: (value: any) => (
                <Button
                //   onClick={() => deleteCategory(value!)} 
                >Xóa</Button>
            ),
        },
    ];

    // const data = size.map((item: ISize, index: number) => {
    //   return {
    //     stt: index + 1,
    //     key: item._id,
    //     size : item.name,
    //   };
    // })

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
                    // dataSource={data}
                    columns={columns}
                />
            </Card>
        </div>
    );
}