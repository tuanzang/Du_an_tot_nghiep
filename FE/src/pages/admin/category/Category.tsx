import {
  EditOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Table } from "antd";
import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { ICategory, optionData } from "../../../interface/Categories";
import axios from "axios";
import { Link } from "react-router-dom";
import { ColumnType } from "antd/es/table";

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

export default function Category() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCate, setTotalCate] = useState<number>(0);
  const [cates, setCates] = useState<ICategory[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    fetchCate(currentPage, searchText);
  }, [currentPage, searchText]);

  const fetchCate = async (currentPage: number, searchText: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/categories/page",
        { page: currentPage, loai: searchText }
      );
      console.log(response.data); // Kiểm tra dữ liệu nhận được từ API

      setCates(response.data?.data);
      setTotalCate(response.data?.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const fetchCate = async (currentPage: number, searchText: string) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3001/api/categories/page",
  //       { page: currentPage, loai: searchText }
  //     );

  //     const updatedCates = response.data?.data.map((cate: any) => ({
  //       ...cate,
  //       options: [...cate.options /* Your updated options here */], // Update options
  //     }));

  //     setCates(updatedCates);
  //     setTotalCate(response.data?.total);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // const columns = [
  //   {
  //     title: "STT",
  //     dataIndex: "stt",
  //     key: "stt",
  //     align: "center" as const,
  //     width: "5%",
  //     render: (_: string, record: ICategory, index: number) =>
  //       (currentPage - 1) * 5 + index + 1,
  //   },
  //   {
  //     title: "Tên danh mục",
  //     dataIndex: "loai",
  //     key: "loai",
  //     align: "center" as const,
  //     width: "20%",
  //   },
  //   {
  //     title: "Phụ kiện",
  //     align: "center" as const,
  //     width: "30%",
  //     render: (record: ICategory) => (
  //       <Table
  //         dataSource={record.options}
  //         pagination={false}
  //         columns={[
  //           {
  //             title: "Tên",
  //             dataIndex: "name",
  //             key: "name",
  //             align: "center" as const,
  //           },
  //           {
  //             title: "Số lượng",
  //             dataIndex: "quantity",
  //             key: "quantity",
  //             align: "center" as const,
  //           },
  //         ]}
  //         rowKey="_id"
  //         size="small"
  //       />
  //     ),
  //   },
  //   {
  //     title: "Cập nhật",
  //     align: "center",
  //     width: "2%",
  //     render: (record: ICategory) => (
  //       <Link to={`/admin/category/${record._id}`}>
  //         <EditOutlined />
  //       </Link>
  //     ),
  //   },
  // ];
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      width: "5%",
      render: (_: string, __: ICategory, index: number) =>
        (currentPage - 1) * 5 + index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "loai",
      key: "loai",
      align: "center" as const,
      width: "20%",
    },
    {
      title: "Phụ kiện",
      dataIndex: "optionList", // Đảm bảo rằng 'options' tồn tại và là một mảng
      key: "optionList",
      render: (optionList: optionData[]) => (
        <Table
          columns={[
            {
              title: "Tên",
              dataIndex: "name", // Trường name trong IOption
              key: "name",
              width: "30%",
            },
            {
              title: "Ảnh",
              dataIndex: "image",
              key: "image",
              width: "50%",
              render: (image: string) => (
                <img
                  src={image}
                  alt="option"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                  }}
                />
              ),
            },
            {
              title: "Số lượng",
              dataIndex: "quantity",
              key: "quantity",
              width: "20%",
            },
          ]}
          dataSource={optionList}
          size="small"
          scroll={{ y: 100 }}
        />
      ),
      // render: (optionList: optionData[]) =>
      //   optionList.map(
      //     (option: optionData) =>
      //       option && (
      //         <Table
      //           columns={[
      //             {
      //               title: "Tên",
      //               dataIndex: "name", // Trường name trong IOption
      //               key: "name",
      //               width: "30%",
      //             },
      //             {
      //               title: "Ảnh",
      //               dataIndex: "image",
      //               key: "image",
      //               width: "50%",
      //               render: (image: string) => (
      //                 <img
      //                   src={image}
      //                   alt="option"
      //                   style={{
      //                     width: "100px",
      //                     height: "100px",
      //                     objectFit: "cover",
      //                   }}
      //                 />
      //               ),
      //             },
      //             {
      //               title: "Số lượng",
      //               dataIndex: "quantity",
      //               key: "quantity",
      //               width: "20%",
      //             },
      //           ]}
      //           dataSource={optionList}
      //           size="small"
      //           scroll={{ y: 100 }}
      //         />
      //       )
      //   ),
    },
    {
      title: "Cập nhật",
      key: "update", // Cần có 'key' để xác định cột
      align: "center",
      width: "2%",
      render: (record: ICategory) => (
        <Link to={`/admin/category/${record._id}`}>
          <EditOutlined />
        </Link>
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: 5,
            total: totalCate,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </div>
  );
}
