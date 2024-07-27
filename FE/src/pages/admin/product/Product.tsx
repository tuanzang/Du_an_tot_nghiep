import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import {
  Button,
  Card,
  Col,
  Input,
  Radio,
  Row,
  Switch,
  Table,
} from "antd";
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
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

const customTableHeaderCellStyle = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

export default function Product() {
  // const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const [value, setValue] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [cates, setCates] = useState<ICategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/products"),
          axios.get("http://localhost:3001/api/categories"),
        ]);
        setProducts(productResponse.data?.data);
        setCates(categoryResponse.data?.data);
        // console.log(productResponse.data?.data);
        // console.log(categoryResponse.data?.data);

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

    fetchData();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const deleteProduct = async (id: number) => {
    try {
      confirmAlert({
        title: "Xác nhận xoá",
        message: "Bạn có chắc muốn xoá sản phẩm này?",
        buttons: [
          {
            label: "Có",
            onClick: async () => {
              const response = await axios.delete(
                `http://localhost:3001/api/products/${id}`
              );
              if (response.status === 200) {
                const newArr = products.filter((item) => item["_id"] !== id);
                setProducts(newArr);
                setFilteredProducts(newArr); // Update filtered products as well
                toast.success("Xoá sản phẩm thành công!");
              }
            },
          },
          {
            label: "Không",
            onClick: () => { },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(Number(e.target.value));
  };

  const onChangeSwitch = (checked: boolean) => {
    console.log(`switch to ${checked}`);
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
        // "Giá sản phẩm": product.price,
        // // "Giá cũ sản phẩm": product.priceOld,
        "Loại sản phẩm":
          cates.find(
            (cate) => cate._id.toString() === product.categoryId.toString()
          )?.loai || "Không có danh mục",
        "Mô tả sản phẩm": product.description,
        // "Số lượng": product.quantity,
        // Add more fields as needed
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
      loai: string;
    }>
    | ColumnType<{
      stt: number;
      key: number;
      name: string;
      image: string[];
      price: number;
      description: string;
      quantity: number;
      loai: string;
    }>
  )[] =
    [
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
            {images.slice(0, 2).map((image, index) => (
              <img
                key={index}
                style={{ height: "70px", width: "70px", objectFit: "cover" }}
                src={image}
                alt={`product-image-${index}`}
              />
            ))}
          </div>
        ),
      },
      {
        title: "Giá sản phẩm",
        dataIndex: "price",
        key: "price",
        width: "20%",
      },
      // {
      //   title: "Giá cũ sản phẩm",
      //   dataIndex: "priceOld",
      //   key: "priceOld",
      //   width: "10%",
      // },
      {
        title: "Danh mục",
        dataIndex: "loai",
        key: "loai",
        width: "15%",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: "30%",
        render: (key: any) => (
          <Switch
            style={{ backgroundColor: key ? "green" : "gray" }}
            checked={key}
            onChange={() => onChangeSwitch(key)}
          />
        ),
      },
      {
        title: "Xóa",
        dataIndex: "key",
        key: "key",
        align: "center",
        width: "10%",
        render: (value: any) => (
          <Button onClick={() => deleteProduct(value!)}>Xóa</Button>
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
      // price: item.price,
      // priceOld: item.priceOld,
      description: item.description,
      // quantity: item.quantity,
      loai: category ? category.loai : "Không tìm thấy danh mục",
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
            <Radio.Group onChange={onChangeRadio} value={value} style={{ paddingLeft: "12px" }}>
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
              cell: (props: any) => (
                <th {...props} style={customTableHeaderCellStyle} />
              ),
            },
          }}
          dataSource={data}
          columns={columns}
        />
      </Card>

    </div>
  );
}
