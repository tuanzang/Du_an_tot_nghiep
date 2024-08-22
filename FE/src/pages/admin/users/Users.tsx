// components/Users.js
import {
  DownloadOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  UserSwitchOutlined,
  StopOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Table,
  Tag,
  Modal,
  message,
} from "antd";
import { useEffect, useState } from "react";
import ModalAddAndUpdate from "../../../components/ModalAddAndUpdate";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import UserApi, { IUserResponseData } from "../../../config/userApi";
import dayjs from "dayjs";
import { ColumnType } from "antd/es/table";
import { ColumnGroupType } from "antd/lib/table";
import * as XLSX from "xlsx";
import { socket } from "../../../socket";

const customTableHeaderCellStyle: React.CSSProperties = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
};

export default function Users() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateUser, setUpdateUser] = useState<IUserResponseData | null>(null);
  const [value, setValue] = useState(1);
  const [userList, setUserList] = useState<IUserResponseData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers(searchTerm);
  }, [searchTerm]);

  const fetchUsers = async (searchTerm: string = "") => {
    try {
      const { data } = await UserApi.getAllUsers();
      const filteredUsers =
        data?.data?.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
      setUserList(
        filteredUsers.map((user, index) => ({
          key: user._id,
          stt: index + 1,
          ...user,
        }))
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleUpdate = async (role: string) => {
    if (updateUser) {
      try {
        await UserApi.updateRoleUser(updateUser._id, role);
        message.success("Cập nhật vai trò thành công");
        fetchUsers(searchTerm);
        setOpenUpdate(false);
      } catch (error) {
        message.error(
          "Cập nhật vai trò không thành công. Vui lòng thử lại sau."
        );
        console.error("Error updating role:", error);
      }
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await UserApi.blockUser(userId);
      socket.emit('block user', userId);
      message.success("Chặn người dùng thành công");

      setUserList((prevUserList) =>
        prevUserList.map((user) =>
          user._id === userId
            ? { ...user, blocked: true, status: "inactive" }
            : user
        )
      );
    } catch (error) {
      message.error("Chặn người dùng không thành công. Vui lòng thử lại sau.");
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await UserApi.unblockUser(userId);
      message.success("Bỏ chặn người dùng thành công");

      setUserList((prevUserList) =>
        prevUserList.map((user) =>
          user._id === userId
            ? { ...user, blocked: false, status: "active" }
            : user
        )
      );
    } catch (error) {
      message.error(
        "Bỏ chặn người dùng không thành công. Vui lòng thử lại sau."
      );
      console.error("Error unblocking user:", error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "Users.xlsx");
  };

  const columns: (
    | ColumnType<IUserResponseData>
    | ColumnGroupType<IUserResponseData>
  )[] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role: string) => (
        <Tag color={role === "admin" ? "green" : "default"}>
          {role === "admin" ? "Admin" : "User"}
        </Tag>
      ),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt: string) =>
        dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Hành động",
      dataIndex: "key",
      key: "action",
      align: "center",
      render: (_: React.ReactNode, record: IUserResponseData) => (
        <div>
          <Button
            icon={
              <UserSwitchOutlined
                style={{ fontSize: "20px", color: "#1890ff" }}
              />
            }
            onClick={() => {
              setUpdateUser(record);
              setOpenUpdate(true);
            }}
            style={{ border: "none" }}
          />
          {record.blocked ? (
            <Button
              icon={
                <CheckOutlined style={{ fontSize: "20px", color: "#52c41a" }} />
              }
              onClick={() => handleUnblockUser(record._id)}
              style={{ border: "none", marginLeft: "10px" }}
            >
              Bỏ chặn
            </Button>
          ) : (
            <Button
              icon={
                <StopOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
              }
              onClick={() => handleBlockUser(record._id)}
              style={{ border: "none", marginLeft: "10px" }}
            >
              Chặn
            </Button>
          )}
        </div>
      ),
    },
  ];

  const CustomHeaderCell: React.FC<React.ComponentProps<"th">> = (props) => (
    <th {...props} style={customTableHeaderCellStyle} />
  );

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Khách hàng"} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm khách hàng"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              onChange={handleSearch}
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
              onClick={exportToExcel}
            >
              Export Excel
            </Button>
            <Modal
              title="Chỉnh sửa vai trò"
              visible={openUpdate}
              onCancel={() => setOpenUpdate(false)}
              footer={null}
            >
              {updateUser && (
                <div>
                  <Button
                    type="default"
                    style={{ margin: "5px" }}
                    onClick={() => handleRoleUpdate("admin")}
                  >
                    Chỉ định làm Admin
                  </Button>
                  <Button
                    type="default"
                    style={{ margin: "5px" }}
                    onClick={() => handleRoleUpdate("user")}
                  >
                    Chỉ định làm User
                  </Button>
                </div>
              )}
            </Modal>
          </Col>
        </Row>
        {/* <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={12}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => setValue(e.target.value)}
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
              onClick={() => fetchUsers(searchTerm)}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row> */}
      </Card>
      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{ header: { cell: CustomHeaderCell } }}
          dataSource={userList}
          columns={columns}
        />
      </Card>
    </div>
  );
}
