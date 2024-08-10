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
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import axios from "axios";
import { ISize } from "../../../interface/Size";
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

interface ISearchSize {
  name: string;
  status: string | null;
  page: number;
}
export default function Size() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<ISearchSize>({
    name: "",
    status: null,
    page: currentPage,
  });
  const pageSize = 5;
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);

  // add size
  const [openAddSize, setOpenAddSize] = useState(false);
  const [addSize, setAddSize] = useState<ISize>({
    _id: null,
    sizeCode: "",
    name: "",
    status: "1",
  });

  const [openUpdateSize, setOpenUpdateSize] = useState(false);
  const [updateSize, setUpdateSize] = useState<ISize>({
    _id: null,
    sizeCode: "",
    name: "",
    status: "1",
  });

  const fetchSizes = async (filter: ISearchSize, currentPage: number) => {
    try {
      const response = await axios.get("http://localhost:3001/api/sizes", {
        ...filter,
        page: currentPage,
      });
      setSizes(response.data?.data);
      setTotalSize(response.data?.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSizes(filter, currentPage);
  }, [filter, currentPage]);

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (
    checked: boolean,
    sizeId: string | null,
    filter: ISearchSize
  ) => {
    if (sizeId === null) {
      toast.error("Không xác định được kích cỡ");
    } else {
      const newStatus = checked ? "1" : "0";
      Modal.confirm({
        title: "Xác nhận thay đổi trạng thái",
        content: "Bạn có chắc chắn muốn thay đổi trạng thái của kích cỡ này ?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await axios.put("http://localhost:3001/api/sizes/put", {
              _id: sizeId,
              status: newStatus,
            });
            toast.success("Cập nhật trạng thái thành công");
            fetchSizes(filter, currentPage);
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

  // api add size
  const handleAddSize = async (
    addSize: ISize,
    filter: ISearchSize,
    currentPage: number
  ) => {
    try {
      const respone = await axios.post(
        "http://localhost:3001/api/sizes/add",
        addSize
      );
      if (respone.data.success) {
        toast.success(respone.data.message);
        setOpenAddSize(false);
        fetchSizes(filter, currentPage);
      } else {
        toast.error(respone.data.message);
      }
    } catch (err) {
      toast.error("Tạo mới kích cỡ thất bại");
    }
  };

  // api find size
  const handleFindOneSize = async (id: string | null) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/sizes/findOne",
        { _id: id }
      );

      const data = response.data?.data;
      if (data) {
        setOpenUpdateSize(true);
        setUpdateSize({
          _id: data._id,
          sizeCode: data.sizeCode,
          name: data.name,
          status: data.status,
        });
      } else {
        setOpenUpdateSize(false);
        toast.error("Không tìm thấy kích cỡ");
      }
    } catch (err) {
      toast.error("Không tìm thấy kích cỡ");
    }
  };

  // api update size
  const handleUpdateSize = async (
    updateSize: ISize,
    filter: ISearchSize,
    currentPage: number
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/sizes/update",
        updateSize
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setOpenUpdateSize(false);
        fetchSizes(filter, currentPage);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Cập nhật kích cỡ thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      render: (_: string, __: ISize, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Mã kích cỡ",
      dataIndex: "sizeCode",
      key: "sizeCode",
      align: "left" as const,
      width: "20%",
    },
    {
      title: "Tên kích cỡ",
      dataIndex: "name",
      key: "name",
      align: "left" as const,
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "10%",
      render: (status: string, record: ISize) => (
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
      render: (record: ISize) => (
        <Tooltip title={"Cập nhật"}>
          <EditOutlined onClick={() => handleFindOneSize(record._id)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Kích cỡ"} listLink={[]} />
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm kích cỡ"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              onChange={(e) => setFilter({ ...filter, name: e.target.value })}
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
              onClick={() => setOpenAddSize(true)}
            >
              Tạo Size
            </Button>

            {/* Modal tạo mới */}
            <Modal
              title="Tạo mới kích cỡ"
              open={openAddSize}
              onOk={() => handleAddSize(addSize, filter, currentPage)}
              onCancel={() => setOpenAddSize(false)}
            >
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Mã kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input
                  type="text"
                  onChange={(e) =>
                    setAddSize({ ...addSize, sizeCode: e.target.value })
                  }
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Tên kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input
                  type="text"
                  onChange={(e) =>
                    setAddSize({ ...addSize, name: e.target.value })
                  }
                />
              </div>
            </Modal>

            {/* Modal cập nhật */}
            <Modal
              title={`Cập nhật kích cỡ ${updateSize.sizeCode}`}
              open={openUpdateSize}
              onOk={() => handleUpdateSize(updateSize, filter, currentPage)}
              onCancel={() => setOpenUpdateSize(false)}
            >
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Mã kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input type="text" value={updateSize?.sizeCode} disabled />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <Typography.Text>
                  <strong>Tên kích cỡ </strong>
                  <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                </Typography.Text>
                <Input
                  type="text"
                  value={updateSize?.name}
                  onChange={(e) =>
                    setUpdateSize({ ...updateSize, name: e.target.value })
                  }
                />
              </div>
            </Modal>
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
          dataSource={sizes}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: totalSize,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
}
