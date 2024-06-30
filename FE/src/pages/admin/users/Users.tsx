import {
  DownloadOutlined,
  EyeOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Radio, Row, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import ModalAddAndUpdate from "../../../components/ModalAddAndUpdate";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import UserApi, { IUserResponseData } from "../../../config/userApi";
import dayjs from "dayjs";

const customTableHeaderCellStyle: React.CSSProperties = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

export default function Users() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [value, setValue] = useState(1);
  const [userList, setUserList] = useState<IUserResponseData[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await UserApi.getAllUsers();
      setUserList(data?.data?.map((it) => ({ key: it._id, ...it })));
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeRadio = (value: number) => {
    console.log("radio checked", value);
    setValue(value);
  };

  const columns = [
    // {
    //   title: "Ảnh",
    //   dataIndex: "img",
    //   key: "img",
    //   width: "20%",
    //   render: (text: string) => (
    //     <img style={{ height: "70px" }} src={text} alt="error" />
    //   ),
    // },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center" as const,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center" as const,
      render: (role: string) => {
        return role === "admin" ? (
          <Tag color="green">Admin</Tag>
        ) : (
          <Tag>User</Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      render: (createdAt: string) => {
        return <p>{dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}</p>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "key",
      key: "action",
      align: "center" as const,
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
      <BreadcrumbsCustom listLink={[]} nameHere={"Khách hàng"} />
      {/* filter */}
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm khách hàng"
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
              Tạo khách hàng
            </Button>
            {/* tạo mới */}
            {openAdd && (
              <ModalAddAndUpdate
                open={openAdd}
                setOpen={setOpenAdd}
                title={"Thêm mới khách hàng"}
                buttonSubmit={
                  <Button
                    style={{ backgroundColor: "green", color: "White" }}
                    type="default"
                  >
                    Thêm
                  </Button>
                }
              >
                <Input type="number" placeholder="Nhập tên khách hàng" />
              </ModalAddAndUpdate>
            )}
            {/* Cập nhật */}
            {openUpdate && (
              <ModalAddAndUpdate
                open={openUpdate}
                setOpen={setOpenUpdate}
                title={"Xem chi tiết khách hàng"}
                buttonSubmit={
                  <Button
                    style={{ backgroundColor: "green", color: "White" }}
                    type="default"
                  >
                    Cập nhật
                  </Button>
                }
              >
                <Input type="number" placeholder="Nhập tên khách hàng" />
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
          dataSource={userList}
          columns={columns}
        />
      </Card>
    </div>
  );
}
