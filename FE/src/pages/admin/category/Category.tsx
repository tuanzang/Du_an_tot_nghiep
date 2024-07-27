import {
  DownloadOutlined,
  EyeOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Radio, Row, Switch, Table } from "antd";
import React, { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import ModalAddAndUpdate from "../../../components/ModalAddAndUpdate";
import { ICategory } from "../../../interface/Categories";
import axios from "axios";
import { Link } from "react-router-dom";

const customTableHeaderCellStyle = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

export default function Category() {
  const [value, setValue] = useState(1);
  const [cates, setCates] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCates(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCate();
  }, []);
  const deleteCategory = async (id: number) => {
    try {
      //dùng confirm để xóa
      const confirm = window.confirm("Bạn muốn xóa danh mục này ?");
      if (confirm) {
        const response = await axios.delete(
          `http://localhost:3001/api/categories/${id}`
        );
        if (response.status === 200) {
          const newArr = cates.filter((item) => item["_id"] !== id);
          setCates(newArr);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeRadio = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const onChangeSwith = (checked) => {
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
      title: "Tên danh mục",
      dataIndex: "loai",
      key: "loai",
      align: "center",
      width: "20%",
    },
    {
      title: "Cập nhật",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "2%",
      render: (value: any) => (
        <Button>
          <Link to={`/admin/category/${value}`}>Sửa</Link>
        </Button>
      ),
    },
    {
      title: "Xóa",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "2%",
      render: (value: any) => (
        <Button onClick={() => deleteCategory(value!)}>Xóa</Button>
      ),
    },
  ];

  const data = cates.map((item: ICategory, index: number) => {
    return {
      stt: index + 1,
      key: item._id,
      loai: item.loai,
    };
  });
  return (
    <div>
      <BreadcrumbsCustom nameHere={"Danh mục"} />
      {/* filter */}
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm danh mục"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
            />
          </Col>
          <Col span={12}>
            <Button
              icon={<DownloadOutlined />}
              style={{
                float: "right",
                marginLeft: "12px",
                backgroundColor: "white",
                color: "green",
                borderColor: "green",
              }}
              type="default"
            >
              Export Excel
            </Button>
            <Button
              type="link"
              icon={<PlusSquareOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              <Link to="/admin/category/add">Tạo Danh Mục</Link>
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
            <Button
              type="default"
              icon={<SearchOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: (props) => (
                <th {...props} style={customTableHeaderCellStyle} />
              ),
            },
          }}
          dataSource={data}
          columns={columns}
        />
      </Card>
    </div>
  );
}
