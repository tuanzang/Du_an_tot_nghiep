import { Card, Col, Row, Select, Table, Switch, Modal, Radio } from "antd";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { useEffect, useState } from "react";
import { IComment } from "../../../interface/Comments";
import { IProduct } from "../../../interface/Products";
import { IUser } from "../../../interface/Users";
import axios from "axios";
import { toast } from "react-toastify";

const customTableHeaderCellStyle: React.CSSProperties = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

// Define the type for Table Header Cell Props
type CustomTableHeaderCellProps = React.ComponentProps<"th">;

const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

export default function PageComment() {
  const [idUser, setIdUser] = useState<string | null>(null);
  const [idProduct, setIdProduct] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // State để quản lý trạng thái lọc
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const [listComment, setListComment] = useState<IComment[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // API danh sách bình luận
  const fetchComment = async (
    idProduct: string | null,
    idUser: string | null,
    status: string | null,
    page: number
  ) => {
    try {
      const response = await axios.post("http://localhost:3001/api/comments", {
        idUser: idUser,
        idProduct: idProduct,
        status: status,
        page: page,
      });
      setListComment(response.data?.data.comments);
      setTotalComments(response.data?.data.total);
      setPageSize(response.data?.data.size);
    } catch (error) {
      toast.warning("Không có dữ liệu");
    }
  };

  // API danh sách sản phẩm
  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/comments/allProduct"
      );
      setListProduct(response.data?.data);
    } catch (error) {
      toast.warning("Không có dữ liệu");
    }
  };

  // API danh sách tài khoản
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/comments/allUser"
      );
      setListUser(response.data?.data);
    } catch (error) {
      toast.warning("Không có dữ liệu");
    }
  };

  useEffect(() => {
    fetchComment(idProduct, idUser, statusFilter, currentPage);
    fetchProduct();
    fetchUser();
  }, [idUser, idProduct, statusFilter, currentPage]);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (checked: boolean, commentId: string | null) => {
    if (commentId === null) {
      toast.error("Không xác định được id bình luận");
    } else {
      const newStatus = checked ? "1" : "0";
      Modal.confirm({
        title: "Xác nhận thay đổi trạng thái",
        content:
          "Bạn có chắc chắn muốn thay đổi trạng thái của bình luận này thành ?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await axios.post("http://localhost:3001/api/comments/delete", {
              _id: commentId,
              status: newStatus,
            });
            toast.success("Cập nhật trạng thái thành công");
            fetchComment(idProduct, idUser, statusFilter, currentPage);
          } catch (error) {
            toast.error("Cập nhật trạng thái thất bại");
          }
        },
        onCancel() {
          // Không làm gì khi người dùng hủy
        },
      });
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      render: (_: string, __: IComment, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên tài khoản",
      dataIndex: "fullName",
      key: "fullName",
      align: "left" as const,
      width: "20%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "left" as const,
      width: "20%",
    },
    {
      title: "Nội dung",
      dataIndex: "comment",
      key: "comment",
      align: "left" as const,
      width: "45%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "10%",
      render: (status: string, record: IComment) => (
        <Switch
          checked={status === "1"}
          onChange={(checked) =>
            handleStatusChange(checked, record._id ? record._id : null)
          }
          style={{
            backgroundColor: status === "1" ? "#87d068" : "#f50",
            borderColor: status === "1" ? "#87d068" : "#f50",
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Bình luận"} />
      <Card bordered={false}>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={5}>
            <span>Sản phẩm: </span>
            <Select
              onChange={(value) => {
                setIdProduct(value);
                setCurrentPage(1);
              }}
              style={{ width: "100%" }}
              value={idProduct}
            >
              <Select.Option value={null}>Tất cả</Select.Option>
              {listProduct.map((product) => (
                <Select.Option key={product._id} value={product._id}>
                  {product.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={5}>
            <span>Khách hàng: </span>
            <Select
              onChange={(value) => {
                setIdUser(value);
                setCurrentPage(1);
              }}
              style={{ width: "100%" }}
              value={idUser}
            >
              <Select.Option value={null}>Tất cả</Select.Option>
              {listUser.map((user) => (
                <Select.Option key={user._id} value={user._id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={14}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              value={statusFilter}
            >
              <Radio value={null}>Tất cả</Radio>
              <Radio value="1">Hoạt động</Radio>
              <Radio value="0">Ngừng hoạt động</Radio>
            </Radio.Group>
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
          dataSource={listComment}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalComments,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
}
