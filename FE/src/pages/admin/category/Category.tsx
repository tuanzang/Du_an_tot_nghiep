import {
  EditOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Radio,
  Row,
  Switch,
  Table,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { ICategory } from "../../../interface/Categories";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const customTableHeaderCellStyle: React.CSSProperties = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

type CustomTableHeaderCellProps = React.ComponentProps<"th">;

const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
  <th {...props} style={customTableHeaderCellStyle} />
);

interface ISearchCategory {
  loai: string;
  status: string | null;
  page: number;
}

export default function Category() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<ISearchCategory>({
    loai: "",
    status: null,
    page: currentPage,
  });
  const pageSize = 5;
  const [cates, setCates] = useState<ICategory[]>([]);
  const [totalCategory, setTotalCategory] = useState<number>(0);

  const fetchCate = async (filter: ISearchCategory, currentPage: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/categories",
        { ...filter, page: currentPage }
      );

      setCates(response.data?.data);
      setTotalCategory(response.data?.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (
    checked: boolean,
    categoryId: string | null,
    filter: ISearchCategory
  ) => {
    if (categoryId === null) {
      toast.error("Không xác định được danh mục");
    } else {
      const newStatus = checked ? "1" : "0";
      Modal.confirm({
        title: "Xác nhận thay đổi trạng thái",
        content: "Bạn có chắc chắn muốn thay đổi trạng thái của danh mục này ?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await axios.post("http://localhost:3001/api/categories/delete", {
              _id: categoryId,
              status: newStatus,
            });
            toast.success("Cập nhật trạng thái thành công");
            fetchCate(filter, currentPage);
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

  useEffect(() => {
    fetchCate(filter, currentPage);
  }, [filter, currentPage]);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      render: (_: string, __: ICategory, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "loai",
      key: "loai",
      align: "left" as const,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "10%",
      render: (status: string, record: ICategory) => (
        <Switch
          checked={status === "1"}
          onChange={(checked) =>
            handleStatusChange(checked, record._id ? record._id : null, filter)
          }
          style={{
            backgroundColor: status === "1" ? "#87d068" : "#f50",
            borderColor: status === "1" ? "#87d068" : "#f50",
          }}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      width: "10%",
      render: (record: ICategory) => (
        <Tooltip title={"Cập nhật"}>
          <Link to={`/admin/category/${record._id}`}>
            <EditOutlined />
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Danh mục"} listLink={[]} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm danh mục"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              onChange={(e) => setFilter({ ...filter, loai: e.target.value })}
            />
          </Col>
          <Col span={9}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              value={filter.status}
            >
              <Radio value={null}>Tất cả</Radio>
              <Radio value={"1"}>Hoạt động</Radio>
              <Radio value={"0"}>Ngưng hoạt động</Radio>
            </Radio.Group>
          </Col>
          <Col span={3}>
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
      </Card>
      <Card style={{ marginTop: "12px" }}>
        <Table
          components={{
            header: {
              cell: CustomHeaderCell,
            },
          }}
          dataSource={cates}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: totalCategory,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
}
