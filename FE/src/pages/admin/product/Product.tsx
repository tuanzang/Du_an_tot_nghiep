import { useEffect, useState } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Button, Card, Col, Input, Radio, Row, Switch, Table } from "antd";
import {
  DownloadOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { IProduct } from "../../../interface/Products";

const customTableHeaderCellStyle: React.CSSProperties = {
  backgroundColor: "#c29957",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  height: "10px",
};

export default function Product() {
  const [value, setValue] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  // const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data?.data);
        console.log(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  //viết hàm delete

  const deleteProduct = async (id: number) => {
    try {
      //dùng confirm để xóa
      const confirm = window.confirm("Bạn muốn xóa sản phẩm này ?");
      if (confirm) {
        const response = await axios.delete(
          `http://localhost:3001/api/products/${id}`
        );
        // setIsUpdate({idDelete: id});
        // console.log(response);
        if (response.status === 200) {
          const newArr = products.filter((item) => item["_id"] !== id);
          setProducts(newArr);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeRadio = (value: number) => {
    console.log("radio checked", value);
    setValue(value);
  };

  const onChangeSwith = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      align: "center" as const,
      render: (index: number) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "20%" as const,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "20%" as const,
      render: (text: string) => (
        <img style={{ height: "70px" }} src={text} alt="error" />
      ),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      key: "price",
      width: "20%" as const,
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "loai",
      key: "loai",
      width: "20%" as const,
    },
    {
      title: "Mô tả sản phẩm",
      dataIndex: "description",
      key: "description",
      width: "20%" as const,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      width: "10%" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: "30%" as const,
      render: (key: boolean) => (
        <Switch
          style={{ backgroundColor: key ? "green" : "gray" }}
          checked={key}
          onChange={(key) => onChangeSwith(key)}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "_id",
      align: "center" as const,
      width: "10%" as const,
      render: (value: string) => (
        <div>
          <Button>
            <Link to={`/admin/product/${value}`}>Sửa</Link>
          </Button>
          <Button>
            <Link to={`/admin/product/detail/${value}`}>Xem</Link>
          </Button>
        </div>
      ),
    },
    {
      title: "Xóa",
      dataIndex: "_id",
      key: "_id",
      align: "center" as const,
      width: "10%" as const,
      render: (value: string) => (
        <Button onClick={() => deleteProduct(Number(value))}>Xóa</Button>
      ),
    },
  ];

  // const [cates, setCates] = useState<ICategory[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3001/api/categories"
  //       );
  //       setCates(response.data?.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const dataCates = cates.map((item: ICategory) => {
  //   return {
  //     value: item._id,
  //     label: item.loai,
  //   };
  // });

  const data = products.map((item: IProduct, index: number) => {
    return {
      stt: index + 1,
      key: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      description: item.description,
      quantity: item.quantity,
      loai: item.categoryId,
    };
  });

  // Define the type for Table Header Cell Props
  type CustomTableHeaderCellProps = React.ComponentProps<"th">;

  const CustomHeaderCell: React.FC<CustomTableHeaderCellProps> = (props) => (
    <th {...props} style={customTableHeaderCellStyle} />
  );
  return (
    <div>
      <BreadcrumbsCustom listLink={[]} nameHere={"Sản phẩm"} />
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
              icon={<DownloadOutlined />}
              style={{
                float: "right",
                marginLeft: "12px",
                backgroundColor: "white",
                color: "green",
                borderColor: "green",
              }}
              type="default"
            >
              Export Excel
            </Button>
            <Button
              type="link"
              href="/admin/product/add"
              icon={<PlusSquareOutlined />}
              style={{
                float: "right",
                borderColor: "#c29957",
                color: "#c29957",
              }}
            >
              Tạo sản phẩm
            </Button>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "12px" }}>
          <Col span={12}>
            <span>Trạng thái: </span>
            <Radio.Group
              onChange={(e) => onChangeRadio(e.target.value)}
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
              cell: CustomHeaderCell,
            },
          }}
          columns={columns}
          dataSource={data}
        />
      </Card>
    </div>
  );
}
