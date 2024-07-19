import React, { useState } from "react";
import { Table, Input, Button, Pagination } from "antd";

const ordersData = [
  { id: "001", date: "2023-07-01", status: "Đang xử lý" },
  { id: "002", date: "2023-07-02", status: "Hoàn thành" },
  { id: "003", date: "2023-07-03", status: "Đã hủy" },
  { id: "004", date: "2023-07-04", status: "Đang xử lý" },
  { id: "005", date: "2023-07-05", status: "Hoàn thành" },
  // Thêm các đơn hàng khác nếu cần
];

interface Order {
  id: string;
  date: string;
  status: string;
}

const OrderHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  const filteredOrders = ordersData.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_: any, record: Order) => (
        <span>
          <Button type="primary" size="small" className="me-2">
            Chi tiết
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lịch Sử Đơn Hàng</h2>
      <Input.Search
        placeholder="Tìm kiếm theo mã đơn hàng"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20 }}
      />
      <Table
        columns={columns}
        dataSource={currentItems}
        pagination={false}
        rowKey="id"
      />
      <Pagination
        current={currentPage}
        total={filteredOrders.length}
        pageSize={itemsPerPage}
        onChange={handlePageChange}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default OrderHistory;
