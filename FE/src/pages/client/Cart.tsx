/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, InputNumber, Popconfirm, Table, Typography } from "antd";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useCartMutation, { useMyCartQuery } from "../../hooks/useCart";
import { formatPrice } from "../../services/common/formatCurrency";

import { useDispatch, useSelector } from "react-redux";
import {
  selectProductSelected,
  selectTotalPrice,
  updateProductSelected,
} from "../../store/cartSlice";
import { socket } from "../../socket";

const { Text } = Typography;
const SHIPPING_COST = 30000;

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
  variant: {
    _id: string;
    price: number;
    sizeName: string;
  };
}

export default function Cart() {
  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);

  const { data, refetch } = useMyCartQuery();
  const { mutate: onUpdateQuantity } = useCartMutation({
    action: "UPDATE",
  });
  const { mutate: onDeleteProduct } = useCartMutation({
    action: "DELETE",
  });
  // const navigate = useNavigate();

  // initial socket
  useEffect(() => {
    const onConnect = () => {
      console.log("Socket client connect");
    };

    const onHiddenProduct = () => {
      refetch();
    };

    socket.on("connect", onConnect);
    socket.on("hidden product", onHiddenProduct);

    return () => {
      socket.off("connect", onConnect);
      socket.off("hidden product", onHiddenProduct);
    };
  }, [refetch]);

  const productsFormatted = useMemo(() => {
    return data?.data?.products?.map((it) => ({
      ...it.product,
      ...it,
      key: it._id,
    }));
  }, [data?.data]);

  const handleUpdateQuantity = (
    variantId: string,
    quantity: number,
    maxQuantity: number
  ) => {
    if (quantity > maxQuantity) {
      alert("Số lượng mua vượt quá số lượng còn lại trong kho");
      return;
    }
    onUpdateQuantity({
      variantId,
      quantity: quantity,
    });
  };
  const handleDeleteProduct = (variantId: string) => {
    onDeleteProduct(variantId, {
      onSuccess: () => {
        // Lọc ra các sản phẩm không bị xóa
        const updatedProductSelected = productSelected.filter(
          (item) => item.variant._id !== variantId
        );
        dispatch(updateProductSelected(updatedProductSelected));
      },
    });
  };

  // const totalPriceWithShipping = totalPrice + SHIPPING_COST;

  // Tính tổng tiền bao gồm phí ship nếu có sản phẩm đã chọn
  const totalPriceWithShipping =
    productSelected.length > 0 ? totalPrice + SHIPPING_COST : totalPrice;

  return (
    <div>
      <main>
        {/* <!-- breadcrumb area start --> */}
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
        {/* <!-- breadcrumb area end --> */}

        <div
          className="shop-main-wrapper section-padding"
          style={{ paddingTop: "30px" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="sidebar-single">
                  <h5 className="sidebar-title">
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
                      rowSelection={{
                        onChange: (_: any, selectedRows: ICartItem[]) => {
                          dispatch(updateProductSelected(selectedRows));
                        },
                        selectedRowKeys: productSelected.map((it) => it._id),
                      }}
                    >
                      <Table.Column
                        title="Hình ảnh"
                        dataIndex="image"
                        key="image"
                        render={(images: string[]) => (
                          <img
                            src={images[0]}
                            alt="Product"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      />
                      <Table.Column
                        title="Sản phẩm"
                        dataIndex="name"
                        key="name"
                        render={(_, record: any) => {
                          return (
                            <div>
                              <p>{record.name}</p>
                              <p>Size: {record.variant.sizeName}</p>
                            </div>
                          );
                        }}
                        width={100}
                      />
                      <Table.Column
                        title="Giá"
                        key="price"
                        render={(_, record: any) =>
                          formatPrice(record.variant.price)
                        }
                      />
                      <Table.Column
                        title="Số lượng"
                        dataIndex="quantity"
                        key="quantity"
                        render={(value, record: any) => (
                          <InputNumber
                            min={1}
                            value={value}
                            onChange={(quantity) =>
                              handleUpdateQuantity(
                                record.variant._id,
                                quantity,
                                record.quantity
                              )
                            }
                          />
                        )}
                      />
                      <Table.Column
                        title="Thành tiền"
                        dataIndex="totalPrice"
                        key="totalPrice"
                        render={(_, record: any) =>
                          formatPrice(record.variant.price * record.quantity)
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
                              handleDeleteProduct(record.variant._id)
                            }
                          >
                            <Button danger>Xóa</Button>
                          </Popconfirm>
                        )}
                      />
                    </Table>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Link to="/product">
                      <Button icon={<ArrowLeftOutlined />}>
                        Tiếp tục mua hàng
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="sidebar-single">
                  <h5 className="sidebar-title">
                    <span>Thông tin đơn hàng</span>
                  </h5>
                  {productSelected.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h5>Sản phẩm đã chọn:</h5>
                      <Table
                        dataSource={productSelected}
                        rowKey="key"
                        pagination={false}
                        className="selected-products-table"
                        size="small"
                      >
                        <Table.Column
                          title="Hình ảnh"
                          dataIndex="image"
                          key="image"
                          render={(images: string[]) => (
                            <img
                              src={images[0]}
                              alt="Product"
                              style={{
                                width: "70%",
                                height: "70%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        />
                        <Table.Column
                          title="Tên sản phẩm"
                          dataIndex="name"
                          key="name"
                          render={(name, record: any) => (
                            <>
                              <p style={{ fontSize: "12px" }}>{name}</p>
                              <p style={{ fontSize: "12px" }}>
                                Size: {record.variant.sizeName}
                              </p>
                            </>
                          )}
                          width={100}
                        />
                        <Table.Column
                          title="Giá"
                          key="price"
                          render={(_, record: any) => (
                            <span style={{ fontSize: "12px" }}>
                              {formatPrice(record.variant.price)}
                            </span>
                          )}
                        />
                        <Table.Column
                          title="Số lượng"
                          dataIndex="quantity"
                          key="quantity"
                          render={(quantity) => (
                            <span style={{ fontSize: "12px" }}>{quantity}</span>
                          )}
                        />
                        <Table.Column
                          title="Thành tiền"
                          dataIndex="totalPrice"
                          key="totalPrice"
                          render={(_, record: any) => (
                            <span style={{ fontSize: "12px" }}>
                              {formatPrice(
                                record.variant.price * record.quantity
                              )}
                            </span>
                          )}
                        />
                      </Table>
                    </div>
                  )}
                  {productSelected.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 20px",
                        borderTop: "1px solid gray",
                        marginTop: "20px",
                      }}
                    >
                      <span>Phí ship</span>
                      <Text style={{ fontWeight: 800, color: "red" }}>
                        {formatPrice(SHIPPING_COST)}
                      </Text>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 20px",
                      borderTop: "1px solid gray",
                      marginTop: "20px",
                    }}
                  >
                    <span>Tổng tiền</span>
                    <Text style={{ fontWeight: 800, color: "red" }}>
                      {formatPrice(totalPriceWithShipping)}
                    </Text>
                  </div>
                  <Link to="/checkout">
                    <Button
                      type="primary"
                      style={{ float: "right" }}
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
