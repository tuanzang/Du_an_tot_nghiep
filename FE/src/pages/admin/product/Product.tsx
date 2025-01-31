import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Button, Card, Col, Input, Radio, Row, Switch, Table } from "antd";
import {
  DownloadOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { IProduct } from "../../../interface/Products";
import { ICategory } from "../../../interface/Categories";
import { ColumnGroupType, ColumnType } from "antd/es/table";
import { RadioChangeEvent } from "antd/lib";
// import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { socket } from "../../../socket";
import axiosInstance from "../../../config/axios";

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

export default function Product() {
  // const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const [value, setValue] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [cates, setCates] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchData = async () => {
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        axios.get("http://localhost:3001/api/products"),
        axios.get("http://localhost:3001/api/categories"),
      ]);
      setProducts(productResponse.data?.data);
      setCates(categoryResponse.data?.data);

      const sortedProducts = productResponse.data?.data.sort(
        (a: IProduct, b: IProduct) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setProducts(sortedProducts);
      setCates(categoryResponse.data?.data); // Ensure categories are correctly set
      setFilteredProducts(sortedProducts); // Set initial filtered products
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const onChangeRadio = (e: RadioChangeEvent) => {
    setValue(Number(e.target.value));

    if (e.target.value === 1) {
      // Tất cả sản phẩm
      setFilteredProducts(products);
    } else if (e.target.value === 2) {
      // Sản phẩm hoạt động (status === 1 là hoạt động)
      setFilteredProducts(products.filter((product) => product.status === 1));
    } else if (e.target.value === 3) {
      // Sản phẩm ngưng hoạt động (status === 0 là ngưng hoạt động)
      setFilteredProducts(products.filter((product) => product.status === 0));
    }
  };

  const onChangeSwitch = async (checked: boolean, productId: string) => {
    updateStatusProduct(productId, checked ? 1 : 0);
  };

  const updateStatusProduct = async (productId: string, status: number) => {
    try {
      await axiosInstance.put(`/products/${productId}`, {
        status,
      });

      fetchData();
      socket.emit("hidden product", productId);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExportExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert filteredProducts to worksheet
    const ws = XLSX.utils.json_to_sheet(
      filteredProducts.map((product) => ({
        STT: product._id, // or any other field
        "Tên sản phẩm": product.name,
        "Loại sản phẩm":
          cates.find(
            (cate) => cate._id.toString() === product.categoryId.toString()
          )?.loai || "Không có danh mục",
        "Mô tả sản phẩm": product.description,
      }))
    );

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm");

    // Export workbook to file
    XLSX.writeFile(wb, "products.xlsx");
  };

  const columns: (
    | ColumnGroupType<{
        stt: number;
        key: number;
        name: string;
        image: string[];
        price: number;
        description: string;
        quantity: number;
        variants: {
          quantity: number;
        }[];
      }>
    | ColumnType<{
        stt: number;
        key: number;
        name: string;
        image: string[];
        price: number;
        description: string;
        quantity: number;
        variants: {
          quantity: number;
        }[];
      }>
  )[] = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "20%",
      render: (images: string[]) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {images.slice(0, 1).map((image, index) => (
            <img
              key={index}
              style={{ height: "100px", width: "100px", objectFit: "cover", marginLeft: "50px" }}
              src={image}
              alt={`product-image-${index}`}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "loai",
      key: "loai",
      width: "15%",
    }, 
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      render: (_, record) => {
        const totalQuantity = record.variants.reduce((total, curr) => {
          return (total += curr.quantity);
        }, 0);

        return totalQuantity;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "10%",
      render: (status: any, record: any) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => onChangeSwitch(checked, record.key)}
        />
      ),
    },
    {
      title: "Chi tiết",
      align: "center",
      dataIndex: "key",
      key: "key",
      width: "20%",
      render: (value: IProduct) => (
        <Link to={`/admin/product/detail/${value}`}>
          <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
        </Link>
      ),
    },
  ];

  const data = filteredProducts.map((item: IProduct, index: number) => {
    const category = cates.find(
      (cate) => cate._id.toString() === item.categoryId.toString()
    );

    return {
      stt: index + 1,
      key: item._id,
      name: item.name,
      image: item.image,
      description: item.description,
      // quantity: item.quantity,
      loai: category ? category.loai : "Không tìm thấy danh mục",
      status: item.status,
      variants: item.variants,
    };
  });

  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Sản phẩm"} />
      {/* filter */}
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              id="hd-input-search"
              style={{ width: "100%", borderColor: "#c29957" }}
              size="middle"
              placeholder="Tìm kiếm sản phẩm"
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              value={searchTerm}
              onChange={handleSearchChange}
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
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>
            <Button
              type="link"
              icon={<PlusSquareOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              <Link to="/admin/product/add">Tạo sản phẩm</Link>
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
              cell: CustomHeaderCell,
            },
          }}
          dataSource={data}
          columns={columns}
        />
      </Card>
    </div>
  );
}
