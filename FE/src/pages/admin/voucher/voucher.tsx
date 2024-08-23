import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Table,
  Switch,
  message,
} from "antd";
import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axiosInstance from "../../../config/axios";
import { socket } from "../../../socket";

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
    setValue(e.target.value);
  };

  const onChangeStatus = (checked: boolean, record: any) => {
    onUpdateStatus(record._id, checked ? "active" : "inactive");
  };

  const onUpdateStatus = async (id: string, status: string) => {
    try {
      await axiosInstance.put(`/discountCode/discountCodes/${id}`, {
        status,
      });
      message.success("Cập nhật trạng thái thành công");
      socket.emit("update voucher");
      fetchVouchers();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/discountCode/discountCodes"
      );

      // Kiểm tra ngày hết hạn và cập nhật trạng thái nếu cần
      const updatedVouchers = await Promise.all(
        response.data.map(async (voucher: any) => {
          const isExpired = dayjs().isAfter(dayjs(voucher.expirationDate));
          if (isExpired && voucher.status !== "inactive") {
            await onUpdateStatus(voucher._id, "inactive");
            return { ...voucher, status: "inactive" };
          }
          return voucher;
        })
      );
      updatedVouchers.sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
      setVouchers(updatedVouchers);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const filteredVouchers = vouchers.filter((voucher) => {
    if (value === 1) return true; // Tất cả
    if (value === 2) return voucher.status === "active"; // Hoạt động
    if (value === 3) return voucher.status === "inactive"; // Ngưng hoạt động
    return false;
  });

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
      title: "Đã sử dụng",
      dataIndex: "usedCount",
      key: "usedCount",
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
        record.discountType === "percentage"
          ? `${record.discountPercentage}%`
          : `${record.discountAmount} VNĐ`,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      width: "10%",
      render: (value: any) => {
        return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "expirationDate",
      key: "expirationDate",
      align: "center",
      width: "10%",
      render: (value: any) => {
        return dayjs(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "10%",
      render: (status: string, record: any) => (
        <Switch
          checked={status === "active"}
          onChange={(checked) => onChangeStatus(checked, record)}
        />
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
          dataSource={filteredVouchers}
          columns={columns}
        />
      </Card>
    </div>
  );
}
