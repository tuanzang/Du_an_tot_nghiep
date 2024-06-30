import {
  DownloadOutlined,
  EyeOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Radio, Row, Switch, Table } from "antd";
import React, { useState } from "react";
import BreadcrumbsCustom from "../../../../components/BreadcrumbsCustom";
import ModalAddAndUpdate from "../../../../components/ModalAddAndUpdate";

const customTableHeaderCellStyle: React.CSSProperties = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

export default function Staff() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [value, setValue] = useState(1);

  const onChangeRadio = (value: number) => {
    console.log("radio checked", value);
    setValue(value);
  };

  const onChangeSwith = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const listBestSeller = [
    {
      key: "1",
      img: "../src/assets/image/product/product-1.jpg",
      name: "p1",
      quantity: "1",
      status: true,
      size: "1",
    },
    {
      key: "2",
      img: "../src/assets/image/product/product-2.jpg",
      name: "p2",
      quantity: "2",
      status: false,
      size: "2",
    },
    {
      key: "3",
      img: "../src/assets/image/product/product-3.jpg",
      name: "p3",
      quantity: "3",
      status: true,
      size: "3",
    },
    {
      key: "4",
      img: "../src/assets/image/product/product-3.jpg",
      name: "p3",
      quantity: "3",
      status: false,
      size: "3",
    },
  ];

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "img",
      key: "img",
      width: "20%",
      render: (text: string) => (
        <img style={{ height: "70px" }} src={text} alt="error" />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      align: "center" as const,
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "30%",
      render: (key: boolean) => (
        <Switch
          style={{ backgroundColor: key ? "green" : "gray" }}
          checked={key}
          onChange={() => onChangeSwith(key)}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "key",
      key: "action",
      align: "center" as const,
      width: "10%",
      render: () => (
        <Button
          style={{ border: "none" }}
          onClick={() => {
            setOpenUpdate(true);
          }}
          icon={<EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />}
        />
      ),
    },
  ];

  // Define the type for Table Header Cell Props
  type CustomTableHeaderCellProps = React.ComponentProps<"th">;

  const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
    <th {...props} style={customTableHeaderCellStyle} />
  );
  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Nhân viên"} />
      {/* filter */}
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm nhân viên"
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
              type="default"
              onClick={() => setOpenAdd(true)}
              icon={<PlusSquareOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              Tạo nhân viên
            </Button>
            {/* tạo mới */}
            {openAdd && (
              <ModalAddAndUpdate
                open={openAdd}
                setOpen={setOpenAdd}
                title={"Thêm mới nhân viên"}
                buttonSubmit={
                  <Button
                    style={{ backgroundColor: "green", color: "White" }}
                    type="default"
                  >
                    Thêm
                  </Button>
                }
              >
                <Input type="number" placeholder="Nhập tên nhân viên" />
              </ModalAddAndUpdate>
            )}
            {/* Cập nhật */}
            {openUpdate && (
              <ModalAddAndUpdate
                open={openUpdate}
                setOpen={setOpenUpdate}
                title={"Xem chi tiết nhân viên"}
                buttonSubmit={
                  <Button
                    style={{ backgroundColor: "green", color: "White" }}
                    type="default"
                  >
                    Cập nhật
                  </Button>
                }
              >
                <Input type="number" placeholder="Nhập tên nhân viên" />
              </ModalAddAndUpdate>
            )}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={12}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => onChangeRadio(e.target.value)}
              value={value}
            >
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
              cell: CustomHeaderCell,
            },
          }}
          dataSource={listBestSeller}
          columns={columns}
        />
      </Card>
    </div>
  );
}
