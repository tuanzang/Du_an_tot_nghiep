import  { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Button, Card, Col, Input, Radio, Row, Switch, Table } from "antd";
import {
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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from "react-toastify";

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
  const [cates, setCates] = useState<ICategory[]>([]);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

const deleteProduct = async (id: number) => {
  try {
    confirmAlert({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc muốn xoá sản phẩm này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            const response = await axios.delete(
              `http://localhost:3001/api/products/${id}`
            );
            if (response.status === 200) {
              const newArr = products.filter((item) => item["_id"] !== id);
              setProducts(newArr);
              toast.success('Xoá sản phẩm thành công!');
            }
          }
        },
        {
          label: 'Không',
          onClick: () => {}
        }
      ]
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

  const columns: (
    | ColumnGroupType<{
      // _id:number;
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
      // _id:number;
        stt: number;
        key: number;
        name: string;
        image: string[];
        price: number;
        description: string;
        quantity: number;
        loai: string;
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
      render: (text) => (
        <img style={{ height: "70px" }} src={text} alt="error" />
      ),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      width: "20%",
    },
    {
      title: "Danh mục",
      dataIndex: "loai",
      key: "loai",
      width: "20%",
    },
    // {
    //   title: "Số lượng",
    //   dataIndex: "quantity",
    //   key: "quantity",
    //   width: "20%",
    // },
    // {
    //   title: "Mô tả sản phẩm",
    //   dataIndex: "description",
    //   key: "description",
    //   width: "20%",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "20%",
      render: (key) => (
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
      width: "20%",
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
      render: (value:IProduct) => (
        <Link to={`/admin/product/detail/${value}`}>
          <EyeOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
        </Link>
      ),
    },
  ];

  const data = products.map((item: IProduct, index: number) => {
    const category = cates.find(
      (cate) => cate._id.toString() === item.categoryId.toString()
    );

    return {
      stt: index + 1,
      key: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      description: item.description,
      quantity: item.quantity,
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
