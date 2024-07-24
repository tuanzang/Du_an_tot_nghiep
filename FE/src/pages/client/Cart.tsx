import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import useCartMutation, { useMyCartQuery } from "../../hooks/useCart";
import { formatPrice } from "../../services/common/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProductSelected,
  selectTotalPrice,
  updateProductSelected,
} from "../../store/cartSlice";

const { Text } = Typography;

export interface ICartItem {
  _id: string;
  name: string;
  image: string[];
  price: number;
  description: string;
  quantity: number;
  categoryId: string[];
  createdAt: string;
  updatedAt: string;
  product: {
    _id: string;
    name: string;
    image: string[];
    price: number;
    description: string;
    quantity: number;
    categoryId: string[];
    createdAt: string;
    updatedAt: string;
  };
  key: string;
}

export default function Cart() {
  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);
  const { data } = useMyCartQuery();
  const { mutate: onUpdateQuantity } = useCartMutation({
    action: "UPDATE",
  });
  const { mutate: onDeleteProduct } = useCartMutation({
    action: "DELETE",
  });

  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const rowSelection = {
    onChange: (_: any, selectedRows: ICartItem[]) => {
      dispatch(updateProductSelected(selectedRows));
    },
  };

  const productsFormatted = useMemo(() => {
    return data?.data?.products?.map((it) => ({
      ...it.product,
      ...it,
      key: it._id,
    }));
  }, [data?.data]);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    onUpdateQuantity({
      productId: productId,
      quantity: quantity,
    });
  };

  const applyDiscount = () => {
    const discount = discountCode === "DISCOUNT10" ? 10 : 0;
    setDiscountAmount(discount);
  };

  const discountedPrice = totalPrice - (totalPrice * discountAmount) / 100;

  return (
    <div>
      <main>
        {/* breadcrumb area */}
        <div className="breadcrumb-area">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-wrap">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/home">
                          <i className="fa fa-home"></i>
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        <a href="/cart">Giỏ hàng</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* breadcrumb area end */}

        <div
          className="shop-main-wrapper section-padding"
          style={{ paddingTop: "30px" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div
                  className="sidebar-single"
                  style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  <h5 className="sidebar-title" style={{ fontSize: "22px" }}>
                    <span>Sản phẩm của bạn</span>
                  </h5>
                  <Text
                    style={{
                      fontSize: "17px",
                      marginLeft: "12px",
                      marginBottom: "12px",
                      marginTop: "8px",
                    }}
                  >
                    Bạn đang có{" "}
                    <Text strong>
                      {data?.data?.products?.length || 0} sản phẩm
                    </Text>{" "}
                    trong giỏ hàng
                  </Text>
                  <div className="row">
                    <Table
                      dataSource={productsFormatted as any}
                      rowKey="key"
                      pagination={false}
                      className="cart-table"
                      rowSelection={rowSelection}
                      style={{ width: "100%", height: "auto" }}
                    >
                      <Table.Column
                        title="Sản phẩm"
                        dataIndex="name"
                        key="name"
                      />
                      <Table.Column
                        title="Giá"
                        dataIndex="price"
                        key="price"
                        render={(val) => formatPrice(val)}
                      />
                      <Table.Column
                        title="Ảnh"
                        key="image"
                        render={(val) => (
                          <img
                            src={val[0]} // Assuming first image is displayed
                            alt="product"
                            style={{ width: "120px" }}
                          />
                        )}
                      />
                      <Table.Column
                        title="Số lượng"
                        dataIndex="quantity"
                        key="quantity"
                        render={(value, record: any) => (
                          <InputNumber
                            min={1}
                            max={5}
                            value={value}
                            onChange={(quantity) =>
                              handleUpdateQuantity(record.product._id, quantity)
                            }
                          />
                        )}
                      />
                      <Table.Column
                        title="Thành tiền"
                        dataIndex="totalPrice"
                        key="totalPrice"
                        render={(_, record: any) =>
                          formatPrice(record.quantity * record.price)
                        }
                      />
                      <Table.Column
                        title="Hành động"
                        key="action"
                        render={(_, record: any) => (
                          <Popconfirm
                            title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() =>
                              onDeleteProduct(record.product._id)
                            }
                          >
                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              type="text"
                            />
                          </Popconfirm>
                        )}
                      />
                    </Table>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <Link to="/product">
                      <Button icon={<ArrowLeftOutlined />}>Giỏ hàng</Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div
                  className="sidebar-single"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Màu nền trắng với độ trong suốt
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  <h5
                    className="sidebar-title"
                    style={{ fontSize: "22px", marginBottom: "20px" }}
                  >
                    <span>Thông tin đơn hàng</span>
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "15px",
                      borderTop: "1px solid gray",
                      height: "180px",
                      boxSizing: "border-box",
                      backgroundColor: "rgba(255, 255, 255, 0.8)", // Màu nền trắng với độ trong suốt
                    }}
                  >
                    <div style={{ marginBottom: "10px" }}>
                      <span style={{ fontSize: "18px" }}>Mã giảm giá</span>
                      <Input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        style={{ marginTop: "8px" }}
                      />
                      <Button
                        type="primary"
                        style={{ marginTop: "8px" }}
                        onClick={applyDiscount}
                      >
                        Áp dụng
                      </Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>Tổng tiền</span>
                      <Text
                        style={{
                          fontWeight: 700,
                          color: "red",
                          fontSize: "20px",
                        }}
                      >
                        {formatPrice(discountedPrice)}
                      </Text>
                    </div>
                  </div>
                  <Link to="/checkout">
                    <Button
                      type="primary"
                      style={{
                        float: "right",
                        fontSize: "16px",
                        marginTop: "20px",
                      }}
                      disabled={!productSelected.length}
                    >
                      Thanh toán
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
