import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ISize } from "../../../interface/Size";

const customTableHeaderCellStyle = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

export default function Size() {
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [filteredSizes, setFilteredSizes] = useState<ISize[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/sizes");
        setSizes(response.data?.data);
        setFilteredSizes(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSizes();
  }, []);

  const deleteSize = async (id: number) => {
    try {
      const confirm = window.confirm("Bạn muốn xóa size này?");
      if (confirm) {
        const response = await axios.delete(
          `http://localhost:3001/api/sizes/${id}`
        );
        if (response.status === 200) {
          const newArr = sizes.filter((item) => item["_id"] !== id);
          setSizes(newArr);
          setFilteredSizes(newArr);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (value) {
      setFilteredSizes(
        sizes.filter((size) =>
          size.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredSizes(sizes);
    }
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
      title: "Size",
      dataIndex: "size",
      key: "size",
      align: "center",
      width: "20%",
    },
    {
      title: "Xóa",
      dataIndex: "key",
      key: "key",
      align: "center",
      width: "10%",
      render: (value: any) => (
        <Button onClick={() => deleteSize(value)}>Xóa</Button>
      ),
    },
  ];

  const data = filteredSizes.map((item: ISize, index: number) => ({
    stt: index + 1,
    key: item._id,
    size: item.name,
  }));

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Size"} listLink={[]} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              value={searchText}
              onChange={onSearch}
            />
          </Col>
          <Col span={12}>
            <Link to="/admin/size/add">
              <Button
                type="link"
                icon={<PlusSquareOutlined />}
                style={{
                  float: "right",
                  borderColor: "#c29957",
                  color: "#c29957",
                }}
              >
                Tạo Size
              </Button>
            </Link>
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
          dataSource={data}
          columns={columns}
        />
      </Card>
    </div>
  );
}
